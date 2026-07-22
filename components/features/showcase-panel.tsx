"use client";

import { motion, type MotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface ShowcasePanelData {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  gradient: string;
  visual: React.ReactNode;
}

export function ShowcasePanel({
  data,
  opacity,
  y,
  scale,
}: {
  data: ShowcasePanelData;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div style={{ y }}>
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${data.gradient} shadow-lg`}
          >
            <data.icon className="h-6 w-6 text-white" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {data.eyebrow}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {data.title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
            {data.description}
          </p>
        </motion.div>

        <motion.div style={{ y }} className="relative">
          {data.visual}
        </motion.div>
      </div>
    </motion.div>
  );
}
