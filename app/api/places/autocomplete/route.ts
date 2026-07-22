import { NextResponse } from "next/server";
import { autocompleteBusiness, isGooglePlacesConfigured } from "@/lib/google-places/client";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export async function GET(request: Request) {
  if (!isGooglePlacesConfigured()) {
    return NextResponse.json({ configured: false, suggestions: [] }, { status: 200 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`places-autocomplete:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const input = (searchParams.get("input") || "").trim();

  if (input.length < 3) {
    return NextResponse.json({ configured: true, suggestions: [] });
  }

  try {
    const suggestions = await autocompleteBusiness(input);
    return NextResponse.json({ configured: true, suggestions });
  } catch (error) {
    console.error("Error in places autocomplete:", error);
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}
