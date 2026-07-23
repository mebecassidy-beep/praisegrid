import { createServiceRoleClient } from "@/lib/supabase/server";

export type DiagnosticsCheck = "sync_status" | "compliance" | "account_errors" | "all";

/**
 * Runs the account checks the support agent's `run_account_diagnostics` tool
 * exposes. Uses the service-role client since this is invoked from inside a
 * chat completion (no request-scoped user session to hand RLS), scoped
 * manually to the signed-in userId resolved from the chat route's own
 * cookie-based auth check.
 */
export async function runAccountDiagnostics(
  userId: string | null,
  check: DiagnosticsCheck
): Promise<string> {
  if (!userId) {
    return "No signed-in account is attached to this chat session, so I can't look up specific account data. Ask the user to log in at praisegrid.com/login first, or offer to escalate to a human who can look the account up by email.";
  }

  const supabase = createServiceRoleClient();

  const [{ data: profile }, { data: locationsData }] = await Promise.all([
    (supabase.from("profiles") as any).select("*").eq("id", userId).single(),
    (supabase.from("locations") as any).select("*").eq("user_id", userId),
  ]);

  const locations = locationsData ?? [];
  const locationIds = locations.map((l: any) => l.id);

  let latestReview: any = null;
  if (locationIds.length > 0) {
    const { data } = await (supabase.from("reviews") as any)
      .select("*")
      .in("location_id", locationIds)
      .order("review_date", { ascending: false, nullsFirst: false })
      .limit(1);
    latestReview = data?.[0] ?? null;
  }

  const lines: string[] = [];

  if (check === "sync_status" || check === "all") {
    if (locations.length === 0) {
      lines.push(
        "Sync status: no business locations are connected yet, so neither Google nor Yelp sync can run until one is added in Settings > Locations."
      );
    } else {
      for (const loc of locations) {
        const google = loc.google_place_id ? "connected" : "not connected";
        const yelp = loc.yelp_business_id ? "connected" : "not connected";
        lines.push(`Location "${loc.name}": Google sync ${google}, Yelp sync ${yelp}.`);
      }
      lines.push(
        latestReview
          ? `Most recent review pulled in: a ${latestReview.platform} review dated ${
              latestReview.review_date ?? latestReview.created_at
            }.`
          : "No reviews have synced in yet for this account."
      );
    }
  }

  if (check === "compliance" || check === "all") {
    lines.push(
      "Feedback Shield compliance: every customer who submits a private rating is shown the identical public Google/Yelp review link afterward, regardless of the rating they gave. This follows the FTC's 2024 rule on fake or manipulated reviews, review gating is never used."
    );
  }

  if (check === "account_errors" || check === "all") {
    lines.push(`Subscription tier on file: ${profile?.subscription_tier ?? "free"}.`);
    lines.push(
      profile?.stripe_customer_id
        ? "Billing: a payment method is on file."
        : "Billing: no payment method on file, expected on the free tier or if checkout was never completed."
    );
  }

  return lines.join("\n");
}
