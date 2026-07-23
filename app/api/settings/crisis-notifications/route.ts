import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

const MAX_LENGTH = 500;

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const webhookUrl = typeof body?.crisis_slack_webhook_url === "string" ? body.crisis_slack_webhook_url.trim() : "";

    if (webhookUrl && !webhookUrl.startsWith("https://hooks.slack.com/")) {
      return NextResponse.json(
        { error: "That doesn't look like a Slack incoming webhook URL." },
        { status: 400 }
      );
    }

    const { error } = await (supabase.from("profiles") as any)
      .update({ crisis_slack_webhook_url: webhookUrl.slice(0, MAX_LENGTH) || null })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating crisis webhook:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
