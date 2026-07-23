"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { statusForValue } from "@/components/dashboard/meter";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ score, size = 128 }: { score: number; size?: number }) {
  const status = statusForValue(score);
  const color = status === "good" ? "#0ca30c" : status === "warning" ? "#fab219" : "#d03b3b";

  // A CSS transition on strokeDashoffset never actually fires on mount
  // (there's no prior value to transition from), so the ring rendered at
  // its final position with no animation - drive it from 0 instead.
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplay(score);
      return;
    }
    hasAnimated.current = true;
    const controls = animate(0, score, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [score]);

  const offset = CIRCUMFERENCE * (1 - display / 100);

  return (
    <div className="relative shrink-0" style={{ height: size, width: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-100 dark:text-slate-800"
        />
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
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">{Math.round(display)}</span>
        <span className="text-[11px] text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}
