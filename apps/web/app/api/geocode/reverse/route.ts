import { NextRequest, NextResponse } from "next/server";
import { formatShortAddress } from "@/lib/geo";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required", code: "INVALID_PARAMS" },
      { status: 400 },
    );
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (
    Number.isNaN(latNum) ||
    Number.isNaN(lonNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lonNum < -180 ||
    lonNum > 180
  ) {
    return NextResponse.json(
      { error: "Invalid coordinates", code: "INVALID_COORDS" },
      { status: 400 },
    );
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(latNum));
  url.searchParams.set("lon", String(lonNum));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "BizOS/1.0 (https://bizos.app; storefront geocoding)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Reverse geocode failed", code: "GEOCODE_FAILED" },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    const data = (await res.json()) as {
      display_name?: string;
      address?: Parameters<typeof formatShortAddress>[0]["address"];
    };

    const full = data.display_name?.trim();
    if (!full) {
      return NextResponse.json(
        { error: "No address found", code: "GEOCODE_EMPTY" },
        { status: 404 },
      );
    }

    const short = formatShortAddress(data) || full;
    return NextResponse.json({ full, short });
  } catch {
    return NextResponse.json(
      { error: "Reverse geocode failed", code: "GEOCODE_FAILED" },
      { status: 502 },
    );
  }
}
