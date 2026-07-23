import Link from "next/link";
import { ArrowRight, ImageIcon, Siren, ShieldCheck, TrendingUp } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const STANDOUT_FEATURES = [
  {
    icon: Siren,
    eyebrow: "Crisis Mode",
    title: "Crisis Shield",
    description:
      "1-2 star reviews get pinned to the top of your feed with a Crisis Alert badge and a calm, legally-safe AI response draft, ready for you to approve in one click.",
    gradient: "from-red-500 to-orange-400",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Post-service automation",
    title: "Feedback Shield",
    description:
      "Every customer gets asked privately first, then sees the same public Google/Yelp review link afterward, no matter their rating. Nobody is ever routed away from a review platform.",
    compliance: "Built to the FTC's 2024 rule on fake & manipulated reviews, no review gating, ever",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: TrendingUp,
    eyebrow: "Local competitive intel",
    title: "Competitor Leaks",
    description:
      "See the recurring complaints in a nearby rival's own public reviews, turned into concrete moves you can make this week to win their unhappy customers.",
    compliance: "Powered by Google's official Places API, no scraping, no ToS risk",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: ImageIcon,
    eyebrow: "Marketing automation",
    title: "Social Auto-Pilot",
    description:
      "Verified 5-star reviews are instantly turned into on-brand Instagram & Facebook graphics with a ready-to-post caption, no design work required.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
];

export function StandoutFeatures() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            What sets Praisegrid apart
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the moments that actually move your reputation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four capabilities you won&apos;t find bundled together anywhere else, each one compliant by design.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2" stagger={0.1}>
          {STANDOUT_FEATURES.map((feature) => (
            <RevealItem key={feature.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-shadow hover:shadow-xl">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-sm`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {feature.eyebrow}
                </p>
                <h3 className="mt-1 text-xl font-bold tracking-tight">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                {feature.compliance && (
                  <p className="mt-4 inline-flex items-start gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {feature.compliance}
                  </p>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity hover:opacity-90"
          >
            See it on your business, start your free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
