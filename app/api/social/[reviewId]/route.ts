import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateSocialCaption } from "@/lib/anthropic/generate-social-caption";
import { getEffectiveAccountId } from "@/lib/team/account";

// Only "verified" 5-star reviews are eligible: rating 5 and status
// "posted", meaning the owner already reviewed and approved a response to
// this real, platform-synced review — not any arbitrary incoming review.
export async function POST(request: Request, { params }: { params: { reviewId: string } }) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: review } = await (supabase.from("reviews") as any)
      .select("*, locations!inner(user_id, name)")
      .eq("id", params.reviewId)
      .single();

    const accountId = await getEffectiveAccountId(user.id, supabase);
    if (!review || review.locations?.user_id !== accountId) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.rating !== 5 || review.status !== "posted") {
      return NextResponse.json(
        { error: "Only 5-star reviews with an approved, posted response are eligible." },
        { status: 400 }
      );
    }

    const { data: aiSettings } = await (supabase.from("ai_settings") as any)
      .select("tone_instructions")
      .eq("location_id", review.location_id)
      .maybeSingle();

    const caption = await generateSocialCaption({
      review,
      aiSettings,
      businessName: review.locations.name,
    });

    await (supabase.from("reviews") as any)
      .update({ social_generated_at: new Date().toISOString() })
      .eq("id", params.reviewId);

    return NextResponse.json({ caption });
  } catch (error: any) {
    console.error("Error generating social caption:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
