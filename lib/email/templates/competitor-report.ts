export function competitorReportEmail(params: {
  companyName: string;
  yourRating: number;
  yourReviewCount: number;
  competitorName: string;
  competitorRating: number;
  competitorReviewCount: number;
  isRealData?: boolean;
}): { subject: string; html: string } {
  const { companyName, yourRating, yourReviewCount, competitorName, competitorRating, competitorReviewCount, isRealData } =
    params;
  const ahead = yourRating >= competitorRating;

  return {
    subject: `Weekly competitor check: ${companyName} vs. ${competitorName}`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 4px;">Competitor Review-Gap Report</h1>
  <p style="margin: 0 0 24px; font-size: 13px; color: #64748b;">${companyName} vs. ${competitorName} — this week</p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    <tr>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">${companyName} (you)</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${yourRating.toFixed(1)}★</p>
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">${yourReviewCount} reviews</p>
      </td>
      <td style="width: 12px;"></td>
      <td style="width: 50%; padding: 12px; border-radius: 10px; background: #f8fafc;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">${competitorName}</p>
        <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700;">${competitorRating.toFixed(1)}★</p>
        <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">${competitorReviewCount} reviews</p>
      </td>
    </tr>
  </table>

  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
    ${
      ahead
        ? `You're currently ahead of ${competitorName} — keep responding quickly to stay there.`
        : `${competitorName} is currently ahead — responding to your recent reviews is the fastest way to close the gap.`
    }
  </p>

  <p style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
    ${
      isRealData
        ? "Pulled live from Google Business Profile data."
        : `We couldn't find a public Google listing for "${competitorName}" — this is a benchmark estimate. Double-check the spelling in your dashboard settings for a live lookup.`
    }
  </p>

  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://praisegrid.vercel.app"}/dashboard"
     style="display: inline-block; margin-top: 16px; padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
    View full dashboard
  </a>
</div>
`.trim(),
  };
}
