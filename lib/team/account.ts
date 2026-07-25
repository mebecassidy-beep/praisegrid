import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, requireUser } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

/**
 * Mirrors the public.effective_account_id() Postgres function used
 * throughout schema.sql's RLS policies: an active team member's data
 * queries resolve to the account owner they were invited into, everyone
 * else resolves to their own id. Every page/route that queries account-
 * scoped data (locations, reviews, settings, ...) needs to filter by this,
 * not the raw authenticated user id - RLS allows a teammate to see the
 * owner's rows, but an explicit `.eq("user_id", user.id)` in application
 * code is more restrictive than RLS and would still return nothing for
 * them if this isn't threaded through.
 */
export async function getEffectiveAccountId(
  userId: string,
  supabase: SupabaseClient<Database> = createClient()
): Promise<string> {
  const { data } = await (supabase.from("team_members") as any)
    .select("account_owner_id")
    .eq("member_user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return data?.account_owner_id ?? userId;
}

/**
 * Server Component convenience wrapper: guards the page (redirects to
 * /login) and resolves both the real logged-in user and the account whose
 * data should actually be queried, in one call.
 */
export async function requireAccount(): Promise<{ user: Awaited<ReturnType<typeof requireUser>>; accountId: string }> {
  const user = await requireUser();
  const accountId = await getEffectiveAccountId(user.id);
  return { user, accountId };
}
