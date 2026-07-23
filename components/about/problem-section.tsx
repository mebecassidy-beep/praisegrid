import { Clock3, MessagesSquare, ThumbsDown } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

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

export function ProblemSection() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            We built Reputicious because this was broken
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every local business owner we talked to described some version of the same problem.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-3" stagger={0.15}>
          {PROBLEMS.map((problem) => (
            <RevealItem key={problem.title} className="rounded-xl border border-border/60 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                <problem.icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{problem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
