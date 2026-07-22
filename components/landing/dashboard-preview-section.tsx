import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { DashboardMockupCard } from "@/components/landing/dashboard-mockup-card";

export function DashboardPreviewSection() {
  return (
    <section className="border-t border-white/10 bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See it inside your dashboard
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Every flagged review gets a Claude-drafted, on-brand response ready to approve in one click —
            watch the live demo below play out on its own.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <DashboardMockupCard />
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-col items-center gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            Put this on autopilot for your business
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <p className="text-xs font-semibold text-slate-500">
            No credit card required • Cancel anytime with 1-click
          </p>
        </Reveal>
      </div>
    </section>
  );
}
