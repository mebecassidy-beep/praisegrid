import { Reveal } from "@/components/motion/reveal";

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-medium leading-relaxed text-slate-300 sm:text-3xl">
            We believe responding to a customer should take{" "}
            <span className="font-semibold text-white">seconds, not a spare afternoon.</span>{" "}
            We believe an AI-drafted reply can still sound like{" "}
            <span className="font-semibold text-white">you</span>, if it&apos;s actually trained
            on your voice, not a generic template. And we believe local businesses deserve
            the same review-response speed and polish that big brands pay agencies for.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
