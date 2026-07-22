import { Resend } from "resend";

// Resend's constructor throws synchronously on a falsy key, which would crash
// module load (and the build) before RESEND_API_KEY is configured — fall back
// to a placeholder so the app can boot; sendEmail() below is the real gate.
export const resend = new Resend(process.env.RESEND_API_KEY || "re_not_configured");

export const FROM_EMAIL = process.env.EMAIL_FROM || "Reputicious <hello@reputicious.com>";

/** Stub-safe email send: no-ops with a log line instead of erroring when
 * RESEND_API_KEY isn't configured yet. */
export async function sendEmail(params: { to: string; subject: string; html: string; replyTo?: string }): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not configured, skipping send", {
      to: params.to,
      subject: params.subject,
    });
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });
}
