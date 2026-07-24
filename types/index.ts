import type { Database } from "@/types/database";

export type {
  Platform,
  ReviewStatus,
  SubscriptionTier,
  ReportFrequency,
  RiskLevel,
  TonePreset,
  BlastMethod,
} from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type AiSettings = Database["public"]["Tables"]["ai_settings"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type FeedbackResponse = Database["public"]["Tables"]["feedback_responses"]["Row"];
export type ScheduledBlast = Database["public"]["Tables"]["scheduled_blasts"]["Row"];
export type PlatformConnection = Database["public"]["Tables"]["platform_connections"]["Row"];

export type LocationWithReviews = Location & { reviews: Review[] };
export type ReviewWithLocation = Review & { location: Location };
