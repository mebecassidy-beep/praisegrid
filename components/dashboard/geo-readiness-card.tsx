import { ArrowUpRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter, statusForValue, type MeterStatus } from "@/components/dashboard/meter";
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

const FACTORS = [
  { label: "Google Business Profile completeness", value: 92 },
  { label: "Review response rate", value: 94 },
  { label: "Structured data & schema markup", value: 58 },
  { label: "Citation consistency", value: 88 },
  { label: "AI crawler accessibility", value: 76 },
];

const SCORE = 82;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ score }: { score: number }) {
  const status = statusForValue(score);
  const color = status === "good" ? "#0ca30c" : status === "warning" ? "#fab219" : "#d03b3b";
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">{score}</span>
        <span className="text-[11px] text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}

export function GeoReadinessCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4 text-blue-500" />
          AI Search Visibility
        </CardTitle>
        <CardDescription>
          How discoverable your business is across Google, AI answer engines, and chat assistants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <ScoreRing score={SCORE} />
            <p className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              6 pts <span className="font-normal text-muted-foreground">vs last month</span>
            </p>
          </div>

          <div className="w-full flex-1 space-y-3.5">
            {FACTORS.map((factor) => {
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
