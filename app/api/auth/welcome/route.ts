import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendWelcomeEmailByEmailIfDue } from "@/lib/email/send-welcome";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`auth-welcome:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "email is required." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    await sendWelcomeEmailByEmailIfDue(supabase, email);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
