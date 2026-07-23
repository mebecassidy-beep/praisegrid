"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Clock, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddLocationModal } from "@/components/dashboard/add-location-modal";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Platform } from "@/types/database";
import { cn } from "@/lib/utils";

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const PADDING_X = 16;

function pointsFor(values: number[], min: number, max: number) {
  const span = max - min || 1;
  const step = (CHART_WIDTH - PADDING_X * 2) / (values.length - 1);
  return values.map((v, i) => ({
    x: PADDING_X + i * step,
    y: CHART_HEIGHT - 24 - ((v - min) / span) * (CHART_HEIGHT - 48),
  }));
}

function LineChart({
  values,
  labels,
  formatValue,
  stroke = "#2a78d6",
}: {
  values: number[];
  labels: string[];
  formatValue: (v: number) => string;
  stroke?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = pointsFor(values, min * 0.92, max * 1.08);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full overflow-visible">
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="10"
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              className="cursor-pointer"
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 4.5 : 3}
              fill="white"
              stroke={stroke}
              strokeWidth="2"
              className="pointer-events-none transition-[r] duration-150"
            />
          </g>
        ))}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={CHART_HEIGHT - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {labels[i]}
          </text>
        ))}
      </svg>

      {hovered !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${(points[hovered].x / CHART_WIDTH) * 100}%`,
            top: `${(points[hovered].y / CHART_HEIGHT) * 100 - 4}%`,
          }}
        >
          <p className="font-medium text-foreground">{formatValue(values[hovered])}</p>
          <p className="text-muted-foreground">{labels[hovered]}</p>
        </div>
      )}
    </div>
  );
}

function ChartEmptyState({
  icon: Icon,
  title,
  description,
  cta,
}: {
  icon: typeof TrendingUp;
  title: string;
  description: string;
  cta?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/20 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
            <Icon className="h-5 w-5 text-blue-600" />
          </span>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">{description}</p>
          {cta}
        </div>
      </CardContent>
    </Card>
  );
}

export function RatingTrendChart({
  monthlyRatingTrend,
  hasLocation,
  googlePlacesEnabled,
}: {
  monthlyRatingTrend: { month: string; avgRating: number; reviewCount: number }[];
  hasLocation: boolean;
  googlePlacesEnabled: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (monthlyRatingTrend.length < 2) {
    return (
      <>
        <ChartEmptyState
          icon={TrendingUp}
          title="Average rating trend"
          description={
            hasLocation
              ? "Not enough review history yet, this chart fills in as reviews come in over time."
              : "Connect a location to start tracking your rating trend month over month."
          }
          cta={
            !hasLocation && (
              <Button size="sm" onClick={() => setModalOpen(true)} className="mt-1 gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Connect Google Business Profile
              </Button>
            )
          }
        />
        <AddLocationModal open={modalOpen} onClose={() => setModalOpen(false)} googlePlacesEnabled={googlePlacesEnabled} />
      </>
    );
  }

  const values = monthlyRatingTrend.map((m) => m.avgRating);
  const labels = monthlyRatingTrend.map((m) => m.month);
  const latest = values[values.length - 1];
  const first = values[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average rating trend</CardTitle>
        <CardDescription>
          {latest.toFixed(1)}★ average, {latest >= first ? "up from" : "down from"} {first.toFixed(1)}★ in{" "}
          {labels[0]}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart values={values} labels={labels} formatValue={(v) => `${v.toFixed(1)}★ average`} />
      </CardContent>
    </Card>
  );
}

export function ResponseTimeChart() {
  // Real response-time tracking needs a `responded_at` timestamp on reviews
  // (when a draft was actually approved), which the schema doesn't capture
  // yet — showing fabricated numbers here would be worse than an honest
  // "coming soon" state.
  return (
    <ChartEmptyState
      icon={Clock}
      title="Avg. first response time"
      description="Response-time tracking is coming soon, we'll start timing this from your first approved response."
    />
  );
}

const PLATFORMS: Platform[] = ["google", "yelp", "facebook"];
const PLATFORM_COLOR: Record<Platform, string> = {
  google: "#3b82f6",
  yelp: "#ef4444",
  facebook: "#6366f1",
};

export function PlatformVolumeChart({
  monthlyPlatformVolume,
  hasLocation,
  googlePlacesEnabled,
}: {
  monthlyPlatformVolume: { month: string; google: number; yelp: number; facebook: number }[];
  hasLocation: boolean;
  googlePlacesEnabled: boolean;
}) {
  const [hovered, setHovered] = useState<{ month: string; platform: Platform } | null>(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  if (monthlyPlatformVolume.length === 0) {
    return (
      <>
        <ChartEmptyState
          icon={BarChart3}
          title="Review volume by platform"
          description={
            hasLocation
              ? "Volume by platform will show up here once reviews start coming in."
              : "Connect a location to see which platforms your reviews are coming from."
          }
          cta={
            !hasLocation && (
              <Button size="sm" onClick={() => setModalOpen(true)} className="mt-1 gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Connect Google Business Profile
              </Button>
            )
          }
        />
        <AddLocationModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            router.refresh();
          }}
          googlePlacesEnabled={googlePlacesEnabled}
        />
      </>
    );
  }

  const maxTotal = Math.max(
    ...monthlyPlatformVolume.map((m) => PLATFORMS.reduce((sum, p) => sum + m[p], 0)),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review volume by platform</CardTitle>
        <CardDescription>Monthly reviews received across your connected sources.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-wrap gap-4">
          {PLATFORMS.map((platform) => (
            <div key={platform} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: PLATFORM_COLOR[platform] }}
              />
              {PLATFORM_META[platform].label}
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3 sm:gap-5">
          {monthlyPlatformVolume.map((m) => {
            const total = PLATFORMS.reduce((sum, p) => sum + m[p], 0);
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full max-w-10 flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px]">
                  {PLATFORMS.map((platform) => {
                    const count = m[platform];
                    const isHovered = hovered?.month === m.month && hovered.platform === platform;
                    return (
                      <div
                        key={platform}
                        onMouseEnter={() => setHovered({ month: m.month, platform })}
                        onMouseLeave={() => setHovered((h) => (h && h.month === m.month && h.platform === platform ? null : h))}
                        className={cn("w-full cursor-pointer transition-opacity", isHovered && "opacity-80")}
                        style={{
                          height: `${(count / maxTotal) * 100}%`,
                          backgroundColor: PLATFORM_COLOR[platform],
                        }}
                        title={`${PLATFORM_META[platform].label}: ${count} reviews in ${m.month}`}
                      />
                    );
                  })}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{m.month}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground/70">{total}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
