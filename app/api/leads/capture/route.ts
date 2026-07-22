import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getBusinessScan } from "@/lib/business-scan/get-business-scan";
import { sendEmail } from "@/lib/email/client";
import { leadReportEmail } from "@/lib/email/templates/lead-report";
import { checkRateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`leads-capture:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
    const source = typeof body?.source === "string" ? body.source.slice(0, 80) : "exit-intent";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    await (supabase.from("leads") as any).insert({ email, source });

    const result = await getBusinessScan({ businessName: businessName || "Your Business" });
    const { subject, html } = leadReportEmail(result);
    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error capturing lead:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
