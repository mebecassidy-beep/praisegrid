"use client";

import { useState } from "react";
import { Check, Flag, Pencil, RefreshCw, Send, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedReview, FeedStatus } from "@/lib/dashboard/mock-data";
import { PLATFORM_META, STATUS_META } from "@/components/reviews/platform-meta";

export function ReviewFeedCard({
  review,
  onStatusChange,
}: {
  review: FeedReview;
  onStatusChange: (id: string, status: FeedStatus) => void;
}) {
  const [draftIndex, setDraftIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(review.aiDrafts[0]);

  const platform = PLATFORM_META[review.platform];
  const status = STATUS_META[review.status];

  function handleRegenerate() {
    if (generating || review.aiDrafts.length < 2) return;
    setGenerating(true);
    setTimeout(() => {
      const nextIndex = (draftIndex + 1) % review.aiDrafts.length;
      setDraftIndex(nextIndex);
      setDraftText(review.aiDrafts[nextIndex]);
      setGenerating(false);
    }, 600);
  }

  function handleApprove() {
    onStatusChange(review.id, "approved");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-semibold text-white">
            {review.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{review.reviewerName}</p>
              <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium", platform.badgeClass)}>
                <platform.icon className="h-3 w-3" />
                {platform.label}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
          </div>
        </div>
        <Badge className={cn("shrink-0 border-transparent shadow-none", status.badgeClass)}>
          {status.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm leading-relaxed text-foreground/90">{review.reviewText}</p>

        <div className="rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-violet-500/5 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">Claude AI draft response</span>
          </div>

          {editing ? (
            <Textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="min-h-[90px] bg-background text-sm"
              autoFocus
            />
          ) : (
            <p className={cn("text-sm leading-relaxed text-foreground/80 transition-opacity", generating && "opacity-30")}>
              {draftText}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={() => setEditing(false)} className="gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Save draft
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={review.status === "approved"}
                  className="gap-1.5"
                >
                  {review.status === "approved" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {review.status === "approved" ? "Posted" : "Approve & Post"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRegenerate}
                  disabled={review.aiDrafts.length < 2}
                  className="gap-1.5"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", generating && "animate-spin")} />
                  Regenerate
                </Button>
                {review.status !== "flagged" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStatusChange(review.id, "flagged")}
                    className="ml-auto gap-1.5 text-muted-foreground hover:text-red-600"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Flag
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
