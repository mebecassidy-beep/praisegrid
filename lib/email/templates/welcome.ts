export function welcomeEmail(params: { promoCode: string }): { subject: string; html: string } {
  const { promoCode } = params;

  return {
    subject: "Welcome to Praisegrid 🎉",
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 16px;">Welcome to Praisegrid</h1>
  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
    Your account is live. We aggregate your Google, Yelp, and Facebook reviews, draft
    on-brand AI responses, and help you stay on top of your reputation — all in one place.
  </p>
  <div style="margin: 24px 0; padding: 20px; border-radius: 12px; background: linear-gradient(135deg, #eff6ff, #f5f3ff); border: 1px solid #e0e7ff;">
    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6366f1;">
      A little something for signing up
    </p>
    <p style="margin: 0; font-size: 15px; color: #1e293b;">
      Use code <strong style="font-family: monospace; font-size: 16px;">${promoCode}</strong>
      for 20% off your next invoice — just enter it at checkout any time.
    </p>
  </div>
  <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
    Questions? Just reply to this email or visit our
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://praisegrid.vercel.app"}/support" style="color: #6366f1;">Support Center</a>.
  </p>
</div>
`.trim(),
  };
}
