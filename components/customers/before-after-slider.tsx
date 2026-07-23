"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, GripVertical, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransformationExample } from "@/components/customers/transformation-data";

function MiniStarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"
          )}
        />
      ))}
    </div>
  );
}

function SidePanel({
  side,
  data,
}: {
  side: "before" | "after";
  data: TransformationExample["before"] | TransformationExample["after"];
}) {
  const isBefore = side === "before";
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center gap-3 p-5",
        isBefore ? "bg-red-500/[0.06]" : "bg-emerald-500/[0.08]"
      )}
    >
      <span
        className={cn(
          "w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
          isBefore
            ? "border-red-500/30 text-red-600"
            : "border-emerald-500/30 text-emerald-600"
        )}
      >
        {isBefore ? "Before" : "After Praisegrid"}
      </span>

      <div className="flex items-center gap-2">
        <MiniStarRow rating={data.rating} />
        <span className="text-sm font-semibold">{data.rating.toFixed(1)}</span>
      </div>

      <p className="text-xs text-muted-foreground">{data.responseTime}</p>

      <ul className="space-y-1.5">
        {data.points.map((point) => (
          <li key={point} className="flex items-start gap-1.5 text-xs leading-snug">
            {isBefore ? (
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
            )}
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The underlying data is metrics/copy, not before/after photos, so this
 * mimics the classic image-comparison slider using two identically-shaped
 * text panels instead - drag the handle to reveal how much changes.
 */
export function BeforeAfterSlider({ example }: { example: TransformationExample }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative h-64 w-full select-none overflow-hidden rounded-xl border">
      <div className="absolute inset-0">
        <SidePanel side="after" data={example.after} />
      </div>

      {/* clip-path (not a width+overflow wrapper) so this layer stays the
          full slider width and just gets visually cropped - a fixed-width
          inner div would drift out of sync as the grid's column width
          changes across breakpoints. */}
      <div
        className="pointer-events-none absolute inset-0 border-r"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <SidePanel side="before" data={example.before} />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 flex w-0 items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <div className="flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border bg-background shadow-md">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`Drag to compare ${example.businessName} before and after Praisegrid`}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
