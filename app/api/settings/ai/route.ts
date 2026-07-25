export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

const VALID_PRESETS = ["friendly_neighborhood", "professional_corporate", "custom"];

async function requireOwnedLocation(supabase: ReturnType<typeof createRouteHandlerSupabaseClient>, userId: string, locationId: string) {
  const { data } = await (supabase.from("locations") as any)
    .select("id")
    .eq("id", locationId)
    .eq("user_id", userId)
    .single();
  return Boolean(data);
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const locationId = new URL(request.url).searchParams.get("location_id");
    if (!locationId || !(await requireOwnedLocation(supabase, accountId, locationId))) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const { data: settings } = await (supabase.from("ai_settings") as any)
      .select("*")
      .eq("location_id", locationId)
      .maybeSingle();

    return NextResponse.json({
      settings: settings ?? {
        location_id: locationId,
        auto_approve_5star: false,
        auto_approve_min_rating: 5,
        tone_instructions: "",
        tone_preset: "custom",
        sign_off_name: "",
      },
    });
  } catch (error: any) {
    console.error("Error fetching AI settings:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Upserts ai_settings for one of the caller's own locations. ai_settings.location_id
// is unique, so onConflict lets this double as create-or-update from a single call —
// the panel doesn't need to know whether a row already exists.
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

    const accountId = await getEffectiveAccountId(user.id, supabase);
    const body = await request.json().catch(() => ({}));
    const locationId = typeof body?.location_id === "string" ? body.location_id : "";

    if (!locationId || !(await requireOwnedLocation(supabase, accountId, locationId))) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const tonePreset = typeof body?.tone_preset === "string" && VALID_PRESETS.includes(body.tone_preset)
      ? body.tone_preset
      : "custom";
    const autoApproveMinRating = Number(body?.auto_approve_min_rating);

    const { data: settings, error } = await (supabase.from("ai_settings") as any)
      .upsert(
        {
          location_id: locationId,
          auto_approve_5star: Boolean(body?.auto_approve_5star),
          auto_approve_min_rating:
            Number.isInteger(autoApproveMinRating) && autoApproveMinRating >= 1 && autoApproveMinRating <= 5
              ? autoApproveMinRating
              : 5,
          tone_instructions: typeof body?.tone_instructions === "string" ? body.tone_instructions.slice(0, 2000) : "",
          tone_preset: tonePreset,
          sign_off_name: typeof body?.sign_off_name === "string" ? body.sign_off_name.slice(0, 120) : "",
        },
        { onConflict: "location_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Error saving AI settings:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
