import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getBusinessScan, type BusinessScanResult } from "@/lib/business-scan/get-business-scan";
import { computeLiveScore, getPlaceDetails, isGooglePlacesConfigured } from "@/lib/google-places/client";
import { sendEmail } from "@/lib/email/client";
import { leadReportEmail } from "@/lib/email/templates/lead-report";
import { ftcShieldAuditEmail } from "@/lib/email/templates/ftc-shield-audit";
import { checkRateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

const TEMPLATES = { standard: leadReportEmail, ftc_shield: ftcShieldAuditEmail } as const;

/**
 * Resolves the business scan result for the email. When a placeId is
 * supplied (the homepage live-scan widget already resolved one via
 * autocomplete), look it up directly instead of re-running a name-based
 * text search — precise, and avoids ever mismatching a different location
 * with the same name than what the visitor already saw on screen.
 */
async function resolveScanResult(businessName: string, placeId: string | null): Promise<BusinessScanResult> {
  if (placeId && isGooglePlacesConfigured()) {
    try {
      const details = await getPlaceDetails(placeId);
      const live = computeLiveScore(details);
      return {
        businessName: details.name,
        currentRating: details.rating,
        reviewCount: details.userRatingCount,
        reputationScore: live.score,
        recentComplaintSnippet: live.recentNegativeReviews[0]?.text ?? null,
        estimatedLostCustomers: live.estimatedLostCustomers,
        isRealData: true,
      };
    } catch (error) {
      console.error("Error resolving placeId for lead capture, falling back to name search:", error);
    }
  }

  return getBusinessScan({ businessName: businessName || "Your Business" });
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`leads-capture:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
    const placeId = typeof body?.placeId === "string" && body.placeId.trim() ? body.placeId.trim() : null;
    const source = typeof body?.source === "string" ? body.source.slice(0, 80) : "exit-intent";
    const template = body?.template === "ftc_shield" ? "ftc_shield" : "standard";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    await (supabase.from("leads") as any).insert({ email, source });

    const result = await resolveScanResult(businessName, placeId);
    const { subject, html } = TEMPLATES[template](result);
    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error capturing lead:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
