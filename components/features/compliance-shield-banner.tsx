import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export function ComplianceShieldBanner() {
  return (
    <section className="relative bg-background py-24 sm:py-32">
      <div className="container">
        <Reveal>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/30 to-blue-500/30 p-px">
            <div className="flex flex-col items-start gap-5 rounded-2xl bg-card p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  FTC Compliance Shield
                </p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                  Every customer sees the same public review link, always
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Your dashboard runs a live audit on every private feedback submission to confirm
                  nobody was routed away from Google or Yelp based on their rating. Built to the
                  FTC&apos;s 2024 rule on fake and manipulated reviews, 16 CFR Part 465, so review
                  gating never happens on your account.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
