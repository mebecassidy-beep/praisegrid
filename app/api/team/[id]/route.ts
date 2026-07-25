import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

// RLS (team_members' delete policy) already scopes this to the caller's own
// account via effective_account_id(), so there's no need to re-check
// ownership here - a mismatched id just deletes zero rows.
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await (supabase.from("team_members") as any).delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
