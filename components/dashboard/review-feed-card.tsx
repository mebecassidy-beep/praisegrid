"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Loader2, Pencil, RefreshCw, Send, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";
import { getDisplayStatus } from "@/lib/reviews/display-status";
import { PLATFORM_META, STATUS_META } from "@/components/reviews/platform-meta";
import { CrisisAlertBadge } from "@/components/reviews/crisis-alert-badge";
import { DisputeDrafter } from "@/components/reviews/dispute-drafter";

function initialsFor(name: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function relativeDate(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function ReviewFeedCard({
  review,
  onReviewUpdate,
}: {
  review: Review;
  onReviewUpdate: (review: Review) => void;
}) {
  const [draftText, setDraftText] = useState(review.response_text ?? "");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This card can be updated from elsewhere (e.g. the Revenue Protection
  // banner approves the same review, then the page refreshes) — resync the
  // draft when the underlying review's response_text changes so this card
  // doesn't keep showing pre-refresh content.
  useEffect(() => {
    setDraftText(review.response_text ?? "");
  }, [review.response_text]);

  const platform = PLATFORM_META[review.platform];
  const displayStatus = getDisplayStatus(review);
  const status = STATUS_META[displayStatus];
  const isDone = review.status === "approved" || review.status === "posted";

  async function handleGenerate() {
    if (generating) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: review.id, location_id: review.location_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't generate a response.");
      setDraftText(data.response);
    } catch (err: any) {
      setError(err.message || "Couldn't generate a response.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleApprove() {
    if (saving || !draftText.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_text: draftText, status: "posted" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't save this response.");
      onReviewUpdate(data.review);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Couldn't save this response.");
    } finally {
      setSaving(false);
    }
  }

  const isCrisis = review.risk_level === "high";

  return (
    <Card
      className={cn(
        displayStatus === "flagged" && "border-red-500/30 shadow-red-500/5",
        isCrisis && "border-2 border-red-600 shadow-lg shadow-red-600/10"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-violet-500 text-xs font-semibold text-white">
            {initialsFor(review.reviewer_name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{review.reviewer_name || "Anonymous"}</p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                  platform.badgeClass
                )}
              >
                <platform.icon className="h-3 w-3" />
                {platform.label}
              </span>
              <CrisisAlertBadge riskLevel={review.risk_level} />
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
              <span className="text-xs text-muted-foreground">{relativeDate(review.review_date)}</span>
            </div>
          </div>
        </div>
        <Badge className={cn("shrink-0 gap-1 border-transparent shadow-none", status.badgeClass)}>
          {displayStatus === "flagged" && <AlertTriangle className="h-3 w-3" />}
          {status.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm leading-relaxed text-foreground/90">{review.review_text}</p>

        <div
          className={cn(
            "rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/[0.07] via-violet-500/[0.05] to-transparent p-4 shadow-sm",
            isCrisis && "border-red-500/30 from-red-500/[0.06] via-orange-500/[0.04]"
          )}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              Claude AI
            </span>
            {isCrisis && (
              <span className="text-[11px] font-medium text-red-600">Drafted to be calm, professional, and legally safe</span>
            )}
          </div>

          {editing ? (
            <Textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="min-h-[90px] bg-background text-sm"
              autoFocus
            />
          ) : draftText ? (
            <p className={cn("text-sm leading-relaxed text-foreground/80 transition-opacity", generating && "opacity-30")}>
              {draftText}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No draft yet — generate one below.</p>
          )}

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={handleApprove} disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Save draft
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : !draftText ? (
              <Button size="sm" onClick={handleGenerate} disabled={generating} className="gap-1.5">
                {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {generating ? "Generating…" : "Generate response"}
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isDone || saving}
                  className={cn(
                    "gap-1.5 font-semibold shadow-sm",
                    !isDone && "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500"
                  )}
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isDone ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {isDone ? "Posted" : "Approve & Post"}
                </Button>
                {!isDone && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleGenerate}
                      disabled={generating}
                      className="gap-1.5"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", generating && "animate-spin")} />
                      Regenerate
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <DisputeDrafter review={review} onReviewUpdate={onReviewUpdate} />
      </CardContent>
    </Card>
  );
}
