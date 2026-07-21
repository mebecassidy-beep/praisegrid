"use client";

import { motion } from "framer-motion";
import { MONTHLY_TREND } from "@/lib/dashboard/mock-data";

const WIDTH = 480;
const HEIGHT = 160;
const PAD = 16;

export function DrawTrendChart() {
  const values = MONTHLY_TREND.map((m) => m.avgRating);
  const labels = MONTHLY_TREND.map((m) => m.month);
  const min = Math.min(...values) * 0.94;
  const max = Math.max(...values) * 1.04;
  const span = max - min || 1;
  const step = (WIDTH - PAD * 2) / (values.length - 1);

  const points = values.map((v, i) => ({
    x: PAD + i * step,
    y: HEIGHT - 28 - ((v - min) / span) * (HEIGHT - 48),
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x} ${HEIGHT - 24} L ${points[0].x} ${HEIGHT - 24} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={areaPath}
        fill="url(#trendFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />

      <motion.path
        d={path}
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      {points.map((p, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, delay: 0.3 + i * (1.1 / points.length) }}
        >
          <circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3} fill="#60a5fa" />
          {i === points.length - 1 && (
            <text x={p.x} y={p.y - 14} textAnchor="end" className="fill-white text-[13px] font-semibold">
              {values[i].toFixed(1)}★
            </text>
          )}
        </motion.g>
      ))}

      {labels.map((label, i) => (
        <text
          key={label}
          x={points[i].x}
          y={HEIGHT - 6}
          textAnchor="middle"
          className="fill-slate-500 text-[10px]"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
