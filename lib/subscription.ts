import type { SubscriptionTier } from "@/types";

/** Pro-and-above gate, shared by every "Pro feature" surface (Franchise View's
 * server-side page gate, the sidebar lock icon, the upsell copy) so they can't
 * drift out of sync with each other. */
export function hasProAccess(tier: SubscriptionTier): boolean {
  return tier === "pro" || tier === "enterprise";
}
