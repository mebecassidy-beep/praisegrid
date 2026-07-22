import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

const MAX_LENGTH = 200;

export async function PATCH(request: Request) {
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
    const companyName = typeof body?.company_name === "string" ? body.company_name.trim().slice(0, MAX_LENGTH) : "";
    const phoneNumber = typeof body?.phone_number === "string" ? body.phone_number.trim().slice(0, MAX_LENGTH) : "";
    const website = typeof body?.website === "string" ? body.website.trim().slice(0, MAX_LENGTH) : "";

    const { error } = await (supabase.from("profiles") as any)
      .update({
        company_name: companyName || null,
        phone_number: phoneNumber || null,
        website: website || null,
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error updating business profile:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
