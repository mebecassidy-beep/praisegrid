import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { reviewRequestEmail } from "@/lib/email/templates/review-request";
import { sendReviewRequestSms } from "@/lib/sms/send-review-request";
import { checkRateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(`review-blast:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const method = body?.method === "sms" ? "sms" : body?.method === "email" ? "email" : null;
    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const customerName = typeof body?.customerName === "string" ? body.customerName.trim() : "";
    const locationId = typeof body?.location_id === "string" ? body.location_id : "";

    if (!method || !to || !customerName || !locationId) {
      return NextResponse.json(
        { error: "method, to, customerName, and location_id are required." },
        { status: 400 }
      );
    }

    if (method === "email" && !EMAIL_RE.test(to)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const { data: location } = await (supabase.from("locations") as any)
      .select("id, name, google_place_id")
      .eq("id", locationId)
      .eq("user_id", user.id)
      .single();

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    if (!location.google_place_id) {
      return NextResponse.json(
        { error: "Connect this location's Google Business Profile first so we have a real review link to send." },
        { status: 400 }
      );
    }

    const reviewLink = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(location.google_place_id)}`;

    if (method === "email") {
      const { subject, html } = reviewRequestEmail({
        customerName,
        businessName: location.name,
        reviewLink,
      });
      await sendEmail({ to, subject, html });
    } else {
      await sendReviewRequestSms({
        to,
        customerName,
        businessName: location.name,
        reviewLink,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending review blast:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
