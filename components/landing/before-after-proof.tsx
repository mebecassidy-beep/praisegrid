import { AlertTriangle, CheckCircle2, MapPin, Star } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const BEFORE_POINTS = [
  { icon: AlertTriangle, label: "12 unanswered reviews" },
  { icon: MapPin, label: "Ranked #7 for \"plumbers near me\"" },
  { icon: AlertTriangle, label: "Average response time: never" },
];

const AFTER_POINTS = [
  { icon: CheckCircle2, label: "100% response rate in under 24h" },
  { icon: MapPin, label: "Top 3 local pack for \"plumbers near me\"" },
  { icon: CheckCircle2, label: "Every review answered on-brand, automatically" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.round(rating)
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-slate-700"
          }
        />
      ))}
    </div>
  );
}

export function BeforeAfterProof() {
  return (
    <section className="border-b border-white/10 bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real transformation, not a mockup
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            This is what local businesses like yours look like before and after Reputicious.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2" stagger={0.15}>
          <RevealItem>
            <div className="h-full rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Before — Sac Valley Plumbing
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">3.8</span>
                <StarRow rating={3.8} />
              </div>
              <ul className="mt-5 space-y-3">
                {BEFORE_POINTS.map((point) => (
                  <li key={point.label} className="flex items-start gap-2 text-sm text-slate-300">
                    <point.icon className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {point.label}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="h-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                After — with Reputicious
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">4.9</span>
                <StarRow rating={4.9} />
              </div>
              <ul className="mt-5 space-y-3">
                {AFTER_POINTS.map((point) => (
                  <li key={point.label} className="flex items-start gap-2 text-sm text-slate-300">
                    <point.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {point.label}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>

        <p className="mx-auto mt-6 max-w-md text-center text-xs text-slate-500">
          Illustrative example based on typical outcomes — individual results vary by business and starting point.
        </p>
      </div>
    </section>
  );
}
