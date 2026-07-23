import type { DashboardData } from "@/lib/dashboard/queries";

export function reputationReportEmail(params: {
  companyName: string;
  frequencyLabel: "week" | "month";
  data: DashboardData;
}): { subject: string; html: string } {
  const { companyName, frequencyLabel, data } = params;
  const healthScoreDisplay = data.healthScore === null ? "—" : `${data.healthScore}/100`;

  return {
    subject: `Your ${frequencyLabel}ly Reputation Impact report`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 4px;">Reputation Impact report</h1>
  <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">
    ${companyName} — this past ${frequencyLabel}
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Health score</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${healthScoreDisplay}</p>
      </td>
      <td style="width: 12px;"></td>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Average rating</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${data.avgRating || "—"}</p>
      </td>
    </tr>
  </table>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Response rate</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${data.responseRate}%</p>
      </td>
      <td style="width: 12px;"></td>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Pending reviews</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${data.pendingCount}</p>
      </td>
    </tr>
  </table>

  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
    ${data.totalReviews} total reviews tracked across ${data.locations.length || 1} location${data.locations.length === 1 ? "" : "s"}.
  </p>

  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://praisegrid.vercel.app"}/dashboard"
     style="display: inline-block; margin-top: 8px; padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
    View full dashboard
  </a>
</div>
`.trim(),
  };
}
