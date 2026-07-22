import type { BusinessScanResult } from "@/lib/business-scan/get-business-scan";

export function leadReportEmail(result: BusinessScanResult): { subject: string; html: string } {
  const ratingLine =
    result.currentRating != null && result.reviewCount != null
      ? `<li>${result.currentRating.toFixed(1)}★ average across ${result.reviewCount.toLocaleString()} Google reviews</li>`
      : "";

  const complaintLine = result.recentComplaintSnippet
    ? `<li>Recent complaint visible to customers: &ldquo;${result.recentComplaintSnippet.slice(0, 140)}${
        result.recentComplaintSnippet.length > 140 ? "…" : ""
      }&rdquo;</li>`
    : "";

  const disclaimer = result.isRealData
    ? "Pulled live from your Google Business Profile."
    : "We couldn't find a public Google listing for that name, so this is a benchmark estimate for businesses your size — connect your real Google Business Profile inside the free trial for your exact numbers.";

  return {
    subject: `Your Local Reputation & Google Maps Audit — ${result.businessName}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 4px;">Your Local Reputation &amp; Google Maps Audit</h1>
  <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">${result.businessName}</p>

  <div style="margin-bottom: 20px; padding: 20px; border-radius: 12px; background: #f8fafc; text-align: center;">
    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">AI Visibility Score</p>
    <p style="margin: 4px 0 0; font-size: 36px; font-weight: 700;">${result.reputationScore}<span style="font-size: 16px; color: #94a3b8;">/100</span></p>
  </div>

  <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; color: #334155;">
    ${ratingLine}
    ${complaintLine}
    <li>Est. ${result.estimatedLostCustomers} customers/mo lost to unresolved negative reviews</li>
  </ul>

  <p style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
    ${disclaimer}
  </p>

  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://reputicious.vercel.app"}/signup"
     style="display: inline-block; margin-top: 16px; padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
    Fix these issues — Start Free Trial
  </a>
  <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">
    No credit card required • Cancel anytime with 1-click
  </p>
</div>
`.trim(),
  };
}
