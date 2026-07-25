import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

const MIN_VALUE = 0;
const MAX_VALUE = 1_000_000;

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawValue = Number(body?.estimated_customer_value);

    if (!Number.isFinite(rawValue) || rawValue < MIN_VALUE || rawValue > MAX_VALUE) {
      return NextResponse.json({ error: "Enter a valid dollar amount." }, { status: 400 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { error } = await (supabase.from("profiles") as any)
      .update({ estimated_customer_value: Math.round(rawValue * 100) / 100 })
      .eq("id", accountId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating estimated customer value:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
