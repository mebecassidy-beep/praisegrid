import { createServiceRoleClient } from "@/lib/supabase/server";

export interface PublicLocation {
  id: string;
  name: string;
  google_place_id: string | null;
  yelp_business_id: string | null;
}

/**
 * Reads a location's public-safe fields (name + platform IDs, nothing owner-
 * scoped) for the unauthenticated /feedback/[locationId] capture page. Uses
 * the service-role client deliberately — a customer tapping a link from an
 * SMS/email has no Supabase session, and locations has no anon-select RLS
 * policy by design (see schema.sql), so the normal request-scoped client
 * would always return null here.
 */
export async function getPublicLocation(locationId: string): Promise<PublicLocation | null> {
  const supabase = createServiceRoleClient();
  const { data } = await (supabase.from("locations") as any)
    .select("id, name, google_place_id, yelp_business_id")
    .eq("id", locationId)
    .single();

  return data ?? null;
}
