import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

function renderTranscript(transcript: TranscriptMessage[]): string {
  return transcript
    .map(
      (m) =>
        `<p style="margin: 0 0 8px;"><strong>${m.role === "user" ? "Customer" : "AI"}:</strong> ${m.content}</p>`
    )
    .join("");
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`support-escalate:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const transcript: TranscriptMessage[] = Array.isArray(body?.transcript)
      ? body.transcript.filter((m: any) => m && typeof m.content === "string")
      : [];

    const supportInbox = process.env.SUPPORT_INBOX_EMAIL;
    if (!supportInbox) {
      console.log("[support-escalate] SUPPORT_INBOX_EMAIL not configured, skipping email", {
        email,
      });
      return NextResponse.json({ ok: true });
    }

    await sendEmail({
      to: supportInbox,
      replyTo: email || undefined,
      subject: `Support escalation${email ? ` from ${email}` : ""}`,
      html: `
        <div style="font-family: sans-serif;">
          <p><strong>Escalated conversation</strong>${email ? ` — reply-to: ${email}` : ""}</p>
          ${renderTranscript(transcript)}
        </div>
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error escalating support chat:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
