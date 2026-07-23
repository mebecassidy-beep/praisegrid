"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import {
  Clock,
  MessageSquareText,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

interface StatTile {
  label: string;
  value: number;
  format: (n: number) => string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
  iconColor: string;
}

function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Only animate the first time a real value lands (avoids re-triggering
    // the count-up on every unrelated re-render once data is loaded).
    if (hasAnimated.current) {
      setDisplay(value);
      return;
    }
    hasAnimated.current = true;
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);

  return <>{format(display)}</>;
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
      value: totalReviews,
      format: (n) => Math.round(n).toLocaleString(),
      icon: MessageSquareText,
      accent: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      label: "Average rating",
      value: avgRating,
      format: (n) => (avgRating > 0 ? n.toFixed(1) : "—"),
      icon: Star,
      accent: "from-amber-500 to-orange-400",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      label: "AI response rate",
      value: responseRate,
      format: (n) => `${Math.round(n)}%`,
      icon: Sparkles,
      accent: "from-violet-500 to-fuchsia-400",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
    {
      label: "Pending approvals",
      value: pendingCount,
      format: (n) => String(Math.round(n)),
      icon: Clock,
      accent: pendingCount > 0 ? "from-red-500 to-orange-400" : "from-emerald-500 to-teal-400",
      iconBg: pendingCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      iconColor: pendingCount > 0 ? "text-red-600" : "text-emerald-600",
    },
  ];

  return (
    <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
      {STATS.map((stat) => (
        <RevealItem key={stat.label}>
          <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", stat.accent)} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums">
                  {stat.label === "Average rating" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CountUp value={stat.value} format={stat.format} />
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </span>
                  ) : (
                    <CountUp value={stat.value} format={stat.format} />
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
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
