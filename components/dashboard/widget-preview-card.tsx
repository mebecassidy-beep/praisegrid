"use client";

import { useState } from "react";
import { Check, Copy, GalleryHorizontal, LayoutGrid, Square, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WidgetStyle = "badge" | "carousel" | "grid";

const STYLES: { value: WidgetStyle; label: string; icon: typeof Square }[] = [
  { value: "badge", label: "Badge", icon: Square },
  { value: "carousel", label: "Carousel", icon: GalleryHorizontal },
  { value: "grid", label: "Grid", icon: LayoutGrid },
];

const SNIPPETS = [
  { name: "Sarah M.", rating: 5, quote: "Amazing service! The team went above and beyond." },
  { name: "Emily C.", rating: 5, quote: "This is why I keep coming back, every single time." },
  { name: "Priya N.", rating: 4, quote: "Really solid experience, staff was friendly." },
];

const EMBED_CODE = `<script
  src="https://widget.reputicious.io/embed.js"
  data-business="brightleaf-cafe"
  data-style="badge"
  async
></script>`;

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
      ))}
    </div>
  );
}

function SnippetCard({ snippet }: { snippet: (typeof SNIPPETS)[number] }) {
  return (
    <div className="w-48 shrink-0 rounded-lg border bg-white p-3 shadow-sm dark:bg-slate-900">
      <Stars rating={snippet.rating} />
      <p className="mt-1.5 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">&ldquo;{snippet.quote}&rdquo;</p>
      <p className="mt-1.5 text-[11px] font-medium text-slate-400">{snippet.name}</p>
    </div>
  );
}

export function WidgetPreviewCard() {
  const [style, setStyle] = useState<WidgetStyle>("badge");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMBED_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website widget</CardTitle>
        <CardDescription>Show off your reviews anywhere on your site with one embed snippet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                style === s.value
                  ? "border-blue-500 bg-blue-500/10 text-blue-600"
                  : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center gap-1.5 border-b bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 rounded-full bg-white px-3 py-0.5 text-[11px] text-slate-500 dark:bg-slate-900">
              yourbusiness.com
            </span>
          </div>

          <div className="flex min-h-[168px] items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
            {style === "badge" && (
              <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-md dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold">4.8</span>
                    <Stars rating={5} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">1,284 reviews · Powered by Reputicious</p>
                </div>
              </div>
            )}

            {style === "carousel" && (
              <div className="flex w-full gap-3 overflow-x-auto px-1">
                {SNIPPETS.map((s) => (
                  <SnippetCard key={s.name} snippet={s} />
                ))}
              </div>
            )}

            {style === "grid" && (
              <div className="grid w-full grid-cols-2 gap-3">
                {SNIPPETS.slice(0, 2).map((s) => (
                  <SnippetCard key={s.name} snippet={s} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-300">
            <code>{EMBED_CODE}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white hover:bg-white/20"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
