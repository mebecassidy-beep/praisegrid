import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { sendWelcomeEmailIfDue } from "@/lib/email/send-welcome";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerSupabaseClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data.user) {
      sendWelcomeEmailIfDue(supabase, data.user.id).catch(console.error);
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
