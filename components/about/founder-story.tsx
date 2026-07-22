import { Newspaper, Search, TrendingUp } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const NEWSROOMS = ["Daily Mail", "The Shade Room", "Hollywood Unlocked"];

const EDGE_POINTS = [
  {
    icon: Newspaper,
    title: "Newsroom-grade speed",
    description:
      "Years spent writing and publishing at the pace real newsrooms demand — where a slow response means losing the story entirely.",
  },
  {
    icon: Search,
    title: "SEO since 2010",
    description:
      "Over a decade specializing in digital and news SEO — reverse-engineering how search algorithms decide what gets seen.",
  },
  {
    icon: TrendingUp,
    title: "Public perception, professionally",
    description:
      "A career built on managing how audiences see a story in real time — the same instinct that now goes into managing how customers see your business.",
  },
];

export function FounderStory() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3), transparent 45%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.25), transparent 45%)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Founder&apos;s story
            </p>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold text-white shadow-lg">
              MC
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built by a journalist who spent a career mastering visibility
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 space-y-5 text-lg leading-relaxed text-slate-300">
            <p>
              Reputicious was founded by <span className="font-semibold text-white">Maurice Cassidy</span>,
              a veteran journalist and digital strategist with thousands of published pieces as a staff
              writer and contributor across some of the highest-traffic newsrooms in digital media.
            </p>
            <p>
              Alongside that byline career, Maurice built a specialization in digital and news SEO dating
              back to 2010 — over a decade spent learning exactly how search algorithms decide what
              gets seen, and how fast-moving newsrooms shape public perception in real time.
            </p>
            <p>
              That combination — algorithm fluency and a professional instinct for public perception,
              forged under newsroom deadlines — is the unfair advantage Reputicious brings to local
              businesses. The same expertise that once got a story to rank and spread is now focused
              on getting your business seen, trusted, and ranked higher on Google Maps.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Published across
            </span>
            {NEWSROOMS.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {name}
              </span>
            ))}
          </Reveal>
        </div>

        <RevealGroup className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3" stagger={0.1}>
          {EDGE_POINTS.map((point) => (
            <RevealItem
              key={point.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-violet-500/15">
                <point.icon className="h-4.5 w-4.5 text-blue-400" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{point.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
