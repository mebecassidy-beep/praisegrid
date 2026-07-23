import Link from "next/link";
import { ArrowRight, Radar, ShieldCheck, ShieldHalf, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FeatureScreenshot } from "@/components/features/screenshot-placeholder";
import { cn } from "@/lib/utils";

interface Module {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
  compliance?: string;
  gradient: string;
  screenshotSrc: string;
  screenshotAlt: string;
  ctaLabel: string;
}

const MODULES: Module[] = [
  {
    icon: ShieldHalf,
    eyebrow: "Crisis mode",
    title: "Autonomous Crisis Shield",
    description:
      "The moment a 1 or 2 star review lands, it's pinned to the top of your feed with a Crisis Alert badge and a calm, on-brand response already drafted. You just approve it.",
    outcome: "Respond to a crisis in under 60 seconds",
    gradient: "from-red-500 to-orange-400",
    screenshotSrc: "/assets/features-high-converting/crisis-shield.png",
    screenshotAlt: "Review feed with a pinned 1-star review, Crisis Alert badge, and drafted response",
    ctaLabel: "See how a crisis response gets drafted",
  },
  {
    icon: Sparkles,
    eyebrow: "AI response drafting",
    title: "Claude Opus Brand Voice",
    description:
      "Every response is drafted by Claude Opus, trained on your tone and past replies, so it reads like your team wrote it, not a robot. Review it, tweak it if you want, approve in one click.",
    outcome: "Save 5+ hours a week on responses",
    gradient: "from-violet-500 to-fuchsia-400",
    screenshotSrc: "/assets/features-high-converting/ai-brand-voice.png",
    screenshotAlt: "AI-drafted response next to the original review, ready to approve",
    ctaLabel: "Try it with your own reviews",
  },
  {
    icon: Radar,
    eyebrow: "Local competitive intel",
    title: "Local Competitor Radar",
    description:
      "See the recurring complaints in a nearby competitor's own public reviews, turned into concrete moves you can make this week to win their unhappy customers.",
    outcome: "Turn a rival's weak spot into your next customer",
    compliance: "Powered by Google's official Places API, no scraping, no ToS risk",
    gradient: "from-emerald-500 to-teal-400",
    screenshotSrc: "/assets/features-high-converting/competitor-radar.png",
    screenshotAlt: "Competitor Radar panel showing a rival's recurring complaint themes",
    ctaLabel: "Scan your own competitor",
  },
];

function FeatureModule({ module, reverse }: { module: Module; reverse: boolean }) {
  return (
    <Reveal>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn("order-1", reverse ? "lg:order-2" : "lg:order-1")}>
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}
          >
            <module.icon className="h-6 w-6 text-white" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {module.eyebrow}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {module.title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
            {module.description}
          </p>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            {module.outcome}
          </div>

          {module.compliance && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {module.compliance}
            </p>
          )}

          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-colors hover:gap-2.5 hover:text-blue-300"
          >
            {module.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform" />
          </Link>
        </div>

        <div className={cn("order-2", reverse ? "lg:order-1" : "lg:order-2")}>
          <FeatureScreenshot src={module.screenshotSrc} alt={module.screenshotAlt} />
        </div>
      </div>
    </Reveal>
  );
}

export function CinematicShowcase() {
  return (
    <section className="relative bg-surface-dark py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Inside the dashboard
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The three things that actually move your reputation
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Not a feature list, the actual software your team logs into every day.
          </p>
        </Reveal>

        <div className="mt-20 space-y-24 sm:mt-28 sm:space-y-32">
          {MODULES.map((module, i) => (
            <FeatureModule key={module.title} module={module} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
