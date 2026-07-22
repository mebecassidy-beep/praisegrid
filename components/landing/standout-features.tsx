"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ImageIcon, Siren, ShieldCheck, Sparkles, Star, TrendingUp } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function useAutoplayInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, active };
}

function CrisisShieldPreview() {
  const { ref, active } = useAutoplayInView<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 1800);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div ref={ref} className="mt-5">
      <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-3 w-3", i < 2 ? "fill-red-400 text-red-400" : "text-white/15")} />
          ))}
          <span className="ml-1 text-[11px] text-white/40">Jordan T.</span>
        </div>
        <motion.span
          animate={step === 0 ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={{ duration: 1.4, repeat: step === 0 ? Infinity : 0 }}
          className="whitespace-nowrap rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300"
        >
          Crisis Alert
        </motion.span>
      </div>
      <AnimatePresence mode="wait">
        {step >= 1 && (
          <motion.div
            key="draft"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-2 overflow-hidden rounded-lg bg-white/5 px-3 py-2"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-300">
              <Sparkles className="h-3 w-3" />
              AI draft ready — approve in 1 click
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeedbackShieldPreview() {
  const { ref, active } = useAutoplayInView<HTMLDivElement>();

  return (
    <div ref={ref} className="mt-5 space-y-2">
      {[
        { label: "★★☆☆☆", tag: "Private feedback" },
        { label: "★★★★★", tag: "Private feedback" },
      ].map((row, i) => (
        <motion.div
          key={row.tag + i}
          initial={{ opacity: 0, x: -8 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.15, duration: 0.4 }}
          className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-white/50"
        >
          <span className="tracking-wide text-amber-300/80">{row.label}</span>
          <span className="flex items-center gap-1 text-white/35">
            {row.tag}
            <ArrowRight className="h-3 w-3" />
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-2 text-[11px] font-semibold text-blue-300"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Same public review link — every time
      </motion.div>
    </div>
  );
}

const LEAKS = [
  { label: "Slow service", value: 68 },
  { label: "Rude staff", value: 41 },
  { label: "Long wait times", value: 33 },
];

function CompetitorLeaksPreview() {
  const { ref, active } = useAutoplayInView<HTMLDivElement>();

  return (
    <div ref={ref} className="mt-5 space-y-2.5">
      {LEAKS.map((leak, i) => (
        <div key={leak.label} className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/45">
            <span>{leak.label}</span>
            <span className="text-white/30">{leak.value}% of reviews</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={active ? { width: `${leak.value}%` } : { width: 0 }}
              transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const CAPTIONS = [
  '"Best coffee in town, hands down." ☕✨ — 5 stars from Maria R.',
  '"They fixed what 3 other shops couldn\'t." 🔧⭐⭐⭐⭐⭐',
];

function SocialAutoPilotPreview() {
  const { ref, active } = useAutoplayInView<HTMLDivElement>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % CAPTIONS.length), 3200);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div ref={ref} className="mt-5 rounded-lg border border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-3">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-amber-300 text-amber-300" />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="mt-2 text-[11px] leading-relaxed text-white/55"
        >
          {CAPTIONS[index]}
        </motion.p>
      </AnimatePresence>
      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-violet-300">
        <ImageIcon className="h-3 w-3" />
        Auto-generated for Instagram
      </span>
    </div>
  );
}

const STANDOUT_FEATURES: Array<{
  icon: typeof Siren;
  eyebrow: string;
  title: string;
  description: string;
  compliance?: string;
  gradient: string;
  glow: string;
  span: string;
  preview: ReactNode;
}> = [
  {
    icon: Siren,
    eyebrow: "Crisis Mode",
    title: "Crisis Shield",
    description:
      "1-2 star reviews get pinned to the top of your feed with a Crisis Alert badge and a calm, legally-safe AI response draft — ready for you to approve in one click.",
    gradient: "from-red-500 to-orange-400",
    glow: "rgba(248,113,113,0.16)",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    preview: <CrisisShieldPreview />,
  },
  {
    icon: ShieldCheck,
    eyebrow: "Post-service automation",
    title: "Feedback Shield",
    description:
      "Every customer gets asked privately first, then sees the same public Google/Yelp review link afterward — no matter their rating. Nobody is ever routed away from a review platform.",
    compliance: "Built to the FTC's 2024 rule on fake & manipulated reviews — no review gating, ever",
    gradient: "from-blue-500 to-cyan-400",
    glow: "rgba(96,165,250,0.16)",
    span: "sm:col-span-2 lg:col-span-2",
    preview: <FeedbackShieldPreview />,
  },
  {
    icon: TrendingUp,
    eyebrow: "Local competitive intel",
    title: "Competitor Leaks",
    description:
      "See the recurring complaints in a nearby rival's own public reviews, turned into concrete moves you can make this week to win their unhappy customers.",
    compliance: "Powered by Google's official Places API — no scraping, no ToS risk",
    gradient: "from-emerald-500 to-teal-400",
    glow: "rgba(52,211,153,0.16)",
    span: "sm:col-span-1 lg:col-span-1",
    preview: <CompetitorLeaksPreview />,
  },
  {
    icon: ImageIcon,
    eyebrow: "Marketing automation",
    title: "Social Auto-Pilot",
    description:
      "Verified 5-star reviews are instantly turned into on-brand Instagram & Facebook graphics with a ready-to-post caption — no design work required.",
    gradient: "from-violet-500 to-fuchsia-400",
    glow: "rgba(167,139,250,0.16)",
    span: "sm:col-span-1 lg:col-span-1",
    preview: <SocialAutoPilotPreview />,
  },
];

function BentoCard({ feature }: { feature: (typeof STANDOUT_FEATURES)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current?.style.setProperty("--x", `${e.clientX - rect.left}px`);
    cardRef.current?.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-black/40 sm:p-7"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), ${feature.glow}, transparent 70%)`,
        }}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover:opacity-30",
          feature.gradient
        )}
      />

      <div className="relative flex flex-1 flex-col">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
            feature.gradient
          )}
        >
          <feature.icon className="h-5 w-5 text-white" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-white/40">{feature.eyebrow}</p>
        <h3 className="mt-1 text-xl font-bold tracking-tight text-white">{feature.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-white/55">{feature.description}</p>
        {feature.compliance && (
          <p className="mt-4 inline-flex items-start gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {feature.compliance}
          </p>
        )}
        <div className="mt-auto">{feature.preview}</div>
      </div>
    </div>
  );
}

export function StandoutFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#05060a] py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 55% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 55% at 50% 30%, black, transparent)",
        }}
      />
      <motion.div
        style={{ y: blobY1 }}
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]"
      />
      <motion.div
        style={{ y: blobY2 }}
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]"
      />

      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur">
            <Sparkles className="h-3 w-3 text-blue-400" />
            What sets Reputicious apart
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for the moments that actually move your reputation
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Four capabilities you won&apos;t find bundled together anywhere else — each one compliant by design.
          </p>
        </Reveal>

        <RevealGroup
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6"
          stagger={0.12}
        >
          {STANDOUT_FEATURES.map((feature) => (
            <RevealItem key={feature.title} className={cn("h-full", feature.span)}>
              <BentoCard feature={feature} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity hover:opacity-90"
          >
            See it on your business — Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
