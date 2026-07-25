import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

/**
 * Which of the user's locations have an active OAuth connection for the
 * given platform - just location_id, never the tokens themselves, so this is
 * safe to call with the normal request-scoped (RLS-enforced) client.
 */
export async function getConnectedLocationIds(
  locationIds: string[],
  platform: "google" | "facebook",
  supabase: SupabaseClient<Database> = createClient()
): Promise<Set<string>> {
  if (locationIds.length === 0) return new Set();

  const { data } = await (supabase.from("platform_connections") as any)
    .select("location_id")
    .eq("platform", platform)
    .in("location_id", locationIds);

  return new Set((data ?? []).map((row: any) => row.location_id));
}
