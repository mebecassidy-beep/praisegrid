"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, Loader2, Send, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types";

export function RevenueProtectionBanner({ reviews }: { reviews: Review[] }) {
  const flagged = reviews.filter(
    (r) => r.status === "pending" && r.rating <= 2
  );

  if (flagged.length === 0) return null;

  return <RevenueProtectionBannerInner reviews={flagged} />;
}

function RevenueProtectionBannerInner({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const review = reviews[0];
  const [draftText, setDraftText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDraft() {
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
      if (!res.ok) throw new Error(data?.error || "Couldn't draft a response.");
      setDraftText(data.response);
    } catch (err: any) {
      setError(err.message || "Couldn't draft a response.");
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
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Couldn't save this response.");
      }
      setDone(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Couldn't save this response.");
    } finally {
      setSaving(false);
    }
  }

  if (done) return null;

  return (
    <div className="rounded-xl border-2 border-red-500/40 bg-red-500/[0.06] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
            <AlertOctagon className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">
              Revenue at risk, {reviews.length > 1 ? `${reviews.length} negative reviews need` : "a negative review needs"} a response
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < review.rating ? "fill-red-500 text-red-500" : "text-red-500/20"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{review.reviewer_name || "Anonymous"}</span>
            </div>
            <p className="mt-1 max-w-xl text-sm text-foreground/80">&ldquo;{review.review_text}&rdquo;</p>
          </div>
        </div>

        {!draftText && (
          <Button
            size="sm"
            onClick={handleDraft}
            disabled={generating}
            className="shrink-0 gap-1.5 bg-red-600 font-semibold text-white shadow-sm hover:bg-red-500"
          >
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {generating ? "Drafting…" : "Draft AI Apology & Private Resolution"}
          </Button>
        )}
      </div>

      {draftText && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-background p-3.5">
          <p className="mb-1.5 text-xs font-semibold text-red-600">AI-drafted resolution</p>
          <p className="text-sm leading-relaxed text-foreground/90">{draftText}</p>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={saving} className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Approve &amp; Send
            </Button>
            <Button size="sm" variant="outline" onClick={handleDraft} disabled={generating} className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
