import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { createOAuthState } from "@/lib/oauth/state";
import { getEffectiveAccountId } from "@/lib/team/account";
import { buildFacebookAuthUrl, isFacebookOAuthConfigured } from "@/lib/facebook/client";

export async function GET(request: Request) {
  if (!isFacebookOAuthConfigured()) {
    return NextResponse.json({ error: "Facebook review sync is not configured yet." }, { status: 503 });
  }

  const supabase = createRouteHandlerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("location_id");
  if (!locationId) {
    return NextResponse.json({ error: "location_id is required" }, { status: 400 });
  }

  const accountId = await getEffectiveAccountId(user.id, supabase);
  const { data: location } = await (supabase.from("locations") as any)
    .select("id")
    .eq("id", locationId)
    .eq("user_id", accountId)
    .single();

  if (!location) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const redirectUri = `${new URL(request.url).origin}/api/auth/facebook/callback`;
  const state = createOAuthState(locationId, accountId);

  return NextResponse.redirect(buildFacebookAuthUrl(redirectUri, state));
}
