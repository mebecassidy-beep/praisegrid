export const dynamic = "force-dynamic";
import { ImageResponse } from "next/og";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { getEffectiveAccountId } from "@/lib/team/account";

export async function GET(request: Request, { params }: { params: { reviewId: string } }) {
  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: review } = await (supabase.from("reviews") as any)
    .select("rating, reviewer_name, review_text, platform, locations!inner(user_id, name)")
    .eq("id", params.reviewId)
    .single();

  const accountId = await getEffectiveAccountId(user.id, supabase);
  if (!review || review.locations?.user_id !== accountId) {
    return new Response("Not found", { status: 404 });
  }

  const quote = (review.review_text ?? "").slice(0, 220);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px",
          background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
            borderRadius: "40px",
            padding: "80px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", marginBottom: "32px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ fontSize: "56px", color: "#f59e0b" }}>
                ★
              </span>
            ))}
          </div>
          <div
            style={{
              fontSize: "44px",
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            &ldquo;{quote}&rdquo;
          </div>
          <div style={{ marginTop: "48px", fontSize: "30px", color: "#64748b", display: "flex" }}>
            {review.reviewer_name || "A happy customer"}, via {review.platform}
          </div>
          <div style={{ marginTop: "64px", fontSize: "28px", fontWeight: 700, color: "#3b82f6", display: "flex" }}>
            {review.locations.name}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
