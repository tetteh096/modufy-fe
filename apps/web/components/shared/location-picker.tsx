"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OsmMap } from "@/components/shared/osm-map";
import { cn } from "@/lib/utils";
import {
  coordsFromPair,
  formatCoord,
  googleMapsUrl,
  hasValidCoords,
  mapCenterForCountry,
} from "@/lib/geo";

type LocationPickerProps = {
  latitude?: number | null;
  longitude?: number | null;
  country?: string;
  onChange: (lat: number | null, lng: number | null) => void;
};

export function LocationPicker({
  latitude,
  longitude,
  country,
  onChange,
}: LocationPickerProps) {
  const [latText, setLatText] = useState("");
  const [lngText, setLngText] = useState("");

  useEffect(() => {
    setLatText(
      typeof latitude === "number" && !Number.isNaN(latitude) ? formatCoord(latitude) : "",
    );
    setLngText(
      typeof longitude === "number" && !Number.isNaN(longitude) ? formatCoord(longitude) : "",
    );
  }, [latitude, longitude]);

  function applyCoords(lat: number, lng: number) {
    onChange(lat, lng);
    setLatText(formatCoord(lat));
    setLngText(formatCoord(lng));
  }

  function tryApplyFromInputs() {
    const pair = coordsFromPair(latText, lngText);
    if (pair) applyCoords(pair.lat, pair.lng);
  }

  function clearPin() {
    onChange(null, null);
    setLatText("");
    setLngText("");
  }

  function useNearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => applyCoords(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 },
    );
  }

  const pinned = hasValidCoords(latitude, longitude);

  return (
    <div className="location-picker space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="store-lat" className="text-xs font-medium text-muted-foreground">
            Latitude
          </Label>
          <Input
            id="store-lat"
            inputMode="decimal"
            placeholder="5.603700"
            value={latText}
            onChange={(e) => setLatText(e.target.value)}
            onBlur={tryApplyFromInputs}
            className="h-9 font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="store-lng" className="text-xs font-medium text-muted-foreground">
            Longitude
          </Label>
          <Input
            id="store-lng"
            inputMode="decimal"
            placeholder="-0.187000"
            value={lngText}
            onChange={(e) => setLngText(e.target.value)}
            onBlur={tryApplyFromInputs}
            className="h-9 font-mono text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 sm:mb-0"
          onClick={useNearMe}
        >
          <Navigation className="h-3.5 w-3.5" />
          Near me
        </Button>
      </div>

      <OsmMap
        mode="pick"
        hideToolbar
        latitude={latitude}
        longitude={longitude}
        defaultCenter={mapCenterForCountry(country)}
        height="15rem"
        className="location-picker-map overflow-hidden rounded-lg border border-border/80 shadow-xs"
        onLocationChange={(lat, lng) => applyCoords(lat, lng)}
      />

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3 py-2.5 text-xs",
          pinned
            ? "border-primary/20 bg-primary/5 text-foreground"
            : "border-dashed border-border/80 bg-muted/20 text-muted-foreground",
        )}
      >
        {pinned ? (
          <>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {formatCoord(latitude!)}, {formatCoord(longitude!)}
            </span>
            <Link
              href={googleMapsUrl(latitude!, longitude!)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Preview in Google Maps
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={clearPin}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear pin
            </Button>
          </>
        ) : (
          <span>No pin set — your contact page map stays hidden until you drop one</span>
        )}
      </div>
    </div>
  );
}
