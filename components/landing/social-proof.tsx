import { Quote, Sparkles } from "lucide-react";

const STATS = [
  { value: "10k+", label: "Reviews Managed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+", label: "Local Businesses" },
  { value: "98%", label: "Response Rate" },
];

interface SampleTestimonial {
  businessType: string;
  quote: string;
  result: string;
}

// Illustrative examples — visibly labeled "Sample result" in the UI below.
// Swap for verified customer quotes as they come in (see item 5 discussion).
const TESTIMONIALS: SampleTestimonial[] = [
  {
    businessType: "Local plumbing & HVAC company",
    quote:
      "We used to let reviews pile up for weeks. Now every one gets an on-brand reply the same day, and we haven't lost a customer to an unanswered complaint since.",
    result: "~6 hours/week saved on review management",
  },
  {
    businessType: "Neighborhood restaurant",
    quote:
      "A scathing 1-star review went up on a Friday night. Reputicious flagged it instantly and had a response drafted before we even saw the notification.",
    result: "Negative review addressed in under 10 minutes",
  },
];

export function SocialProof() {
  return (
    <section id="metrics" className="border-b bg-slate-950">
      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-14">
        <div className="container">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
            The kind of results local businesses see
          </p>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.businessType}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.businessType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    <Sparkles className="h-2.5 w-2.5" />
                    Sample result
                  </span>
                </div>
                <Quote className="h-5 w-5 text-blue-500/40" />
                <p className="mt-2 text-sm leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-emerald-400">{t.result}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-lg text-center text-xs text-slate-600">
            Illustrative examples of typical outcomes, not verified customer quotes — individual results
            vary by business.
          </p>
        </div>
      </div>
    </section>
  );
}
