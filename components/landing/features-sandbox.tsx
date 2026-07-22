"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE_COMPLAINT =
  "This was the worst experience I've ever had. Waited 45 minutes, staff was rude, and my order was wrong. Never coming back and I'm telling everyone I know.";

type Status = "idle" | "loading" | "done" | "error";

export function FeaturesSandbox() {
  const [businessName, setBusinessName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || !complaint.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/public/instant-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim() || "Your Business",
          complaint: complaint.trim(),
        }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const data = await res.json();
      setResponse(data.response || "");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-b border-white/10 bg-slate-950 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Try it yourself — live Claude AI
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Paste a brutal review. Watch it get defused.
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Drop in any real customer complaint and see the elite, on-brand response Reputicious would
            draft for you — instantly.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Your business name (optional)
              </label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Brightleaf Cafe"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Paste a real customer complaint
              </label>
              <Textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder={EXAMPLE_COMPLAINT}
                rows={4}
                maxLength={500}
                className="resize-none border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setComplaint(EXAMPLE_COMPLAINT)}
                className="mt-1.5 text-xs text-blue-400 hover:underline"
              >
                Use an example complaint
              </button>
            </div>

            <Button
              type="submit"
              disabled={status === "loading" || !complaint.trim()}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate elite response
            </Button>

            {status === "error" && (
              <p className="text-center text-xs text-red-400">
                Something went wrong — please try again in a moment.
              </p>
            )}
          </form>

          <AnimatePresence>
            {status === "done" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 overflow-hidden border-t border-white/10 pt-6"
              >
                <div className="space-y-4">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-400">The complaint</span>
                      <div className="flex gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-red-400 text-red-400" />
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-slate-700" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">{complaint}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">
                        Reputicious&apos;s response
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{response}</p>
                  </div>

                  <Button asChild className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200">
                    <Link href="/signup">
                      Automate this for my business
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
