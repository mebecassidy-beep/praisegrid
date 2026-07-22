"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { MapPin, Sparkles, Zap, BarChart3 } from "lucide-react";
import { ShowcasePanel, type ShowcasePanelData } from "@/components/features/showcase-panel";
import {
  MapSyncVisual,
  BrandVoiceVisual,
  AutoApproveVisual,
  SentimentVisual,
} from "@/components/features/showcase-visuals";
import { cn } from "@/lib/utils";

// Same four capabilities as the homepage teaser grid (components/landing/features.tsx),
// presented here as pinned scroll panels instead of a static grid — keep copy in sync
// with that file if it ever changes.
const PANELS: ShowcasePanelData[] = [
  {
    icon: MapPin,
    eyebrow: "Review aggregation",
    title: "Google Maps Sync",
    description:
      "Two-way sync with your Google Business Profile keeps every review, rating, and response perfectly up to date in real time.",
    outcome: "Rank higher on Google Maps SEO",
    compliance: "100% compliant with Google's API Terms of Service — no scraping, no suspension risk",
    gradient: "from-blue-500 to-cyan-400",
    visual: <MapSyncVisual />,
  },
  {
    icon: Sparkles,
    eyebrow: "AI response drafting",
    title: "Claude Opus 4.8 Brand Voice",
    description:
      "AI-drafted responses trained on your tone and past replies, so every reply sounds like it came straight from your team. Review it and approve in one click.",
    outcome: "Save 5+ hours a week on responses",
    gradient: "from-violet-500 to-fuchsia-400",
    visual: <BrandVoiceVisual />,
  },
  {
    icon: Zap,
    eyebrow: "Automation",
    title: "Auto-Approve Rules",
    description:
      "Set confidence thresholds and star-rating rules to auto-post low-risk responses while flagging edge cases for review.",
    outcome: "Rescue negative reviews before they cost you customers",
    compliance: "Meets Google & Meta review-response guidelines — every auto-post stays within platform rules",
    gradient: "from-amber-500 to-orange-400",
    visual: <AutoApproveVisual />,
  },
  {
    icon: BarChart3,
    eyebrow: "Sentiment analytics",
    title: "Track Every Trend",
    description:
      "Track sentiment trends, spot recurring complaints, and benchmark your rating against local competitors over time.",
    outcome: "Catch problems before they tank your rating",
    gradient: "from-emerald-500 to-teal-400",
    visual: <SentimentVisual />,
  },
];

function usePanelMotion(scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"], index: number) {
  const segment = 1 / PANELS.length;
  const start = index * segment;
  const end = start + segment;
  const fade = segment * 0.18;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [start, start + fade], [40, 0]);
  const scale = useTransform(
    scrollYProgress,
    [start, start + fade, end - fade, end],
    [0.96, 1, 1, 0.96]
  );

  return { opacity, y, scale };
}

function Panel({ index, scrollYProgress }: { index: number; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const { opacity, y, scale } = usePanelMotion(scrollYProgress, index);
  return <ShowcasePanel data={PANELS[index]} opacity={opacity} y={y} scale={scale} />;
}

export function StickyScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(PANELS.length - 1, Math.floor(value * PANELS.length));
    setActive(index);
  });

  return (
    <section ref={containerRef} className="relative bg-slate-950" style={{ height: `${PANELS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {PANELS.map((_, i) => (
          <Panel key={i} index={i} scrollYProgress={scrollYProgress} />
        ))}

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          {PANELS.map((panel, i) => (
            <div
              key={panel.title}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                active === i ? "h-6 bg-gradient-to-b from-blue-500 to-violet-600" : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
