import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateReviewResponse } from "@/lib/anthropic/generate-response";

export async function POST(request: Request) {
  try {
    const { review_id, location_id } = await request.json();

    if (!review_id || !location_id) {
      return NextResponse.json(
        { error: "review_id and location_id are required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerSupabaseClient();

    const { data: review, error: reviewError } = await (supabase
      .from("reviews") as any)
      .select("*")
      .eq("id", review_id)
      .eq("location_id", location_id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const { data: location } = await (supabase
      .from("locations") as any)
      .select("name")
      .eq("id", location_id)
      .single();

    const { data: aiSettings } = await (supabase
      .from("ai_settings") as any)
      .select("tone_instructions, sign_off_name")
      .eq("location_id", location_id)
      .maybeSingle();

    const responseText = await generateReviewResponse({
      review,
      aiSettings,
      businessName: location?.name ?? "our business",
    });

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
