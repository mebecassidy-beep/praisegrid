"use client";

import { useState } from "react";
import { Globe, Lock, ShieldCheck, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { FeedbackResponse } from "@/types";
import { cn } from "@/lib/utils";

const PLATFORMS: ("google" | "yelp" | "facebook")[] = ["google", "yelp", "facebook"];

function relativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

/**
 * "Feedback Shield" — every post-service blast recipient gets the exact same
 * link (see review-blast-card.tsx + app/feedback/[locationId]). This card is
 * intentionally NOT a toggle that hides the public review CTA below some
 * rating threshold: that pattern ("review gating") is banned under the
 * FTC's 2024 rule on fake/manipulated reviews, since it diverts negative
 * feedback away from platforms where it'd be publicly visible while pushing
 * positive feedback toward them. Private capture always happens for every
 * rating; the public CTA is always shown afterward, for every rating.
 */
export function FeedbackShieldCard({ recentResponses }: { recentResponses: FeedbackResponse[] }) {
  const [previewRating, setPreviewRating] = useState(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          Feedback Shield
        </CardTitle>
        <CardDescription>
          Every customer gets asked privately first — and every customer sees the same public review CTA
          afterward, regardless of what they rate you. Nobody is ever routed away from Google or Yelp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Preview — every rating gets both steps
          </p>
          <div className="mb-4 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setPreviewRating(n)}
                className="rounded p-0.5 transition-transform hover:scale-110"
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    n <= previewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-stretch gap-3">
            <div className="flex-1 rounded-lg border border-blue-500 bg-blue-500/5 p-3 text-center">
              <Lock className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium">Private feedback</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Always sent to your inbox</p>
            </div>
            <div className="flex-1 rounded-lg border border-blue-500 bg-blue-500/5 p-3 text-center">
              <Globe className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium">Public platforms</p>
              <div className="mt-1 flex justify-center gap-1.5">
                {PLATFORMS.map((p) => {
                  const meta = PLATFORM_META[p];
                  return <meta.icon key={p} className="h-3 w-3 text-muted-foreground" />;
                })}
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            {previewRating <= 3
              ? `A ${previewRating}★ rating comes to you privately first — but they still see the Google/Yelp link right after, same as everyone else.`
              : `A ${previewRating}★ rating comes to you privately first, then they see the same Google/Yelp link every customer sees.`}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Recent private feedback</p>
          {recentResponses.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
              Private feedback from your smart-timing blasts will show up here.
            </p>
          ) : (
            recentResponses.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{relativeDate(r.created_at)}</span>
                </div>
                {r.comment && <p className="mt-1.5 text-xs text-foreground/80">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
