import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateReviewResponse } from "@/lib/anthropic/generate-response";

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reviewId } = await request.json();

  const { data: review } = await supabase
    .from("reviews")
    .select("*, locations!inner(id, name, user_id)")
    .eq("id", reviewId)
    .eq("locations.user_id", user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { data: aiSettings } = await supabase
    .from("ai_settings")
    .select("tone_instructions, sign_off_name")
    .eq("location_id", review.location_id)
    .maybeSingle();

  const responseText = await generateReviewResponse({
    review,
    aiSettings,
    businessName: review.locations.name,
  });

  const { error } = await supabase
    .from("reviews")
    .update({ response_text: responseText })
    .eq("id", reviewId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ response_text: responseText });
}
