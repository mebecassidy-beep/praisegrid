import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: locations } = await supabase
    .from("locations")
    .select("id")
    .eq("user_id", user.id);

  const locationIds = (locations ?? []).map((location) => location.id);

  if (locationIds.length === 0) {
    return NextResponse.json({ reviews: [] });
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .in("location_id", locationIds)
    .order("review_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { location_id, platform, reviewer_name, rating, review_text, review_date } = body;

  const { data: location } = await supabase
    .from("locations")
    .select("id")
    .eq("id", location_id)
    .eq("user_id", user.id)
    .single();

  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({ location_id, platform, reviewer_name, rating, review_text, review_date })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review }, { status: 201 });
}
