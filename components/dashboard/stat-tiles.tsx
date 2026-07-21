import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  MessageSquareText,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTile {
  label: string;
  value: string;
  icon: LucideIcon;
  deltaLabel: string;
  deltaDirection: "up" | "down";
  isGood: boolean;
  period: string;
}

const STATS: StatTile[] = [
  {
    label: "Total reviews",
    value: "1,284",
    icon: MessageSquareText,
    deltaLabel: "8.2%",
    deltaDirection: "up",
    isGood: true,
    period: "vs last 30 days",
  },
  {
    label: "Average rating",
    value: "4.8",
    icon: Star,
    deltaLabel: "0.1",
    deltaDirection: "up",
    isGood: true,
    period: "vs last 30 days",
  },
  {
    label: "AI response rate",
    value: "94%",
    icon: Sparkles,
    deltaLabel: "3.5%",
    deltaDirection: "up",
    isGood: true,
    period: "vs last 30 days",
  },
  {
    label: "Pending approvals",
    value: "3",
    icon: Clock,
    deltaLabel: "2",
    deltaDirection: "down",
    isGood: true,
    period: "vs yesterday",
  },
];

export function StatTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => {
        const DeltaIcon = stat.deltaDirection === "up" ? ArrowUpRight : ArrowDownRight;
        return (
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
                <p
                  className={cn(
                    "mt-2 inline-flex items-center gap-0.5 text-xs font-medium",
                    stat.isGood ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  <DeltaIcon className="h-3.5 w-3.5" />
                  {stat.deltaLabel}
                  <span className="ml-1 font-normal text-muted-foreground">{stat.period}</span>
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
