"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Search, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CompetitorLeakResult } from "@/lib/competitor/get-competitor-leaks";

export function CompetitorLeakFinderCard({ hasCompetitor }: { hasCompetitor: boolean }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorLeakResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/competitor/leaks", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't scan competitor reviews.");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Couldn't scan competitor reviews.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Local competitor leak finder
        </CardTitle>
        <CardDescription>
          Surfaces recurring complaints from your competitor&apos;s own public reviews (via Google&apos;s
          official API — no scraping) as concrete local growth moves for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasCompetitor ? (
          <p className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            Add a competitor&apos;s business name in Settings to unlock this.
          </p>
        ) : (
          <>
            <Button onClick={handleScan} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {result ? "Rescan competitor reviews" : "Scan competitor reviews"}
            </Button>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {result && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  {result.isRealData
                    ? `Based on ${result.reviewsAnalyzed} real negative review${result.reviewsAnalyzed === 1 ? "" : "s"} for ${result.competitorName}.`
                    : `Illustrative example — connect Google Places to analyze ${result.competitorName}'s real reviews.`}
                </p>
                {result.leaks.map((leak, i) => (
                  <div key={i} className="rounded-lg border p-3.5">
                    <p className="text-sm font-medium">&ldquo;{leak.complaint}&rdquo;</p>
                    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      {leak.strategy}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
