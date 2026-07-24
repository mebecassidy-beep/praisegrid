import type { SupabaseClient } from "@supabase/supabase-js";
import { encryptToken, decryptToken } from "@/lib/google-business-profile/token-crypto";
import { refreshAccessToken, type TokenResponse } from "@/lib/google-business-profile/client";
import type { Database } from "@/types/database";

export interface ActiveConnection {
  accessToken: string;
  accountId: string;
  gbpLocationId: string;
}

export async function saveConnection(
  supabase: SupabaseClient<Database>,
  params: {
    locationId: string;
    accountId: string;
    gbpLocationId: string;
    tokens: TokenResponse;
  }
): Promise<void> {
  const { error } = await (supabase.from("platform_connections") as any).upsert(
    {
      location_id: params.locationId,
      platform: "google",
      access_token: encryptToken(params.tokens.accessToken),
      refresh_token: params.tokens.refreshToken ? encryptToken(params.tokens.refreshToken) : null,
      expires_at: params.tokens.expiresAt,
      scope: params.tokens.scope,
      account_id: params.accountId,
      gbp_location_id: params.gbpLocationId,
      connected_at: new Date().toISOString(),
    },
    { onConflict: "location_id,platform" }
  );

  if (error) throw new Error(`Failed to save platform connection: ${error.message}`);
}

/**
 * Returns a guaranteed-fresh access token for a location's Google Business
 * Profile connection, transparently refreshing (and persisting the refreshed
 * token) if the stored one is expired or close to it. Returns null if the
 * location was never connected via OAuth (falls back to Places API sync).
 */
export async function getActiveConnection(
  supabase: SupabaseClient<Database>,
  locationId: string
): Promise<ActiveConnection | null> {
  const { data: connection } = await (supabase.from("platform_connections") as any)
    .select("access_token, refresh_token, expires_at, account_id, gbp_location_id")
    .eq("location_id", locationId)
    .eq("platform", "google")
    .maybeSingle();

  if (!connection || !connection.account_id || !connection.gbp_location_id) return null;

  const expiresAt = connection.expires_at ? new Date(connection.expires_at).getTime() : 0;
  const expiringSoon = expiresAt - Date.now() < 5 * 60 * 1000; // refresh with 5min headroom

  if (!expiringSoon) {
    return {
      accessToken: decryptToken(connection.access_token),
      accountId: connection.account_id,
      gbpLocationId: connection.gbp_location_id,
    };
  }

  if (!connection.refresh_token) {
    // Access token expired and there's no refresh token to renew it with -
    // the connection is effectively dead until the owner reconnects.
    return null;
  }

  const refreshed = await refreshAccessToken(decryptToken(connection.refresh_token));

  await (supabase.from("platform_connections") as any)
    .update({
      access_token: encryptToken(refreshed.accessToken),
      refresh_token: refreshed.refreshToken ? encryptToken(refreshed.refreshToken) : connection.refresh_token,
      expires_at: refreshed.expiresAt,
    })
    .eq("location_id", locationId)
    .eq("platform", "google");

  return {
    accessToken: refreshed.accessToken,
    accountId: connection.account_id,
    gbpLocationId: connection.gbp_location_id,
  };
}
