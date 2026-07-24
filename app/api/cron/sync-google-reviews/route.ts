import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isGooglePlacesConfigured } from "@/lib/google-places/client";
import { syncGoogleReviewsForLocation } from "@/lib/google-places/sync-reviews";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isGooglePlacesConfigured()) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY not configured" }, { status: 200 });
  }

  const supabase = createServiceRoleClient();

  const { data: locations } = await (supabase.from("locations") as any)
    .select("id, name, google_place_id, user_id")
    .not("google_place_id", "is", null);

  const results = [];
  for (const location of locations ?? []) {
    const result = await syncGoogleReviewsForLocation(location, supabase);
    results.push(result);
  }

  const totalNewReviews = results.reduce((sum, r) => sum + r.newReviews, 0);
  const failed = results.filter((r) => r.error);

  return NextResponse.json({
    locationsProcessed: results.length,
    totalNewReviews,
    failed: failed.length,
    results,
  });
}
