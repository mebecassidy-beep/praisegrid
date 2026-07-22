"use client";

import { useState } from "react";
import { Check, Copy, Download, Loader2, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types";

export function SocialPostGenerator({ review }: { review: Review }) {
  const [caption, setCaption] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imageReady, setImageReady] = useState(Boolean(review.social_generated_at));

  async function handleGenerate() {
    if (generating) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/social/${review.id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't generate this post.");
      setCaption(data.caption);
      setImageReady(true);
    } catch (err: any) {
      setError(err.message || "Couldn't generate this post.");
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mt-1 text-sm font-medium">{review.reviewer_name || "Anonymous"}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">{review.review_text}</p>

        <div className="grid grid-cols-2 gap-3">
          {imageReady && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/social/${review.id}/image`}
              alt="Social post preview"
              className="col-span-1 aspect-square w-full rounded-lg border object-cover"
            />
          )}
          <div className={imageReady ? "col-span-1 space-y-2" : "col-span-2 space-y-2"}>
            {caption ? (
              <p className="rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed">{caption}</p>
            ) : (
              !imageReady && <p className="text-xs text-muted-foreground">Not generated yet.</p>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={handleGenerate} disabled={generating} className="gap-1.5">
                {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {imageReady ? "Regenerate" : "Generate post"}
              </Button>
              {caption && (
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy caption"}
                </Button>
              )}
              {imageReady && (
                <a href={`/api/social/${review.id}/image`} download={`review-${review.id}.png`}>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Download image
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
