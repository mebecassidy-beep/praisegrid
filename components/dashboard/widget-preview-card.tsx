"use client";

import { useMemo, useState } from "react";
import { GalleryHorizontal, LayoutGrid, Square, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

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
 * Preview now renders the account's real positive reviews instead of fake
 * testimonials. The embed snippet is left disabled with a "Coming soon"
 * label rather than copy-able code, since there's no hosted widget script
 * (widget.praisegrid.io) actually built yet.
 */
export function WidgetPreviewCard({
  reviews,
  avgRating,
  totalReviews,
}: {
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
}) {
  const [style, setStyle] = useState<WidgetStyle>("badge");

  const snippets = useMemo(
    () =>
      reviews
        .filter((r) => r.rating >= 4 && !!r.review_text)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [reviews]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Website widget
          <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
            Coming soon
          </Badge>
        </CardTitle>
        <CardDescription>Preview of how your real reviews would look embedded on your site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
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
            {snippets.length === 0 ? (
              <p className="max-w-xs text-center text-sm text-muted-foreground">
                Once you have a few 4-5 star reviews with written feedback, they&apos;ll show up here.
              </p>
            ) : style === "badge" ? (
              <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-md dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                    <Stars rating={Math.round(avgRating)} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {totalReviews.toLocaleString()} reviews · Powered by Praisegrid
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

        <p className="text-xs text-muted-foreground">
          Embeddable widget code isn&apos;t available yet, we&apos;ll notify you when the embed script ships.
        </p>
      </CardContent>
    </Card>
  );
}
