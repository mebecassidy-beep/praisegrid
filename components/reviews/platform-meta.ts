import { Facebook, MapPin, Star, type LucideIcon } from "lucide-react";
import type { Platform } from "@/types/database";
import type { DisplayStatus } from "@/lib/reviews/display-status";

export const PLATFORM_META: Record<Platform, { label: string; icon: LucideIcon; badgeClass: string }> = {
  google: { label: "Google", icon: MapPin, badgeClass: "bg-blue-500/10 text-blue-600" },
  yelp: { label: "Yelp", icon: Star, badgeClass: "bg-red-500/10 text-red-600" },
  facebook: { label: "Facebook", icon: Facebook, badgeClass: "bg-indigo-500/10 text-indigo-600" },
};

export const STATUS_META: Record<DisplayStatus, { label: string; badgeClass: string }> = {
  pending: { label: "Pending", badgeClass: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Approved", badgeClass: "bg-emerald-500/10 text-emerald-600" },
  posted: { label: "Posted", badgeClass: "bg-emerald-500/10 text-emerald-600" },
  flagged: { label: "Flagged", badgeClass: "bg-red-500/10 text-red-600" },
};
