import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

/** Fired automatically (no user action) when the support widget itself fails
 * to get a reply, an unhandled system error rather than something a user
 * described. Files the same standardized bug report format the AI agent's
 * file_bug_report tool uses, so it can be copy-pasted straight into a
 * terminal coding assistant. */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`support-report-error:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const context = typeof body?.context === "string" ? body.context.slice(0, 500) : "Unknown error";
    const page = typeof body?.page === "string" ? body.page.slice(0, 200) : "an unknown page";

    const markdown = [
      "[BUG REPORT]",
      "- Symptom: The support chat widget failed to get a reply from the AI agent.",
      `- User Context: Occurred on ${page}. Client-side error: ${context}`,
      "- Recommended Terminal Fix: Check the Vercel function logs for /api/support/chat around this timestamp, look for a 5xx or timeout from the Anthropic API call and confirm ANTHROPIC_API_KEY is still valid.",
    ].join("\n");

    const supportInbox = process.env.SUPPORT_INBOX_EMAIL || "support@praisegrid.com";
    await sendEmail({
      to: supportInbox,
      subject: "[BUG REPORT] Support chat failed to respond",
      html: `<pre style="font-family: monospace; white-space: pre-wrap; font-size: 13px;">${markdown}</pre>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error reporting client error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
