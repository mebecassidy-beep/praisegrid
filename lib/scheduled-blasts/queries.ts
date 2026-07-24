import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ScheduledBlast } from "@/types";

/**
 * Fetches the signed-in user's not-yet-sent scheduled review requests
 * (queued via the "smart timing" delay option on the Review Blast card),
 * soonest first. Picked up and cleared by /api/cron/send-scheduled-blasts.
 */
export async function getPendingScheduledBlasts(
  userId: string,
  supabase: SupabaseClient<Database> = createClient()
): Promise<ScheduledBlast[]> {
  const { data } = await (supabase.from("scheduled_blasts") as any)
    .select("*")
    .eq("user_id", userId)
    .is("sent_at", null)
    .order("send_at", { ascending: true });

  return data ?? [];
}
