"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const RANGES = [
  { months: 3, label: "3 months" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
] as const;

export function DateRangePicker({ months }: { months: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectRange(value: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("months", String(value));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1.5">
      {RANGES.map((r) => (
        <button
          key={r.months}
          onClick={() => selectRange(r.months)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            months === r.months
              ? "border-blue-500 bg-blue-500/10 text-blue-600"
              : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
