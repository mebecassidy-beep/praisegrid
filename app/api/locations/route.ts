import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const address = typeof body?.address === "string" ? body.address.trim() : null;
    const googlePlaceId = typeof body?.google_place_id === "string" ? body.google_place_id.trim() : null;

    if (!name) {
      return NextResponse.json({ error: "A business name is required." }, { status: 400 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const { data: location, error } = await (supabase.from("locations") as any)
      .insert({
        user_id: accountId,
        name,
        address,
        google_place_id: googlePlaceId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ location });
  } catch (error: any) {
    console.error("Error creating location:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
