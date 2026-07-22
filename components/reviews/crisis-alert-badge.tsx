import { Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

/**
 * Deliberately louder than the standard "Flagged" status badge — this is the
 * "Crisis Mode" visual signal for risk_level "high" (1-star + a
 * lawsuit/injury/health-inspector keyword hit, see lib/reviews/classify-risk.ts).
 * "medium" risk (any 1-2 star) still gets the quieter "Flagged" badge in
 * platform-meta.ts; this one is reserved for the smaller set of reviews that
 * warrant an interrupt-the-owner-immediately treatment.
 */
export function CrisisAlertBadge({ riskLevel, className }: { riskLevel: RiskLevel | null; className?: string }) {
  if (riskLevel !== "high") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm shadow-red-600/30",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      <Siren className="h-3 w-3" />
      Crisis Alert
    </span>
  );
}
