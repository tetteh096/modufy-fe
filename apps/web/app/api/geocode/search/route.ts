import { NextRequest, NextResponse } from "next/server";
import { geocodeSearchContext } from "@/lib/geo";

const NOMINATIM_HEADERS = {
  Accept: "application/json",
  "User-Agent": "Modufy/1.0 (https://modufy.app; storefront geocoding)",
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const country = req.nextUrl.searchParams.get("country") ?? "GH";

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "q must be at least 2 characters", code: "INVALID_PARAMS" },
      { status: 400 },
    );
  }

  const { countrycodes, suffix } = geocodeSearchContext(country);
  const searchText = suffix ? `${q} ${suffix}` : q;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", searchText);
  url.searchParams.set("limit", "5");
  url.searchParams.set("accept-language", "en");
  url.searchParams.set("countrycodes", countrycodes);

  try {
    const res = await fetch(url.toString(), {
      headers: NOMINATIM_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Place search failed", code: "GEOCODE_SEARCH_FAILED" },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    const data = (await res.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;

    const results = data
      .map((row) => {
        const lat = Number(row.lat);
        const lng = Number(row.lon);
        const display_name = row.display_name?.trim();
        if (!display_name || Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { lat, lng, display_name };
      })
      .filter(Boolean);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Place search failed", code: "GEOCODE_SEARCH_FAILED" },
      { status: 502 },
    );
  }
}
