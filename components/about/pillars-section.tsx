import { BarChart3, MapPin, Sparkles, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    number: "01",
    icon: MapPin,
    title: "Google review sync, every day",
    description:
      "Your 5 most recent Google reviews sync in automatically each day, and the dashboard notifies you the moment they land, no manual refreshing. Full history and instant reply-posting are next.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI that actually sounds like you",
    description:
      "Every draft is trained on your brand's tone and past replies, so responses read like they came from your team, not from a chatbot reading off a script.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    number: "03",
    icon: Zap,
    title: "You stay in control",
    description:
      "Set confidence thresholds and star-rating rules to auto-post the easy calls, while anything sensitive gets flagged for a human to review first.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Insight, not just inbox management",
    description:
      "Sentiment trends, recurring complaints, and rating benchmarks against local competitors, so you know what to fix before it shows up in next month's reviews.",
    gradient: "from-emerald-500 to-teal-400",
  },
];

export function PillarsSection() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How we make good on that</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four product decisions we keep coming back to.
          </p>
        </Reveal>

        <div className="mt-20 space-y-20">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.number}>
              <div
                className={cn(
                  "flex flex-col items-center gap-8 lg:flex-row lg:gap-16",
                  i % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-4">
                  <span className="text-sm font-semibold tracking-widest text-muted-foreground/60">
                    {pillar.number}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <div
                    className={cn(
                      "flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl sm:h-52 sm:w-52",
                      pillar.gradient
                    )}
                  >
                    <pillar.icon className="h-16 w-16 text-white/90 sm:h-20 sm:w-20" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
