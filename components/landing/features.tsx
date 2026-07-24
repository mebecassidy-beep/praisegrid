import { BarChart3, MapPin, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";

const FEATURES = [
  {
    icon: MapPin,
    title: "Google Review Sync",
    description:
      "Your 5 most recent Google reviews sync in automatically every day, so nothing slips through unnoticed. Full history and instant reply-posting are next.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Sparkles,
    title: "AI Brand Voice",
    description:
      "AI-drafted responses trained on your tone and past replies, so every reply sounds like it came straight from your team.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    icon: Zap,
    title: "Auto-Approve Rules",
    description:
      "Set confidence thresholds and star-rating rules to auto-post low-risk responses while flagging edge cases for review.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: BarChart3,
    title: "Sentiment Analytics",
    description:
      "Track sentiment trends, spot recurring complaints, and benchmark your rating against local competitors over time.",
    gradient: "from-emerald-500 to-teal-400",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-background py-24">
      <Parallax className="absolute inset-0" speed={30}>
        <div
          className="h-[120%] w-full opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #3b82f6, transparent 35%), radial-gradient(circle at 85% 80%, #7c3aed, transparent 35%)",
          }}
        />
      </Parallax>

      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your reputation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One dashboard to monitor, respond, and grow across every review platform that matters.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {FEATURES.map((feature) => (
            <RevealItem key={feature.title}>
              <Card className="group relative h-full overflow-hidden border-border/60 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} shadow-sm`}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="pt-4 text-lg">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
