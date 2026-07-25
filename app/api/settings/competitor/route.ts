import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

const MAX_NAME_LENGTH = 120;

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const competitorName = typeof body?.competitor_name === "string" ? body.competitor_name.trim() : "";

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { error } = await (supabase.from("profiles") as any)
      .update({ competitor_name: competitorName.slice(0, MAX_NAME_LENGTH) || null })
      .eq("id", accountId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating competitor name:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
