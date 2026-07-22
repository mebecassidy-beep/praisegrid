import twilio from "twilio";

/**
 * Sends a real Twilio SMS asking a customer for a review, with a link back
 * to the business's Google review page. No-ops with a log line instead of
 * throwing when Twilio credentials aren't configured yet — same idiom as
 * send-crisis-alert.ts.
 */
export async function sendReviewRequestSms(params: {
  to: string;
  customerName: string;
  businessName: string;
  feedbackLink: string;
}): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log("[review-request] Twilio not configured, skipping SMS", {
      to: params.to,
      businessName: params.businessName,
    });
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const firstName = params.customerName.trim().split(/\s+/)[0] || "there";

  await client.messages.create({
    to: params.to,
    from: TWILIO_FROM_NUMBER,
    body: `Hi ${firstName}, thanks for choosing ${params.businessName}! Mind sharing quick feedback? ${params.feedbackLink}`,
  });
}
