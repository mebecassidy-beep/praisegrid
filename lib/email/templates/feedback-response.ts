export function feedbackResponseEmail(params: {
  businessName: string;
  customerName: string | null;
  rating: number;
  comment: string | null;
  isLowRating: boolean;
}): { subject: string; html: string } {
  const { businessName, customerName, rating, comment, isLowRating } = params;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return {
    subject: isLowRating
      ? `Private feedback needs your attention — ${rating}★ for ${businessName}`
      : `New private feedback for ${businessName} (${rating}★)`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">
  <h1 style="font-size: 20px; margin: 0 0 16px;">
    ${isLowRating ? "A customer wants to talk before they post publicly" : "New private feedback came in"}
  </h1>
  <p style="font-size: 22px; letter-spacing: 2px; color: #f59e0b; margin: 0 0 12px;">${stars}</p>
  <p style="font-size: 14px; color: #64748b; margin: 0 0 4px;">From: ${customerName || "Anonymous customer"}</p>
  ${
    comment
      ? `<div style="margin: 16px 0; padding: 16px; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; color: #334155;">"${comment}"</div>`
      : ""
  }
  <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
    This was submitted privately through your Feedback Shield link — it was never posted publicly. The same
    link also offered this customer a public Google/Yelp review option, regardless of the rating they gave here.
  </p>
</div>
`.trim(),
  };
}
