import {
  Clock,
  MessageSquareText,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatTile {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
  iconColor: string;
}

export function StatTiles({
  totalReviews,
  avgRating,
  responseRate,
  pendingCount,
}: {
  totalReviews: number;
  avgRating: number;
  responseRate: number;
  pendingCount: number;
}) {
  const STATS: StatTile[] = [
    {
      label: "Total reviews",
      value: totalReviews.toLocaleString(),
      icon: MessageSquareText,
      accent: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      label: "Average rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      icon: Star,
      accent: "from-amber-500 to-orange-400",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      label: "AI response rate",
      value: `${responseRate}%`,
      icon: Sparkles,
      accent: "from-violet-500 to-fuchsia-400",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
    {
      label: "Pending approvals",
      value: String(pendingCount),
      icon: Clock,
      accent: pendingCount > 0 ? "from-red-500 to-orange-400" : "from-emerald-500 to-teal-400",
      iconBg: pendingCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      iconColor: pendingCount > 0 ? "text-red-600" : "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", stat.accent)} />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-1.5 text-3xl font-bold tracking-tight">
                {stat.label === "Average rating" ? (
                  <span className="inline-flex items-center gap-1.5">
                    {stat.value}
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                stat.iconBg
              )}
            >
              <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
