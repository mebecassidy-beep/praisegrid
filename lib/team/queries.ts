import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export interface TeamMember {
  id: string;
  invited_email: string;
  status: "invited" | "active";
  invited_at: string;
  joined_at: string | null;
}

export async function getTeamMembers(
  accountId: string,
  supabase: SupabaseClient<Database> = createClient()
): Promise<TeamMember[]> {
  const { data } = await (supabase.from("team_members") as any)
    .select("id, invited_email, status, invited_at, joined_at")
    .eq("account_owner_id", accountId)
    .order("invited_at", { ascending: true });

  return data ?? [];
}
