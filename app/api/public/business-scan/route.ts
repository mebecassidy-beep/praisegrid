import { NextResponse } from "next/server";
import { getBusinessScan } from "@/lib/business-scan/get-business-scan";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_NAME_LENGTH = 80;
const MAX_CITY_LENGTH = 80;
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`business-scan:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
    const city = typeof body?.city === "string" ? body.city.trim() : undefined;

    if (!businessName) {
      return NextResponse.json({ error: "businessName is required." }, { status: 400 });
    }

    const result = await getBusinessScan({
      businessName: businessName.slice(0, MAX_NAME_LENGTH),
      city: city?.slice(0, MAX_CITY_LENGTH),
    });

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error running business scan:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
