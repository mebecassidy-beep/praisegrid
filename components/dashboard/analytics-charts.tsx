"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import { MONTHLY_TREND, type FeedPlatform } from "@/lib/dashboard/mock-data";
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

export function RatingTrendChart({
  monthlyRatingTrend,
}: {
  monthlyRatingTrend: { month: string; avgRating: number; reviewCount: number }[];
}) {
  if (monthlyRatingTrend.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average rating trend</CardTitle>
          <CardDescription>Not enough review history yet to chart a trend.</CardDescription>
        </CardHeader>
      </Card>
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
  const values = MONTHLY_TREND.map((m) => m.avgResponseHours);
  const labels = MONTHLY_TREND.map((m) => m.month);
  const latest = values[values.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avg. first response time</CardTitle>
        <CardDescription>
          Down to {latest.toFixed(1)} hours as AI auto-drafting picks up more replies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          values={values}
          labels={labels}
          formatValue={(v) => `${v.toFixed(1)}h avg. response`}
          stroke="#7c5cff"
        />
      </CardContent>
    </Card>
  );
}

const PLATFORMS: FeedPlatform[] = ["google", "yelp", "facebook"];
const PLATFORM_COLOR: Record<FeedPlatform, string> = {
  google: "#3b82f6",
  yelp: "#ef4444",
  facebook: "#6366f1",
};

export function PlatformVolumeChart() {
  const [hovered, setHovered] = useState<{ month: string; platform: FeedPlatform } | null>(null);
  const maxTotal = Math.max(
    ...MONTHLY_TREND.map((m) => PLATFORMS.reduce((sum, p) => sum + m.platformCounts[p], 0))
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
          {MONTHLY_TREND.map((m) => {
            const total = PLATFORMS.reduce((sum, p) => sum + m.platformCounts[p], 0);
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full max-w-10 flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px]">
                  {PLATFORMS.map((platform) => {
                    const count = m.platformCounts[platform];
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
