import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function createRouteHandlerSupabaseClient() {
  return createRouteHandlerClient<Database>({ cookies });
}

export function createServiceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
