const STATS = [
  { value: "10k+", label: "Reviews Managed" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "500+", label: "Local Businesses" },
  { value: "98%", label: "Response Rate" },
];

const LOGOS = ["Bloomfield", "Cedar & Co.", "Harborview", "Northgate", "Willow Bay", "Pier 12"];

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

      <div className="border-t border-white/10 py-8">
        <div className="container">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
            Trusted by local businesses everywhere
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-lg font-semibold tracking-tight text-slate-500 opacity-70 grayscale transition hover:opacity-100"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
