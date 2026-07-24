"use client";

import { useMemo, useState } from "react";
import { Check, Copy, GalleryHorizontal, LayoutGrid, Square, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Location, Review } from "@/types";
import type { LocationMetric } from "@/lib/dashboard/queries";

type WidgetStyle = "badge" | "carousel" | "grid";

const STYLES: { value: WidgetStyle; label: string; icon: typeof Square }[] = [
  { value: "badge", label: "Badge", icon: Square },
  { value: "carousel", label: "Carousel", icon: GalleryHorizontal },
  { value: "grid", label: "Grid", icon: LayoutGrid },
];

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
      ))}
    </div>
  );
}

function SnippetCard({ review }: { review: Review }) {
  return (
    <div className="w-48 shrink-0 rounded-lg border bg-white p-3 shadow-sm dark:bg-slate-900">
      <Stars rating={review.rating} />
      <p className="mt-1.5 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">&ldquo;{review.review_text}&rdquo;</p>
      <p className="mt-1.5 text-[11px] font-medium text-slate-400">{review.reviewer_name || "Verified customer"}</p>
    </div>
  );
}

/**
 * Generates a real, working embed snippet backed by /api/public/widget/
 * [locationId] and public/widget.js - a widget embeds one specific
 * location's Google listing, so this has its own location picker
 * independent of the dashboard's global location filter.
 */
export function WidgetPreviewCard({
  locations,
  reviews,
  locationMetrics,
}: {
  locations: Location[];
  reviews: Review[];
  locationMetrics: Record<string, LocationMetric>;
}) {
  const [style, setStyle] = useState<WidgetStyle>("badge");
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const metric = locationMetrics[locationId];
  const locationReviews = useMemo(() => reviews.filter((r) => r.location_id === locationId), [reviews, locationId]);

  const snippets = useMemo(
    () =>
      locationReviews
        .filter((r) => r.rating >= 4 && !!r.review_text)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [locationReviews]
  );

  const embedCode = `<script\n  src="https://praisegrid.com/widget.js"\n  data-location="${locationId}"\n  data-style="${style}"\n  async\n></script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  if (locations.length === 0 || !metric) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Website widget</CardTitle>
          <CardDescription>Connect a location to get an embeddable review widget for your site.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website widget</CardTitle>
        <CardDescription>Show off your real reviews anywhere on your site with one embed snippet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                style === s.value
                  ? "border-blue-500 bg-blue-500/10 text-blue-600"
                  : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}

          {locations.length > 1 && (
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="ml-auto h-7 rounded-full border border-input bg-background px-2.5 text-xs font-medium"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center gap-1.5 border-b bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 rounded-full bg-white px-3 py-0.5 text-[11px] text-slate-500 dark:bg-slate-900">
              yourbusiness.com
            </span>
          </div>

          <div className="flex min-h-[168px] items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
            {style !== "badge" && snippets.length === 0 ? (
              <p className="max-w-xs text-center text-sm text-muted-foreground">
                Once you have a few 4-5 star reviews with written feedback, they&apos;ll show up here.
              </p>
            ) : style === "badge" ? (
              <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-md dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold">{metric.avgRating > 0 ? metric.avgRating.toFixed(1) : "—"}</span>
                    <Stars rating={Math.round(metric.avgRating)} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {metric.reviewCount.toLocaleString()} reviews · Powered by Praisegrid
                  </p>
                </div>
              </div>
            ) : style === "carousel" ? (
              <div className="flex w-full gap-3 overflow-x-auto px-1">
                {snippets.map((r) => (
                  <SnippetCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 gap-3">
                {snippets.slice(0, 2).map((r) => (
                  <SnippetCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
            <code>{embedCode}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white hover:bg-white/20"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste this anywhere in your site&apos;s HTML. It pulls your live rating and reviews on every page load.
        </p>
      </CardContent>
    </Card>
  );
}
