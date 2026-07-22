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
            Every flagged review gets a Claude-drafted, on-brand response ready to approve in one click.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <DashboardMockupCard />
        </Reveal>
      </div>
    </section>
  );
}
