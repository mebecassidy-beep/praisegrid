import { PlayCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Homepage video slot, sitting between Hero and StandoutFeatures. Renders an
 * intentional-looking placeholder (same "clearly marked, not broken" spirit
 * as components/features/screenshot-placeholder.tsx) until a real videoSrc
 * is supplied.
 *
 * To drop in the real MP4 later: add the file under public/videos/ (e.g.
 * public/videos/product-demo.mp4) and pass its path as `videoSrc` from
 * app/page.tsx - no other changes needed, the <video> element below is
 * already wired for autoplay/loop/inline playback.
 */
export function ConversionVideoPlaceholder({
  videoSrc,
  posterSrc,
  caption = "See how Praisegrid turns a negative review into growth in under 3 seconds.",
  className,
}: {
  videoSrc?: string;
  posterSrc?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-slate-950 py-16 sm:py-20", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(59,130,246,0.3), transparent 45%), radial-gradient(circle at 75% 70%, rgba(139,92,246,0.25), transparent 45%)",
        }}
      />

      <div className="container relative">
        <Reveal className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-2 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
              {videoSrc ? (
                <video
                  className="h-full w-full object-cover"
                  src={videoSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-white/10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                    <PlayCircle className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
                    [Insert product demo video here]
                  </p>
                  <p className="max-w-xs text-xs leading-relaxed text-slate-600">
                    16:9 MP4, autoplay/muted/loop/inline once dropped in via the videoSrc prop.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-medium text-slate-400">{caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
