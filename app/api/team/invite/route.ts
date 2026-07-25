import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";
import { hasProAccess } from "@/lib/subscription";
import { sendEmail } from "@/lib/email/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const accountId = await getEffectiveAccountId(user.id, supabase);

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("subscription_tier, company_name")
    .eq("id", accountId)
    .single();

  if (!hasProAccess(profile?.subscription_tier)) {
    return NextResponse.json({ error: "Team seats are a Pro feature." }, { status: 403 });
  }

  const { data: inserted, error } = await (supabase.from("team_members") as any)
    .insert({ account_owner_id: accountId, invited_email: email })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That email has already been invited." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const businessName = profile?.company_name || "a Praisegrid account";
  const signupUrl = `${new URL(request.url).origin}/signup`;
  sendEmail({
    to: email,
    subject: `You've been invited to join ${businessName} on Praisegrid`,
    html: `
      <p>You've been invited to join <strong>${businessName}</strong>'s Praisegrid account.</p>
      <p>Sign up with this email address (${email}) and you'll automatically get full access to their reviews, responses, and settings:</p>
      <p><a href="${signupUrl}">${signupUrl}</a></p>
    `,
  }).catch(console.error);

  return NextResponse.json({ success: true, id: inserted.id });
}
