import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient, requireUser } from "@/lib/supabase/server";

export async function POST() {
  const user = await requireUser();
  const supabase = createRouteHandlerSupabaseClient();

  const { error } = await (supabase.from("profiles") as any)
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
