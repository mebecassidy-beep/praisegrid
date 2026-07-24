import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyOAuthState } from "@/lib/google-business-profile/oauth-state";
import { exchangeCodeForTokens, listAccounts, listLocationsForAccount } from "@/lib/google-business-profile/client";
import { saveConnection } from "@/lib/google-business-profile/connection";

function redirectWithStatus(origin: string, status: "connected" | "error", message?: string) {
  const url = new URL("/locations", origin);
  url.searchParams.set("gbp_status", status);
  if (message) url.searchParams.set("gbp_message", message);
  return NextResponse.redirect(url.toString());
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);

  const oauthError = searchParams.get("error");
  if (oauthError) {
    return redirectWithStatus(origin, "error", "Google sign-in was cancelled or denied.");
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
    const redirectUri = `${origin}/api/auth/google-business/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    const accounts = await listAccounts(tokens.accessToken);
    if (accounts.length === 0) {
      return redirectWithStatus(origin, "error", "No Google Business Profile account found for this Google login.");
    }

    // Most Praisegrid customers manage a single account - if there's more
    // than one, this takes the first rather than prompting a picker. A
    // multi-account picker is a reasonable future improvement, not required
    // for the common case this product is built for.
    const account = accounts[0];
    const accountId = account.name.replace(/^accounts\//, "");

    const locations = await listLocationsForAccount(tokens.accessToken, account.name);
    if (locations.length === 0) {
      return redirectWithStatus(origin, "error", "No locations found on that Google Business Profile account.");
    }

    // Best-effort name match so a multi-location GBP account still lands on
    // the right one; falls back to the first location if nothing matches
    // closely, which is at least correct for single-location accounts.
    const normalizedName = location.name.trim().toLowerCase();
    const matched =
      locations.find((l) => l.title.trim().toLowerCase() === normalizedName) ??
      locations.find((l) => l.title.trim().toLowerCase().includes(normalizedName)) ??
      locations[0];

    const gbpLocationId = matched.name.split("/").pop()!;

    await saveConnection(supabase, {
      locationId: location.id,
      accountId,
      gbpLocationId,
      tokens,
    });

    return redirectWithStatus(origin, "connected");
  } catch (error: any) {
    console.error("Google Business Profile OAuth callback failed:", error);
    return redirectWithStatus(origin, "error", "Something went wrong connecting to Google. Please try again.");
  }
}
