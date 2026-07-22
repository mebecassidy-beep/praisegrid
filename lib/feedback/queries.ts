import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { FeedbackResponse } from "@/types";

/**
 * Fetches the signed-in user's private Feedback Shield submissions across all
 * their locations, most recent first. Scoped by RLS (join through
 * locations.user_id = auth.uid()) via the request-scoped Supabase client.
 */
export async function getFeedbackResponses(
  userId: string,
  supabase: SupabaseClient<Database> = createClient(),
  limit = 10
): Promise<FeedbackResponse[]> {
  const { data: locations } = await (supabase.from("locations") as any).select("id").eq("user_id", userId);
  const locationIds = (locations ?? []).map((l: any) => l.id);
  if (locationIds.length === 0) return [];

  const { data } = await (supabase.from("feedback_responses") as any)
    .select("*")
    .in("location_id", locationIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
