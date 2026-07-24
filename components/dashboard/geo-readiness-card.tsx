import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Meter, statusForValue, type MeterStatus } from "@/components/dashboard/meter";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<MeterStatus, string> = {
  good: "Strong",
  warning: "Needs attention",
  critical: "At risk",
};

const STATUS_TEXT_CLASS: Record<MeterStatus, string> = {
  good: "text-emerald-600",
  warning: "text-amber-600",
  critical: "text-red-600",
};

/**
 * Only shows factors we can compute from real account data. Structured data,
 * AI crawler accessibility, and citation consistency would need to actually
 * crawl the business's live website — not built yet — so they're marked
 * "Coming soon" instead of showing a plausible-looking fake number.
 */
export function GeoReadinessCard({
  gbpCompleteness,
  responseRate,
}: {
  gbpCompleteness: number;
  responseRate: number;
}) {
  const factors = [
    { label: "Google Business Profile completeness", value: gbpCompleteness },
    { label: "Review response rate", value: responseRate },
  ];
  const score = Math.round((gbpCompleteness + responseRate) / 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4 text-blue-500" />
          Profile readiness
        </CardTitle>
        <CardDescription>
          How complete your business profile and review responsiveness are, the foundation for
          showing up in Google and AI answer engines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <ScoreRing score={score} />
          </div>

          <div className="w-full flex-1 space-y-3.5">
            {factors.map((factor) => {
              const status = statusForValue(factor.value);
              return (
                <div key={factor.label}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground/90">{factor.label}</span>
                    <span className={cn("shrink-0 text-xs font-medium", STATUS_TEXT_CLASS[status])}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <Meter value={factor.value} status={status} />
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2 opacity-60">
              <span className="text-sm text-foreground/90">Structured data, AI crawler access &amp; citations</span>
              <Badge variant="outline" className="shrink-0 border-transparent bg-muted text-muted-foreground">
                Coming soon
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
