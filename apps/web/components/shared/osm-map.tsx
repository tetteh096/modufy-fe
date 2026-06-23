"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, LocateFixed, MapPin } from "lucide-react";
import {
  DEFAULT_MAP_CENTER,
  GPS_ACCURACY_WARN_METERS,
  formatCoord,
  hasValidCoords,
  reverseGeocode,
} from "@/lib/geo";

type OsmMapProps = {
  mode: "view" | "pick";
  latitude?: number | null;
  longitude?: number | null;
  defaultCenter?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  accentColor?: string;
  compact?: boolean;
  hideToolbar?: boolean;
  /** Delivery checkout: show pin coords instead of reverse-geocoded place names */
  coordHintOnly?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
};

function fixLeafletIcons(L: typeof import("leaflet")) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

function coordsMatch(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
  epsilon = 1e-6,
): boolean {
  return Math.abs(latA - latB) < epsilon && Math.abs(lngA - lngB) < epsilon;
}

export function OsmMap({
  mode,
  latitude,
  longitude,
  defaultCenter = DEFAULT_MAP_CENTER,
  zoom = 14,
  height = "16rem",
  className,
  accentColor = "#1E40AF",
  compact = false,
  hideToolbar = false,
  coordHintOnly = false,
  onLocationChange,
  onAddressResolved,
}: OsmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const accuracyRef = useRef<import("leaflet").Circle | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const onAddressResolvedRef = useRef(onAddressResolved);
  const lastEmittedRef = useRef<{ lat: number; lng: number } | null>(null);
  const geocodeRequestRef = useRef(0);
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [locating, setLocating] = useState(false);
  const [hint, setHint] = useState("");
  const [warnApprox, setWarnApprox] = useState(false);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
    onAddressResolvedRef.current = onAddressResolved;
  }, [onLocationChange, onAddressResolved]);

  useEffect(() => {
    return () => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
  }, []);

  const clearAccuracyCircle = useCallback(() => {
    if (accuracyRef.current && mapRef.current) {
      mapRef.current.removeLayer(accuracyRef.current);
      accuracyRef.current = null;
    }
  }, []);

  const showAccuracyCircle = useCallback(
    (lat: number, lng: number, meters: number) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map || meters <= 0) return;
      clearAccuracyCircle();
      accuracyRef.current = L.circle([lat, lng], {
        radius: meters,
        color: accentColor,
        fillColor: accentColor,
        fillOpacity: 0.12,
        weight: 1,
        dashArray: "4 6",
      }).addTo(map);
    },
    [accentColor, clearAccuracyCircle],
  );

  const resolvePin = useCallback(
    async (
      lat: number,
      lng: number,
      opts?: { accuracy?: number; fromGps?: boolean },
    ) => {
      const requestId = ++geocodeRequestRef.current;
      const geo = await reverseGeocode(lat, lng);
      if (requestId !== geocodeRequestRef.current) return;

      if (geo) {
        onAddressResolvedRef.current?.(geo.short);
        if (opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS) {
          setWarnApprox(true);
          setHint(
            compact
              ? `~${Math.round(opts.accuracy)}m off — move pin`
              : `~${Math.round(opts.accuracy)}m — move pin to your building`,
          );
        } else {
          setWarnApprox(false);
          setHint(geo.short);
        }
      } else {
        setWarnApprox(!!opts?.fromGps);
        setHint(compact ? "Tap map — set pin" : "Tap map or drag pin");
      }
    },
    [compact],
  );

  const scheduleResolvePin = useCallback(
    (lat: number, lng: number, opts?: { accuracy?: number; fromGps?: boolean }) => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      geocodeTimerRef.current = setTimeout(() => {
        void resolvePin(lat, lng, opts);
      }, 450);
    },
    [resolvePin],
  );

  const placeMarker = useCallback(
    (
      lat: number,
      lng: number,
      opts?: {
        moveMap?: boolean;
        accuracy?: number;
        fromGps?: boolean;
        /** Prop sync — move marker only, do not notify parent */
        syncOnly?: boolean;
        /** Skip reverse geocode (prop sync with unchanged coords) */
        skipGeocode?: boolean;
      },
    ) => {
      const L = leafletRef.current;
      const map = mapRef.current;
      if (!L || !map) return;

      const moveMap = opts?.moveMap ?? true;
      const syncOnly = opts?.syncOnly ?? false;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: mode === "pick" }).addTo(map);
        if (mode === "pick") {
          markerRef.current.on("dragstart", () => {
            clearAccuracyCircle();
            setWarnApprox(false);
          });
          markerRef.current.on("dragend", () => {
            const pos = markerRef.current?.getLatLng();
            if (!pos) return;
            lastEmittedRef.current = { lat: pos.lat, lng: pos.lng };
            onLocationChangeRef.current?.(pos.lat, pos.lng);
            scheduleResolvePin(pos.lat, pos.lng);
          });
        }
      }

      if (opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS) {
        showAccuracyCircle(lat, lng, opts.accuracy);
      } else {
        clearAccuracyCircle();
      }

      const pinZoom =
        opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS ? 16 : 18;
      if (moveMap) map.setView([lat, lng], pinZoom);

      if (!syncOnly) {
        lastEmittedRef.current = { lat, lng };
        onLocationChangeRef.current?.(lat, lng);
      }

      if (coordHintOnly && mode === "pick") {
        const coordText = `${formatCoord(lat)}, ${formatCoord(lng)}`;
        if (opts?.fromGps && opts.accuracy && opts.accuracy > GPS_ACCURACY_WARN_METERS) {
          setWarnApprox(true);
          setHint(
            compact
              ? `${coordText} · ~${Math.round(opts.accuracy)}m off`
              : `${coordText} · GPS ~${Math.round(opts.accuracy)}m off — drag pin to your door`,
          );
        } else {
          setWarnApprox(false);
          setHint(coordText);
        }
        return;
      }

      if (mode === "pick" && !opts?.skipGeocode) {
        scheduleResolvePin(lat, lng, opts);
      }
    },
    [mode, coordHintOnly, compact, clearAccuracyCircle, showAccuracyCircle, scheduleResolvePin],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      fixLeafletIcons(L);
      leafletRef.current = L;

      const center = hasValidCoords(latitude, longitude)
        ? ([latitude!, longitude!] as [number, number])
        : defaultCenter;
      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: mode === "pick",
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      if (hasValidCoords(latitude, longitude)) {
        placeMarker(latitude!, longitude!, { moveMap: false, syncOnly: true });
      }

      if (mode === "pick") {
        map.on("click", (e) => {
          placeMarker(e.latlng.lat, e.latlng.lng, { moveMap: false });
        });
      }

      setTimeout(() => map.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      markerRef.current = null;
      accuracyRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once per mount
  }, [mode]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasValidCoords(latitude, longitude)) {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      clearAccuracyCircle();
      setHint("");
      setWarnApprox(false);
      lastEmittedRef.current = null;
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
  }, [latitude, longitude, placeMarker, clearAccuracyCircle]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setHint(compact ? "Tap map — set pin" : "Tap map — GPS unavailable");
      return;
    }
    setLocating(true);
    setHint(compact ? "Locating…" : "Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        placeMarker(pos.coords.latitude, pos.coords.longitude, {
          accuracy: pos.coords.accuracy,
          fromGps: true,
        });
      },
      () => {
        setLocating(false);
        setHint(compact ? "Tap map — set pin" : "Tap map — GPS denied");
        setWarnApprox(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }

  return (
    <div className={className}>
      {mode === "pick" && !hideToolbar ? (
        <div className="osm-map-toolbar">
          <p className="osm-map-help">
            {compact
              ? "Confirm pin — tap map or drag marker"
              : "Tap map — drag pin — save store location"}
          </p>
          <button
            type="button"
            className="osm-map-locate-btn"
            style={{ borderColor: accentColor, color: accentColor }}
            onClick={useMyLocation}
            disabled={locating}
          >
            <LocateFixed className="h-4 w-4" />
            {locating ? "Locating…" : compact ? "Near me" : "Use my location"}
          </button>
          {warnApprox ? (
            <p className="osm-map-warn">
              <AlertCircle className="h-3.5 w-3.5" />
              {compact ? "Approximate — move pin" : "Approximate — adjust pin"}
            </p>
          ) : null}
          {hint ? (
            <p className={`osm-map-hint${warnApprox ? " osm-map-hint-warn" : ""}`}>
              <MapPin className="h-3.5 w-3.5" />
              {hint}
            </p>
          ) : null}
        </div>
      ) : null}
      <div ref={containerRef} className="osm-map-canvas" style={{ height }} />
    </div>
  );
}
