export function reviewRequestEmail(params: {
  customerName: string;
  businessName: string;
  feedbackLink: string;
}): { subject: string; html: string } {
  const { customerName, businessName, feedbackLink } = params;
  const firstName = customerName.trim().split(/\s+/)[0] || "there";

  return {
    subject: `How did we do, ${firstName}?`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 16px;">Thanks for choosing ${businessName}!</h1>
  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
    Hi ${firstName}, we'd love to hear about your experience. It only takes a few seconds, and you'll get the
    option to share it publicly too if you'd like.
  </p>
  <a href="${feedbackLink}"
     style="display: inline-block; margin-top: 20px; padding: 12px 24px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white; text-decoration: none; font-size: 15px; font-weight: 600;">
    Share your feedback
  </a>
  <p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">
    Thanks again for your business!
  </p>
</div>
`.trim(),
  };
}
