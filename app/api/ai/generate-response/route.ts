import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateReviewResponse, type ToneOverride } from "@/lib/anthropic/generate-response";

const VALID_TONES: ToneOverride[] = ["empathetic", "professional", "brand-hero"];

export async function POST(request: Request) {
  try {
    const { review_id, location_id, tone_override, perk_offer } = await request.json();
    const toneOverride = VALID_TONES.includes(tone_override) ? (tone_override as ToneOverride) : undefined;
    const perkOffer = typeof perk_offer === "string" && perk_offer.trim() ? perk_offer.trim().slice(0, 200) : undefined;

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
      toneOverride,
      perkOffer,
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
