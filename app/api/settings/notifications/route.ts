import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

const VALID_FREQUENCIES = ["weekly", "monthly", "off"];

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const reportFrequency = body?.report_frequency;

    if (!VALID_FREQUENCIES.includes(reportFrequency)) {
      return NextResponse.json({ error: "Invalid report_frequency." }, { status: 400 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { error } = await (supabase.from("profiles") as any)
      .update({ report_frequency: reportFrequency })
      .eq("id", accountId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
