import { Meh, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentBreakdown({
  ratingDistribution,
}: {
  ratingDistribution: { stars: number; count: number }[];
}) {
  const totalReviews = ratingDistribution.reduce((sum, r) => sum + r.count, 0);
  const maxCount = Math.max(1, ...ratingDistribution.map((r) => r.count));

  const positive = ratingDistribution.filter((r) => r.stars >= 4).reduce((s, r) => s + r.count, 0);
  const neutral = ratingDistribution.filter((r) => r.stars === 3).reduce((s, r) => s + r.count, 0);
  const negative = ratingDistribution.filter((r) => r.stars <= 2).reduce((s, r) => s + r.count, 0);
  const pct = (n: number) => (totalReviews === 0 ? 0 : Math.round((n / totalReviews) * 100));

  const SENTIMENT_ROWS = [
    { key: "positive", label: "Positive", icon: ThumbsUp, color: "#0ca30c", value: pct(positive) },
    { key: "neutral", label: "Neutral", icon: Meh, color: "#fab219", value: pct(neutral) },
    { key: "negative", label: "Negative", icon: ThumbsDown, color: "#d03b3b", value: pct(negative) },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rating distribution
          </p>
          <div className="space-y-2.5">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-6 shrink-0 text-xs font-medium text-muted-foreground">
                  {row.stars}★
                </span>
                <div className="h-2.5 flex-1 bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-r-[4px] bg-[#2a78d6] dark:bg-[#3987e5]"
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sentiment split
          </p>
          <div className="space-y-2">
            {SENTIMENT_ROWS.map((row) => (
              <div key={row.key} className="flex items-center gap-2 text-sm">
                <row.icon className="h-4 w-4 shrink-0" style={{ color: row.color }} />
                <span className="text-foreground/90">{row.label}</span>
                <span className="ml-auto text-xs font-medium tabular-nums text-muted-foreground">
                  {row.value}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-2.5 gap-[2px] overflow-hidden rounded-full">
            {SENTIMENT_ROWS.map((row) => (
              <div
                key={row.key}
                className="h-full"
                style={{ width: `${row.value}%`, backgroundColor: row.color }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
