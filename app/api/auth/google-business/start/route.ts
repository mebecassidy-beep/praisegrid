import { NextResponse } from "next/server";
import { createRouteHandlerSupabaseClient } from "@/lib/supabase/server";
import { createOAuthState } from "@/lib/oauth/state";
import { getEffectiveAccountId } from "@/lib/team/account";
import { GBP_OAUTH_SCOPE, isGbpOAuthConfigured } from "@/lib/google-business-profile/client";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: Request) {
  if (!isGbpOAuthConfigured()) {
    return NextResponse.json({ error: "Google Business Profile OAuth is not configured yet." }, { status: 503 });
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

  const redirectUri = `${new URL(request.url).origin}/api/auth/google-business/callback`;
  const state = createOAuthState(locationId, accountId);

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", process.env.GOOGLE_OAUTH_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GBP_OAUTH_SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
