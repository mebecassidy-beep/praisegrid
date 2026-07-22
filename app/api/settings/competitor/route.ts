import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

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

    const { error } = await (supabase.from("profiles") as any)
      .update({ competitor_name: competitorName.slice(0, MAX_NAME_LENGTH) || null })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating competitor name:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
