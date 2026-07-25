import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyOAuthState } from "@/lib/oauth/state";
import { exchangeCodeForLongLivedToken, listManagedPages } from "@/lib/facebook/client";
import { saveFacebookConnection } from "@/lib/facebook/connection";

function redirectWithStatus(origin: string, status: "connected" | "error", message?: string) {
  const url = new URL("/locations", origin);
  url.searchParams.set("fb_status", status);
  if (message) url.searchParams.set("fb_message", message);
  return NextResponse.redirect(url.toString());
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);

  const oauthError = searchParams.get("error");
  if (oauthError) {
    return redirectWithStatus(origin, "error", "Facebook sign-in was cancelled or denied.");
  }

  const code = searchParams.get("code");
  const rawState = searchParams.get("state");
  if (!code || !rawState) {
    return redirectWithStatus(origin, "error", "Missing authorization code.");
  }

  const state = verifyOAuthState(rawState);
  if (!state) {
    return redirectWithStatus(origin, "error", "Could not verify this request, please try connecting again.");
  }

  const supabase = createServiceRoleClient();

  const { data: location } = await (supabase.from("locations") as any)
    .select("id, name, user_id")
    .eq("id", state.locationId)
    .eq("user_id", state.userId)
    .single();

  if (!location) {
    return redirectWithStatus(origin, "error", "Location not found.");
  }

  try {
    const redirectUri = `${origin}/api/auth/facebook/callback`;
    const userToken = await exchangeCodeForLongLivedToken(code, redirectUri);

    const pages = await listManagedPages(userToken.accessToken);
    if (pages.length === 0) {
      return redirectWithStatus(origin, "error", "No Facebook Pages found for this Facebook login.");
    }

    // Best-effort name match so the right Page gets linked to this location
    // without a picker UI; falls back to the first Page, which is at least
    // correct for an account that only manages one.
    const normalizedName = location.name.trim().toLowerCase();
    const matched =
      pages.find((p) => p.name.trim().toLowerCase() === normalizedName) ??
      pages.find((p) => p.name.trim().toLowerCase().includes(normalizedName)) ??
      pages[0];

    await saveFacebookConnection(supabase, {
      locationId: location.id,
      pageId: matched.id,
      pageAccessToken: matched.accessToken,
      expiresAt: userToken.expiresAt,
    });

    return redirectWithStatus(origin, "connected");
  } catch (error: any) {
    console.error("Facebook OAuth callback failed:", error);
    return redirectWithStatus(origin, "error", "Something went wrong connecting to Facebook. Please try again.");
  }
}
