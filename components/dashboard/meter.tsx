import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  good: "#0ca30c",
  warning: "#fab219",
  critical: "#d03b3b",
} as const;

export type MeterStatus = keyof typeof STATUS_COLORS;

export function statusForValue(value: number): MeterStatus {
  if (value >= 80) return "good";
  if (value >= 55) return "warning";
  return "critical";
}

export function Meter({
  value,
  status,
  className,
}: {
  value: number;
  status?: MeterStatus;
  className?: string;
}) {
  const resolvedStatus = status ?? statusForValue(value);
  const color = STATUS_COLORS[resolvedStatus];

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}
