import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getActiveConnection } from "@/lib/google-business-profile/connection";
import { replyToReview } from "@/lib/google-business-profile/client";
import { GBP_EXTERNAL_ID_PREFIX } from "@/lib/google-business-profile/sync-reviews";

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
      .select("id, location_id, status, responded_at, external_review_id, locations!inner(user_id)")
      .eq("id", params.id)
      .single();

    if (!existing || existing.locations?.user_id !== user.id) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // A review synced through the Google Business Profile OAuth connection
    // (see lib/google-business-profile/sync-reviews.ts) can actually be
    // replied to on Google itself, not just marked posted locally. If that
    // real post fails, this returns an error rather than silently marking it
    // posted, since that would tell the owner it went live when it didn't.
    const isGbpReview = existing.external_review_id?.startsWith(GBP_EXTERNAL_ID_PREFIX);
    if (status === "posted" && isGbpReview && responseText) {
      // platform_connections has no UPDATE policy for the authenticated
      // role (only server-side code ever touches tokens), and
      // getActiveConnection may need to refresh + persist a token - needs
      // the service-role client, not the request-scoped one used above.
      const connection = await getActiveConnection(createServiceRoleClient(), existing.location_id);
      if (connection) {
        try {
          const gbpReviewId = existing.external_review_id.slice(GBP_EXTERNAL_ID_PREFIX.length);
          await replyToReview(connection.accessToken, connection.accountId, connection.gbpLocationId, gbpReviewId, responseText);
        } catch (err: any) {
          console.error("Failed to post reply to Google:", err);
          return NextResponse.json(
            { error: "Couldn't post this reply to Google. Your draft is saved, you can try again." },
            { status: 502 }
          );
        }
      }
    }

    const update: Record<string, string> = {};
    if (responseText !== undefined) update.response_text = responseText;
    if (status !== undefined) update.status = status;

    // Stamp responded_at the first time a response actually goes live -
    // never overwritten on later edits, so it stays a true "time to first
    // response" mark for the Reputation Revenue Forensics metrics.
    if (status === "posted" && existing.status !== "posted" && !existing.responded_at) {
      update.responded_at = new Date().toISOString();
    }

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
