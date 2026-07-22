import { Reveal } from "@/components/motion/reveal";
import { CostCalculator } from "@/components/landing/cost-calculator";

export function RoiCalculatorSection() {
  return (
    <section id="roi-calculator" className="border-t border-white/10 bg-slate-950 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How much is silence costing you every month?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Drag the slider to your monthly customer volume and see your estimated lost revenue —
            instantly, before you enter a single detail.
          </p>
        </Reveal>

        <CostCalculator />
      </div>
    </section>
  );
}
