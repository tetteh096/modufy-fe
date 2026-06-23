/** Default map centres by ISO country code */
export const COUNTRY_MAP_CENTERS: Record<string, [number, number]> = {
  GH: [5.6037, -0.187],
  NG: [6.5244, 3.3792],
  KE: [-1.2921, 36.8219],
  ZA: [-26.2041, 28.0473],
  GB: [51.5074, -0.1278],
  US: [38.9072, -77.0369],
};

export const DEFAULT_MAP_CENTER: [number, number] = [5.6037, -0.187];

/** Above this (metres), browser GPS is treated as approximate */
export const GPS_ACCURACY_WARN_METERS = 120;

export function mapCenterForCountry(country?: string): [number, number] {
  if (!country) return DEFAULT_MAP_CENTER;
  return COUNTRY_MAP_CENTERS[country.toUpperCase()] ?? DEFAULT_MAP_CENTER;
}

export function hasValidCoords(lat?: number | null, lng?: number | null): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Turn-by-turn navigation destination for riders */
export function googleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** @deprecated Use googleMapsUrl for customer-facing links */
export function osmDirectionsUrl(lat: number, lng: number): string {
  return googleMapsUrl(lat, lng);
}

export function formatCoord(n: number): string {
  return n.toFixed(6);
}

export function formatCoordPair(lat: number, lng: number): string {
  return `${formatCoord(lat)}, ${formatCoord(lng)}`;
}

export function parseCoordInput(raw: string): number | null {
  const v = Number(raw.trim());
  if (Number.isNaN(v)) return null;
  return v;
}

export function coordsFromPair(latRaw: string, lngRaw: string): { lat: number; lng: number } | null {
  const lat = parseCoordInput(latRaw);
  const lng = parseCoordInput(lngRaw);
  if (lat === null || lng === null) return null;
  if (!hasValidCoords(lat, lng)) return null;
  return { lat, lng };
}

type NominatimAddress = {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
};

export type GeocodeResult = {
  full: string;
  short: string;
};

const COUNTRY_SEARCH_NAMES: Record<string, string> = {
  GH: "Ghana",
  NG: "Nigeria",
  KE: "Kenya",
  ZA: "South Africa",
  GB: "United Kingdom",
  US: "United States",
};

export function geocodeSearchContext(country?: string): {
  countrycodes: string;
  suffix: string;
} {
  const code = (country || "GH").toUpperCase();
  return {
    countrycodes: code.toLowerCase(),
    suffix: COUNTRY_SEARCH_NAMES[code] ?? "",
  };
}

export type GeocodeSearchResult = {
  lat: number;
  lng: number;
  display_name: string;
};

export async function searchGeocode(
  query: string,
  country?: string,
): Promise<GeocodeSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  try {
    const params = new URLSearchParams({
      q: trimmed,
      country: (country || "GH").toUpperCase(),
    });
    const res = await fetch(`/api/geocode/search?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return (await res.json()) as GeocodeSearchResult[];
  } catch {
    return [];
  }
}

export function formatShortAddress(data: {
  display_name?: string;
  address?: NominatimAddress;
}): string {
  const a = data.address;
  if (a) {
    const street =
      a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road;
    const area = a.suburb || a.neighbourhood || a.quarter;
    const city = a.city || a.town || a.village;
    const parts = [street, area, city].filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  if (data.display_name) {
    return data.display_name
      .split(",")
      .slice(0, 3)
      .map((s) => s.trim())
      .join(", ");
  }
  return "";
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeocodeResult | null> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
    });
    const res = await fetch(`/api/geocode/reverse?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GeocodeResult;
    if (!data.full?.trim()) return null;
    return {
      full: data.full.trim(),
      short: data.short?.trim() || data.full.trim(),
    };
  } catch {
    return null;
  }
}
