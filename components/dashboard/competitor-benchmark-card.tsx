import Link from "next/link";
import { ArrowRight, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompetitorSnapshot } from "@/lib/competitor/get-competitor-snapshot";

export function CompetitorBenchmarkCard({
  yourName,
  yourRating,
  yourReviewCount,
  competitor,
}: {
  yourName: string;
  yourRating: number;
  yourReviewCount: number;
  competitor: CompetitorSnapshot | null;
}) {
  if (!competitor) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-blue-500" />
            Competitor benchmark
          </CardTitle>
          <CardDescription>See exactly where you stand against a local competitor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Add a competitor&apos;s business name to see a live head-to-head comparison.
            </p>
            <Link
              href="/settings"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Add a competitor
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ahead = yourRating > competitor.rating;
  const tied = yourRating === competitor.rating;
  const gapReviews = Math.max(0, competitor.reviewCount - yourReviewCount + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Competitor benchmark
        </CardTitle>
        <CardDescription>
          {yourName} vs. {competitor.competitorName}
          {!competitor.isRealData && ", benchmark estimate"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={cn(
              "rounded-xl border-2 p-3.5",
              ahead ? "border-emerald-500/40 bg-emerald-500/5" : "border-border"
            )}
          >
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {yourName} (you)
            </p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-bold tracking-tight">
              {yourRating > 0 ? yourRating.toFixed(1) : "—"}
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-xs text-muted-foreground">{yourReviewCount.toLocaleString()} reviews</p>
          </div>
          <div
            className={cn(
              "rounded-xl border-2 p-3.5",
              !ahead && !tied ? "border-red-500/30 bg-red-500/5" : "border-border"
            )}
          >
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {competitor.competitorName}
            </p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-bold tracking-tight">
              {competitor.rating.toFixed(1)}
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-xs text-muted-foreground">{competitor.reviewCount.toLocaleString()} reviews</p>
          </div>
        </div>

        <p
          className={cn(
            "rounded-lg px-3.5 py-2.5 text-sm font-medium",
            ahead ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          )}
        >
          {ahead
            ? `You're ahead of ${competitor.competitorName}, keep responding fast to stay there.`
            : tied
              ? `You're tied with ${competitor.competitorName}, a few more 5-star reviews puts you in the lead.`
              : `Gain ~${gapReviews} more 5-star review${gapReviews === 1 ? "" : "s"} to pull ahead of ${competitor.competitorName}.`}
        </p>
      </CardContent>
    </Card>
  );
}
