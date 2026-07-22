import { NextResponse } from "next/server";
import { computeLiveScore, getPlaceDetails, isGooglePlacesConfigured } from "@/lib/google-places/client";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export async function GET(request: Request) {
  if (!isGooglePlacesConfigured()) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`places-details:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const placeId = (searchParams.get("placeId") || "").trim();

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required." }, { status: 400 });
  }

  try {
    const details = await getPlaceDetails(placeId);
    const live = computeLiveScore(details);
    return NextResponse.json({ configured: true, details, live });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}
