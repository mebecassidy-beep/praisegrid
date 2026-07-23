"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock3, MessagesSquare, Newspaper, ThumbsDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const PROBLEMS = [
  {
    icon: MessagesSquare,
    title: "Reviews are scattered",
    description:
      "Google, Yelp, and Facebook are three different inboxes, three different logins, and three different things to remember to check before your coffee's even done.",
  },
  {
    icon: Clock3,
    title: "Silence reads as indifference",
    description:
      "A review left unanswered for a week doesn't just annoy one customer, it signals to every future customer scrolling past that nobody's actually listening.",
  },
  {
    icon: ThumbsDown,
    title: "Generic replies feel worse than none",
    description:
      "A copy-pasted \"Thank you for your feedback!\" on every review, good or bad, erodes exactly the trust it's supposed to build.",
  },
];

function Milestone({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="min-h-[70vh] py-16 first:pt-0 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">{eyebrow}</p>
      <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      <div className="mt-6 max-w-lg space-y-5 text-lg leading-relaxed text-slate-300">{children}</div>
    </Reveal>
  );
}

export function AboutScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative grid gap-12 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* Pinned visual anchor - stays in view while milestones scroll past beside it */}
        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-12rem)] flex-col items-center justify-center gap-8">
            <div className="relative flex h-64 w-64 items-center justify-center">
              <span className="absolute inset-1.5 rounded-full border border-white/5" />
              <span className="absolute left-0 top-1/2 h-px w-8 -translate-x-full bg-gradient-to-l from-white/10 to-transparent" />
              <span className="absolute right-1 top-1 h-[calc(100%-1px)] w-1 rounded-full bg-white/5">
                <motion.span
                  style={{ height: progressHeight }}
                  className="block w-full rounded-full bg-gradient-to-b from-blue-400 to-violet-500"
                />
              </span>
              <motion.div
                style={{ rotate: orbRotate, scale: orbScale }}
                className="h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/40 via-violet-500/30 to-fuchsia-500/20 blur-2xl"
              />
              <div className="absolute flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20">
                MC
              </div>
            </div>
            <p className="max-w-[14rem] text-center text-sm text-slate-500">
              Built by one person who&apos;d spent a career making sure the right message reached the
              right person, fast.
            </p>
          </div>
        </div>

        <div>
          <Milestone eyebrow="The problem" title="We built Reputicious because this was broken">
            <p className="text-base text-slate-400">
              Every local business owner we talked to described some version of the same problem.
            </p>
            <div className="space-y-4 pt-2">
              {PROBLEMS.map((problem) => (
                <div key={problem.title} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                    <problem.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{problem.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Milestone>

          <Milestone eyebrow="What we believe" title="Speed and authenticity aren't a tradeoff">
            <p>
              We believe responding to a customer should take{" "}
              <span className="font-semibold text-white">seconds, not a spare afternoon.</span> We
              believe an AI-drafted reply can still sound like{" "}
              <span className="font-semibold text-white">you</span>, if it&apos;s actually trained on
              your voice, not a generic template. And we believe local businesses deserve the same
              review-response speed and polish that big brands pay agencies for.
            </p>
          </Milestone>

          <Milestone eyebrow="Who built it" title="A journalist who spent a career mastering visibility">
            <p>
              Reputicious was founded by{" "}
              <span className="font-semibold text-white">Maurice Cassidy</span>, a veteran journalist
              and digital strategist with thousands of published pieces as a staff writer and
              contributor across some of the highest-traffic newsrooms in digital media.
            </p>
            <p>
              Alongside that byline career, Maurice built a specialization in digital and news SEO
              dating back to 2010, over a decade spent learning exactly how search algorithms decide
              what gets seen, and how fast a newsroom has to move to control a story before someone
              else does.
            </p>
            <div className="flex items-center gap-2 pt-1 text-sm text-slate-500">
              <Newspaper className="h-4 w-4" />
              Daily Mail &middot; The Shade Room &middot; Hollywood Unlocked
            </div>
          </Milestone>

          <Milestone eyebrow="Why it matters" title="Give business owners their time back">
            <p>
              That newsroom instinct, the one honed on knowing that a slow response loses the story,
              is the same one that now goes into Reputicious: the conviction that a business owner
              shouldn&apos;t have to choose between running their business and defending its
              reputation online.
            </p>
            <p>
              Every feature exists to lift that operational weight off one person&apos;s shoulders, so
              they can get back to the craft they actually opened the business to do.
            </p>
          </Milestone>
        </div>
      </div>
    </section>
  );
}
