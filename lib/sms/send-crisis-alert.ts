import twilio from "twilio";

/**
 * Stub: builds and would send a real Twilio SMS, but no-ops with a log line
 * instead of throwing when Twilio credentials aren't configured yet.
 */
export async function sendCrisisAlertSms(params: {
  to: string;
  businessName: string;
  reviewText: string | null;
}): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    console.log("[crisis-alert] Twilio not configured, skipping SMS", {
      to: params.to,
      businessName: params.businessName,
    });
    return;
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  await client.messages.create({
    to: params.to,
    from: TWILIO_FROM_NUMBER,
    body: `⚠️ Praisegrid Crisis Alert: A high-risk 1-star review just came in for ${params.businessName}. Log in to respond immediately.`,
  });
}
