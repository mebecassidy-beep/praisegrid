"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function colorForScore(score: number) {
  if (score >= 80) return "#0ca30c";
  if (score >= 55) return "#fab219";
  return "#d03b3b";
}

export function ScoreRing({
  score,
  animate = true,
  size = 128,
}: {
  score: number;
  animate?: boolean;
  size?: number;
}) {
  const controls = useAnimation();
  const color = colorForScore(score);

  useEffect(() => {
    if (!animate) return;
    controls.set({ strokeDashoffset: CIRCUMFERENCE });
    controls.start({
      strokeDashoffset: CIRCUMFERENCE * (1 - score / 100),
      transition: { duration: 1.1, ease: "easeOut" },
    });
  }, [score, animate, controls]);

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
          className="text-slate-800"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={animate ? { strokeDashoffset: CIRCUMFERENCE } : undefined}
          animate={controls}
          style={!animate ? { strokeDashoffset: CIRCUMFERENCE * (1 - score / 100) } : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums tracking-tight text-white">{score}</span>
        <span className="text-[11px] text-slate-400">out of 100</span>
      </div>
    </div>
  );
}
