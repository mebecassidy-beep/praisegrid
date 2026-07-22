import type { BusinessScanResult } from "@/lib/business-scan/get-business-scan";

export function leadReportEmail(result: BusinessScanResult): { subject: string; html: string } {
  return {
    subject: `Your Local Search Health Report — ${result.businessName}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 4px;">Your Local Search Health Report</h1>
  <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">${result.businessName}</p>

  <div style="margin-bottom: 20px; padding: 20px; border-radius: 12px; background: #f8fafc; text-align: center;">
    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Reputation score</p>
    <p style="margin: 4px 0 0; font-size: 36px; font-weight: 700;">${result.reputationScore}<span style="font-size: 16px; color: #94a3b8;">/100</span></p>
  </div>

  <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; color: #334155;">
    <li>${result.unansweredReviews} unanswered reviews visible to potential customers</li>
    <li>${result.unclaimedQuestions} unanswered Google Q&amp;A questions</li>
    <li>Est. ${result.estimatedLostCustomers} customers/mo lost to unresolved negative reviews</li>
  </ul>

  <p style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
    Illustrative preview using sample data, not a live Google/Yelp lookup.
  </p>

  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://reputicious.vercel.app"}/signup"
     style="display: inline-block; margin-top: 16px; padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
    Fix these issues — Start Free Trial
  </a>
</div>
`.trim(),
  };
}
