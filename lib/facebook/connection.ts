import type { SupabaseClient } from "@supabase/supabase-js";
import { encryptToken, decryptToken } from "@/lib/oauth/token-crypto";
import type { Database } from "@/types/database";

export interface ActiveFacebookConnection {
  pageAccessToken: string;
  pageId: string;
}

export async function saveFacebookConnection(
  supabase: SupabaseClient<Database>,
  params: { locationId: string; pageId: string; pageAccessToken: string; expiresAt: string | null }
): Promise<void> {
  const { error } = await (supabase.from("platform_connections") as any).upsert(
    {
      location_id: params.locationId,
      platform: "facebook",
      access_token: encryptToken(params.pageAccessToken),
      refresh_token: null,
      expires_at: params.expiresAt,
      account_id: params.pageId,
      connected_at: new Date().toISOString(),
    },
    { onConflict: "location_id,platform" }
  );

  if (error) throw new Error(`Failed to save Facebook connection: ${error.message}`);
}

/**
 * Facebook Page tokens have no refresh grant like Google's, so there's
 * nothing to proactively renew here - if a token has actually been revoked,
 * the sync call itself fails and that surfaces as a sync error rather than
 * something this can detect in advance.
 */
export async function getActiveFacebookConnection(
  supabase: SupabaseClient<Database>,
  locationId: string
): Promise<ActiveFacebookConnection | null> {
  const { data: connection } = await (supabase.from("platform_connections") as any)
    .select("access_token, account_id")
    .eq("location_id", locationId)
    .eq("platform", "facebook")
    .maybeSingle();

  if (!connection || !connection.account_id) return null;

  return {
    pageAccessToken: decryptToken(connection.access_token),
    pageId: connection.account_id,
  };
}
