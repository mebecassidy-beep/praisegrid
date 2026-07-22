import {
  Clock,
  MessageSquareText,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatTile {
  label: string;
  value: string;
  icon: LucideIcon;
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
    { label: "Total reviews", value: totalReviews.toLocaleString(), icon: MessageSquareText },
    { label: "Average rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star },
    { label: "AI response rate", value: `${responseRate}%`, icon: Sparkles },
    { label: "Pending approvals", value: String(pendingCount), icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-start justify-between gap-3 p-5">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight">
                {stat.label === "Average rating" ? (
                  <span className="inline-flex items-center gap-1">
                    {stat.value}
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10">
              <stat.icon className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
