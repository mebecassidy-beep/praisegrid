import { Gauge, Heart, MapPinned, Wrench } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const VALUES = [
  {
    icon: Gauge,
    title: "Speed",
    description: "We treat response time like a feature, not an afterthought.",
  },
  {
    icon: Heart,
    title: "Authenticity",
    description: "AI should sound like your team, not like a robot apologizing.",
  },
  {
    icon: MapPinned,
    title: "Local-first",
    description: "Built for the business with one great location, not just enterprise chains.",
  },
  {
    icon: Wrench,
    title: "Craftsmanship",
    description: "We sweat details most tools skip — sentiment nuance, SEO schema, edge cases.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="container">
        <RevealGroup className="mb-16 text-center" stagger={0}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What we optimize for</h2>
        </RevealGroup>

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {VALUES.map((value) => (
            <RevealItem
              key={value.title}
              className="rounded-xl border border-border/60 bg-background p-6 text-center"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                <value.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
