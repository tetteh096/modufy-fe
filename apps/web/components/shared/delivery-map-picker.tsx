"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import {
  GPS_ACCURACY_WARN_METERS,
  formatCoordPair,
  formatShortAddress,
  googleMapsUrl,
  hasValidCoords,
  mapCenterForCountry,
  searchGeocode,
  reverseGeocode,
  type GeocodeSearchResult,
} from "@/lib/geo";

type DeliveryMapPickerProps = {
  latitude?: number | null;
  longitude?: number | null;
  country?: string;
  accentColor?: string;
  height?: string;
  className?: string;
  onChange: (lat: number | null, lng: number | null, address?: string | null) => void;
};

function coordsMatch(latA: number, lngA: number, latB: number, lngB: number, eps = 1e-6) {
  return Math.abs(latA - latB) < eps && Math.abs(lngA - lngB) < eps;
}

export function DeliveryMapPicker({
  latitude,
  longitude,
  country,
  accentColor = "#1E40AF",
  height = "16rem",
  className,
  onChange,
}: DeliveryMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const accuracyRef = useRef<import("leaflet").Circle | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onChangeRef = useRef(onChange);
  const skipSearchRef = useRef(false);
  const lastEmittedRef = useRef<{ lat: number; lng: number } | null>(null);
  const placeMarkerRef = useRef<
    ((
      lat: number,
      lng: number,
      opts?: {
        moveMap?: boolean;
        zoom?: number;
        fromGps?: boolean;
        accuracy?: number;
        syncOnly?: boolean;
        placeLabel?: string;
      },
    ) => void) | null
  >(null);

  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeocodeSearchResult[]>([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeLabel, setPlaceLabel] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const pinned =
    hasValidCoords(latitude, longitude) ? { lat: latitude!, lng: longitude! } : null;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const clearAccuracyCircle = useCallback(() => {
    if (accuracyRef.current && mapRef.current) {
      mapRef.current.removeLayer(accuracyRef.current);
      accuracyRef.current = null;
    }
    setGpsAccuracy(null);
  }, []);

  const emitPin = useCallback(
    (
      lat: number,
      lng: number,
      opts?: { placeLabel?: string; fromGps?: boolean; accuracy?: number; address?: string },
    ) => {
      lastEmittedRef.current = { lat, lng };
      if (opts?.placeLabel !== undefined) {
        setPlaceLabel(opts.placeLabel || null);
      } else if (!opts?.fromGps) {
        setPlaceLabel(null);
      }
      if (opts?.fromGps && opts.accuracy) {
        setGpsAccuracy(opts.accuracy);
      } else if (!opts?.fromGps) {
        setGpsAccuracy(null);
      }
      const address = opts?.address ?? opts?.placeLabel ?? null;
      onChangeRef.current(lat, lng, address);
      if (!address) {
        void reverseGeocode(lat, lng).then((result) => {
          if (result?.full) {
            setPlaceLabel(formatShortAddress({ display_name: result.full }));
            onChangeRef.current(lat, lng, result.full);
          }
        });
      }
    },
    [],
  );

  const placeMarker = useCallback(
    (
      lat: number,
      lng: number,
      opts?: {
        moveMap?: boolean;
        zoom?: number;
        fromGps?: boolean;
        accuracy?: number;
        syncOnly?: boolean;
        placeLabel?: string;
        address?: string;
      },
    ) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      const syncOnly = opts?.syncOnly ?? false;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current.on("dragstart", () => {
          clearAccuracyCircle();
          setError(null);
        });
        markerRef.current.on("dragend", () => {
          const pos = markerRef.current?.getLatLng();
          if (!pos) return;
          emitPin(pos.lat, pos.lng);
        });
      }

      if (opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS) {
        clearAccuracyCircle();
        accuracyRef.current = L.circle([lat, lng], {
          radius: opts.accuracy,
          color: accentColor,
          fillColor: accentColor,
          fillOpacity: 0.12,
          weight: 1,
          dashArray: "4 6",
        }).addTo(map);
        setGpsAccuracy(opts.accuracy);
      } else if (!syncOnly) {
        clearAccuracyCircle();
      }

      if (opts?.moveMap !== false) {
        const zoom =
          opts?.zoom ??
          (opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS ? 16 : 18);
        map.setView([lat, lng], zoom, { animate: true });
      }

      if (!syncOnly) {
        emitPin(lat, lng, {
          placeLabel: opts?.placeLabel,
          fromGps: opts?.fromGps,
          accuracy: opts?.accuracy,
          address: opts?.address,
        });
      }
    },
    [accentColor, clearAccuracyCircle, emitPin],
  );

  placeMarkerRef.current = placeMarker;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      leafletRef.current = L;
      const defaultCenter = mapCenterForCountry(country);
      const center = hasValidCoords(latitude, longitude)
        ? ([latitude, longitude] as [number, number])
        : defaultCenter;

      const map = L.map(containerRef.current, {
        center,
        zoom: hasValidCoords(latitude, longitude) ? 16 : 13,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      map.on("click", (e) => {
        setResults([]);
        setError(null);
        placeMarkerRef.current?.(e.latlng.lat, e.latlng.lng, { moveMap: false });
      });

      if (hasValidCoords(latitude, longitude)) {
        placeMarkerRef.current?.(latitude!, longitude!, { moveMap: false, syncOnly: true });
      }

      setTimeout(() => map.invalidateSize(), 120);
      if (!cancelled) setReady(true);
    })().catch(() => {
      if (!cancelled) setError("We couldn't load the map. You can still add directions below.");
    });

    return () => {
      cancelled = true;
      markerRef.current = null;
      accuracyRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      placeMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    if (!mapRef.current || !ready) return;

    if (!hasValidCoords(latitude, longitude)) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      clearAccuracyCircle();
      lastEmittedRef.current = null;
      setPlaceLabel(null);
      return;
    }

    const emitted = lastEmittedRef.current;
    if (emitted && coordsMatch(latitude!, longitude!, emitted.lat, emitted.lng)) {
      return;
    }

    const markerPos = markerRef.current?.getLatLng();
    if (markerPos && coordsMatch(latitude!, longitude!, markerPos.lat, markerPos.lng)) {
      return;
    }

    placeMarker(latitude!, longitude!, { moveMap: false, syncOnly: true });
  }, [latitude, longitude, ready, placeMarker, clearAccuracyCircle]);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setSearchAttempted(false);
      return;
    }

    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const handle = setTimeout(async () => {
      setSearching(true);
      setSearchAttempted(true);
      try {
        const data = await searchGeocode(search, country);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [search, country]);

  function shortPlaceLabel(displayName: string) {
    return formatShortAddress({ display_name: displayName }) || displayName;
  }

  function handleResultClick(result: GeocodeSearchResult) {
    const label = shortPlaceLabel(result.display_name);
    skipSearchRef.current = true;
    setResults([]);
    setSearchAttempted(false);
    setSearch(label);
    setError(null);
    placeMarker(result.lat, result.lng, {
      zoom: 16,
      placeLabel: label,
      address: result.display_name,
    });
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support GPS. Search or tap the map instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        placeMarker(pos.coords.latitude, pos.coords.longitude, {
          zoom: 17,
          fromGps: true,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Allow location access, or search / tap the map to drop your pin.");
        } else {
          setError("Couldn't get your location. Search or tap the map instead.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function handleClearPin() {
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    clearAccuracyCircle();
    setSearch("");
    setResults([]);
    setPlaceLabel(null);
    setError(null);
    lastEmittedRef.current = null;
    onChangeRef.current(null, null, null);
  }

  const approxGps =
    gpsAccuracy !== null && gpsAccuracy > GPS_ACCURACY_WARN_METERS;

  const resultsOpen =
    results.length > 0 ||
    (searchAttempted && !searching && search.trim().length >= 2);

  return (
    <div
      className={
        className
          ? `delivery-map-picker${resultsOpen ? " is-results-open" : ""} ${className}`
          : `delivery-map-picker${resultsOpen ? " is-results-open" : ""}`
      }
    >
      <div className="delivery-map-picker-toolbar">
        <div className="delivery-map-picker-search-wrap">
          <Search className="delivery-map-picker-search-icon h-4 w-4" aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              skipSearchRef.current = false;
              setSearch(e.target.value);
            }}
            placeholder="Search a place — Madina, Spintex, East Legon…"
            className="delivery-map-picker-search"
            autoComplete="off"
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
          />
          {searching ? (
            <Loader2 className="delivery-map-picker-search-action h-4 w-4 animate-spin" />
          ) : search ? (
            <button
              type="button"
              className="delivery-map-picker-search-action"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setResults([]);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}

          {results.length > 0 ? (
            <div className="delivery-map-picker-results" role="listbox">
              {results.map((result, index) => {
                const primary = shortPlaceLabel(result.display_name);
                const secondary = result.display_name
                  .slice(primary.length)
                  .replace(/^,\s*/, "")
                  .trim();
                return (
                  <button
                    key={`${result.lat}-${result.lng}-${index}`}
                    type="button"
                    role="option"
                    className="delivery-map-picker-result"
                    onClick={() => handleResultClick(result)}
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <span className="delivery-map-picker-result-text">
                      <strong>{primary}</strong>
                      {secondary ? <small>{secondary}</small> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : searchAttempted && !searching && search.trim().length >= 2 ? (
            <div className="delivery-map-picker-results delivery-map-picker-results-empty">
              No places found — try a nearby landmark or tap the map.
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="delivery-map-picker-locate"
          style={{ backgroundColor: accentColor }}
          onClick={handleUseMyLocation}
          disabled={locating}
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      <div className="delivery-map-picker-canvas-wrap" style={{ height }}>
        <div ref={containerRef} className="delivery-map-picker-canvas" />
        {!ready && !error ? (
          <div className="delivery-map-picker-loading">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading map…</span>
          </div>
        ) : null}
      </div>

      {error ? <p className="delivery-map-picker-error">{error}</p> : null}

      {pinned ? (
        <div className="delivery-map-picker-pin" style={{ borderColor: `${accentColor}33` }}>
          <MapPin className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
          <div className="delivery-map-picker-pin-body">
            <p className="delivery-map-picker-pin-title">
              {placeLabel ?? "Delivery pin set"}
            </p>
            <p className="delivery-map-picker-pin-coords">
              {formatCoordPair(pinned.lat, pinned.lng)}
            </p>
            {approxGps ? (
              <p className="delivery-map-picker-pin-warn">
                <AlertCircle className="h-3.5 w-3.5" />
                GPS ~{Math.round(gpsAccuracy!)}m off — drag the pin to your door
              </p>
            ) : (
              <p className="delivery-map-picker-pin-help">
                Your rider will enter these coordinates in Google Maps.
              </p>
            )}
            <Link
              href={googleMapsUrl(pinned.lat, pinned.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="delivery-map-picker-pin-link"
              style={{ color: accentColor }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview in Google Maps
            </Link>
          </div>
          <button
            type="button"
            className="delivery-map-picker-clear"
            aria-label="Remove delivery pin"
            onClick={handleClearPin}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <p className="delivery-map-picker-hint">
          Search a place, tap the map, or use your GPS to drop a delivery pin.
        </p>
      )}
    </div>
  );
}
