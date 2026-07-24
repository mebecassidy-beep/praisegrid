import { NextResponse } from "next/server";
import { getPublicWidgetData } from "@/lib/widget/get-public-widget-data";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

// Embedded on arbitrary third-party sites via widget.js, so this must be
// readable cross-origin from anywhere - it's the same review data already
// public on Google, just re-served for the business's own site.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request, { params }: { params: { locationId: string } }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`public-widget:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: CORS_HEADERS });
  }

  const data = await getPublicWidgetData(params.locationId);

  if (!data) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers: CORS_HEADERS });
  }

  return NextResponse.json(data, {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
