import { NextResponse } from "next/server";
import { generateInstantFixResponse } from "@/lib/anthropic/generate-instant-fix";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_BUSINESS_NAME_LENGTH = 80;
const MAX_COMPLAINT_LENGTH = 500;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`instant-fix:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
    const complaint = typeof body?.complaint === "string" ? body.complaint.trim() : "";

    if (!businessName || !complaint) {
      return NextResponse.json(
        { error: "businessName and complaint are required." },
        { status: 400 }
      );
    }

    const response = await generateInstantFixResponse({
      businessName: businessName.slice(0, MAX_BUSINESS_NAME_LENGTH),
      complaint: complaint.slice(0, MAX_COMPLAINT_LENGTH),
    });

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error generating instant fix:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
