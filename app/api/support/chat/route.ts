import { NextResponse } from "next/server";
import { generateSupportReply, type SupportMessage } from "@/lib/anthropic/generate-support-reply";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { detectCancellationIntent, detectPricingHesitation } from "@/lib/support/detect-signals";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 800;
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`support-chat:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const messages: unknown = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages is required." }, { status: 400 });
    }

    const history: SupportMessage[] = messages
      .slice(-MAX_MESSAGES)
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m: any) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (history.length === 0) {
      return NextResponse.json({ error: "No valid messages provided." }, { status: 400 });
    }

    const supabase = createRouteHandlerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content ?? "";

    const { reply, bugReportFiled } = await generateSupportReply(history, {
      userId: user?.id ?? null,
      pricingHesitation: detectPricingHesitation(lastUserMessage),
      cancellationIntent: detectCancellationIntent(lastUserMessage),
    });

    return NextResponse.json({ reply, bugReportFiled });
  } catch (error: any) {
    console.error("Error generating support reply:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
