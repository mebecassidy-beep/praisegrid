import type { Database } from "@/types/database";

export type { Platform, ReviewStatus, SubscriptionTier } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type AiSettings = Database["public"]["Tables"]["ai_settings"]["Row"];

export type LocationWithReviews = Location & { reviews: Review[] };
export type ReviewWithLocation = Review & { location: Location };
