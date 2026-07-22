"use client";

import { useState } from "react";
import { Check, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function FeedbackCapture({
  locationId,
  businessName,
  googleReviewLink,
  yelpReviewLink,
}: {
  locationId: string;
  businessName: string;
  googleReviewLink: string | null;
  yelpReviewLink: string | null;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || rating === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/feedback/${locationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, customer_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't submit your feedback.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Couldn't submit your feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  // Step 2 is identical for every rating on purpose: the public review CTA is
  // never withheld based on what a customer just said privately.
  if (submitted) {
    return (
      <div className="w-full max-w-sm space-y-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Thanks for the feedback!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It&apos;s gone straight to the {businessName} team, privately.
          </p>
        </div>

        {(googleReviewLink || yelpReviewLink) && (
          <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
            <p className="text-sm font-medium">Mind sharing it publicly too?</p>
            <p className="text-xs text-muted-foreground">
              Totally optional — it helps other people find {businessName}.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {googleReviewLink && (
                <a href={googleReviewLink} target="_blank" rel="noreferrer">
                  <Button className="w-full">Leave a Google review</Button>
                </a>
              )}
              {yelpReviewLink && (
                <a href={yelpReviewLink} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    Leave a Yelp review
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight">How was your experience with {businessName}?</h1>
        <p className="mt-1 text-sm text-muted-foreground">This goes straight to the business, privately.</p>
      </div>

      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            className="rounded p-1 transition-transform hover:scale-110"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            <Star
              className={cn(
                "h-9 w-9",
                n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>

      {rating > 0 && (
        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
          />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={rating <= 3 ? "What happened? We'd like to make it right." : "Anything you'd like to add?"}
            className="min-h-[90px]"
          />
        </div>
      )}

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={rating === 0 || submitting} className="w-full gap-2">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send feedback"}
      </Button>
    </form>
  );
}
