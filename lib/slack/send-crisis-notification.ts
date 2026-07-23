/**
 * Stub-safe Slack incoming-webhook post for the "Notify Crisis Manager"
 * button on high-risk reviews. Mirrors lib/sms/send-crisis-alert.ts and
 * lib/email/client.ts: no-ops with a log line instead of throwing when the
 * owner hasn't configured a webhook URL yet (Settings ->
 * components/settings/crisis-notifications-card.tsx).
 */
export async function sendCrisisSlackNotification(params: {
  webhookUrl: string | null;
  businessName: string;
  reviewerName: string | null;
  reviewText: string | null;
  platform: string;
  dashboardUrl: string;
}): Promise<{ sent: boolean }> {
  if (!params.webhookUrl) {
    console.log("[crisis-slack] No webhook configured, skipping notification", {
      businessName: params.businessName,
    });
    return { sent: false };
  }

  const reviewer = params.reviewerName || "Anonymous";
  const text =
    `:rotating_light: *Crisis Alert for ${params.businessName}*\n` +
    `A high-risk 1-star ${params.platform} review just came in from *${reviewer}*.\n` +
    (params.reviewText ? `> ${params.reviewText}\n` : "") +
    `<${params.dashboardUrl}|Open in Reputicious>`;

  const res = await fetch(params.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Slack webhook responded with ${res.status}`);
  }

  return { sent: true };
}
