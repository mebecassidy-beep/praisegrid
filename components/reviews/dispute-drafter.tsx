"use client";

import { useState } from "react";
import { Check, Copy, FileWarning, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/types";

const REPORT_URL: Record<Review["platform"], string> = {
  google: "https://support.google.com/business/answer/2622994",
  yelp: "https://www.yelp.com/guidelines",
  facebook: "https://www.facebook.com/business/help",
};

export function DisputeDrafter({
  review,
  onReviewUpdate,
}: {
  review: Review;
  onReviewUpdate: (review: Review) => void;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(review.dispute_notes ?? "");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (generating || !notes.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't generate a dispute draft.");
      onReviewUpdate(data.review);
    } catch (err: any) {
      setError(err.message || "Couldn't generate a dispute draft.");
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    if (!review.dispute_draft) return;
    navigator.clipboard.writeText(review.dispute_draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!open) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="gap-1.5 text-muted-foreground">
        <FileWarning className="h-3.5 w-3.5" />
        Looks fake? Dispute it
      </Button>
    );
  }

  return (
    <div className="space-y-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <FileWarning className="h-3.5 w-3.5" />
        Fake review dispute draft
      </p>
      <p className="text-xs text-muted-foreground">
        Explain why this doesn&apos;t look like a real customer (e.g. no record of this transaction, mentions a
        different business, you suspect it&apos;s from a competitor). Claude drafts a formal policy-violation
        request grounded only in what you provide, you submit it yourself through {review.platform}&apos;s
        report flow.
      </p>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. We have no record of a customer or transaction by this name in the last 12 months."
        className="min-h-[70px] bg-background text-sm"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}

      {review.dispute_draft ? (
        <div className="space-y-2">
          <div className="rounded-lg border bg-background p-3 text-xs leading-relaxed text-foreground/90">
            {review.dispute_draft}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy draft"}
            </Button>
            <a href={REPORT_URL[review.platform]} target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline">
                Open {review.platform} report flow
              </Button>
            </a>
            <Button size="sm" variant="ghost" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Regenerate"}
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" onClick={handleGenerate} disabled={generating || !notes.trim()} className="gap-1.5">
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Generate dispute draft"}
        </Button>
      )}
    </div>
  );
}
