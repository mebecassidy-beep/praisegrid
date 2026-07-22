import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["pending", "approved", "posted"];

// Updates a review's response text/status. Ownership is enforced by joining
// through locations.user_id rather than trusting a client-supplied id, since
// reviews don't carry user_id directly (they're scoped via their location).
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    const responseText = typeof body?.response_text === "string" ? body.response_text.trim() : undefined;
    const status = typeof body?.status === "string" ? body.status : undefined;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const { data: existing } = await (supabase.from("reviews") as any)
      .select("id, location_id, locations!inner(user_id)")
      .eq("id", params.id)
      .single();

    if (!existing || existing.locations?.user_id !== user.id) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const update: Record<string, string> = {};
    if (responseText !== undefined) update.response_text = responseText;
    if (status !== undefined) update.status = status;

    const { data: review, error } = await (supabase.from("reviews") as any)
      .update(update)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
