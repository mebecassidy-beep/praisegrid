import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { createRouteHandlerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

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

// Handoff endpoint for the "Talk to a human" button: pauses the AI agent
// (the widget stops sending further messages here once escalated is true),
// persists the transcript so a teammate can find it later, and emails
// support@praisegrid.com immediately so nothing waits on someone checking
// a dashboard.
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

    const requestScoped = createRouteHandlerSupabaseClient();
    const {
      data: { user },
    } = await requestScoped.auth.getUser();

    // No email input in the widget itself, this covers the common case (a
    // logged-in dashboard user escalating) without asking them to retype
    // what we already know from their session.
    const contactEmail = email || user?.email || "";

    // Stored against the account (not the raw logged-in user id) so a
    // teammate's escalation is visible to the whole account, same as every
    // other account-scoped table - see lib/team/account.ts.
    const accountId = user ? await getEffectiveAccountId(user.id, requestScoped) : null;

    const serviceRole = createServiceRoleClient();
    const { error: insertError } = await (serviceRole.from("support_conversations") as any).insert({
      user_id: accountId,
      contact_email: contactEmail || null,
      transcript,
    });

    if (insertError) {
      console.error("Failed to log support conversation:", insertError.message);
    }

    const supportInbox = process.env.SUPPORT_INBOX_EMAIL || "support@praisegrid.com";
    await sendEmail({
      to: supportInbox,
      replyTo: contactEmail || undefined,
      subject: `Support escalation${contactEmail ? ` from ${contactEmail}` : ""}`,
      html: `
        <div style="font-family: sans-serif;">
          <p><strong>Escalated conversation</strong>${contactEmail ? `, reply-to: ${contactEmail}` : ""}</p>
          ${renderTranscript(transcript)}
        </div>
      `.trim(),
    }).catch((err) => console.error("Failed to send escalation email:", err));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error escalating support chat:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
