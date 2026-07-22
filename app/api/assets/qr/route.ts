export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { generateQrPngBuffer } from "@/lib/qr/generate-qr";
import { buildFeedbackShieldLink, buildGoogleReviewLink, buildYelpReviewLink } from "@/lib/reviews/public-review-links";

const VALID_TARGETS = ["google", "yelp", "feedback"];

// Serves the QR PNG both for the live <img> preview and for download (add
// ?download=1 to get a Content-Disposition: attachment response) — same URL,
// so the hub never has to keep the generated image in sync across two code
// paths.
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

    const url = new URL(request.url);
    const locationId = url.searchParams.get("location_id") ?? "";
    const target = url.searchParams.get("target") ?? "";
    const download = url.searchParams.get("download") === "1";

    if (!locationId || !VALID_TARGETS.includes(target)) {
      return NextResponse.json({ error: "A valid location_id and target are required." }, { status: 400 });
    }

    const { data: location } = await (supabase.from("locations") as any)
      .select("id, name, google_place_id, yelp_business_id")
      .eq("id", locationId)
      .eq("user_id", user.id)
      .single();

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    let targetUrl: string | null = null;
    if (target === "google" && location.google_place_id) targetUrl = buildGoogleReviewLink(location.google_place_id);
    if (target === "yelp" && location.yelp_business_id) targetUrl = buildYelpReviewLink(location.yelp_business_id);
    if (target === "feedback") targetUrl = buildFeedbackShieldLink(location.id);

    if (!targetUrl) {
      return NextResponse.json({ error: "That destination isn't connected for this location yet." }, { status: 400 });
    }

    const png = await generateQrPngBuffer(targetUrl);

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=3600",
        ...(download
          ? { "Content-Disposition": `attachment; filename="${location.name.replace(/[^a-z0-9]+/gi, "-")}-${target}-qr.png"` }
          : {}),
      },
    });
  } catch (error: any) {
    console.error("Error generating QR code:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
