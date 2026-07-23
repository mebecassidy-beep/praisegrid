import twilio from "twilio";

/**
 * "Olive branch" win-back text for a customer who left a low (1-2 star)
 * private rating through the Feedback Shield flow. Stub-safe: no-ops with a
 * log line instead of throwing when Twilio credentials aren't configured
 * yet, same idiom as send-crisis-alert.ts and send-review-request.ts.
 */
export async function sendWinbackSms(params: {
  to: string;
  customerName: string | null;
  businessName: string;
}): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log("[winback-sms] Twilio not configured, skipping SMS", {
      to: params.to,
      businessName: params.businessName,
    });
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const firstName = params.customerName?.trim().split(/\s+/)[0] || "there";

  await client.messages.create({
    to: params.to,
    from: TWILIO_FROM_NUMBER,
    body: `Hi ${firstName}, it's ${params.businessName}. We saw your feedback and we want to make it right. Reply here and let us know how, this one's on us.`,
  });
}
