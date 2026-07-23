import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Real-screenshot slot for the marketing site: clearly marked so whoever
 * drops in the actual dashboard capture knows exactly what to shoot, but
 * still looks intentional (not a broken image) while it's empty. */
export function ScreenshotPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-gradient-to-br from-blue-500/30 to-violet-600/30 p-px", className)}>
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
          <ImageIcon className="h-5 w-5 text-slate-500" />
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
          [Insert dashboard screenshot here]
        </p>
        <p className="max-w-xs text-xs leading-relaxed text-slate-600">{label}</p>
      </div>
    </div>
  );
}
