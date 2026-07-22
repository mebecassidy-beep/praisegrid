import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateDisputeDraft } from "@/lib/anthropic/generate-dispute-draft";

const MAX_NOTES_LENGTH = 2000;

// Generates (and persists) a formal platform dispute draft for a review the
// owner believes is fake. Ownership is enforced the same way as
// /api/reviews/[id] — joining through locations.user_id, since reviews don't
// carry user_id directly.
export async function POST(request: Request, { params }: { params: { id: string } }) {
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
    const ownerNotes = typeof body?.notes === "string" ? body.notes.trim().slice(0, MAX_NOTES_LENGTH) : "";

    if (!ownerNotes) {
      return NextResponse.json({ error: "Add a note explaining why this review looks fake." }, { status: 400 });
    }

    const { data: review } = await (supabase.from("reviews") as any)
      .select("*, locations!inner(user_id, name)")
      .eq("id", params.id)
      .single();

    if (!review || review.locations?.user_id !== user.id) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const draft = await generateDisputeDraft({
      review,
      businessName: review.locations.name,
      ownerNotes,
    });

    const { data: updated, error } = await (supabase.from("reviews") as any)
      .update({ flagged_as_fake: true, dispute_notes: ownerNotes, dispute_draft: draft })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: updated });
  } catch (error: any) {
    console.error("Error generating dispute draft:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
