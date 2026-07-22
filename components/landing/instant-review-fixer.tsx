"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTypewriterPlaceholder } from "@/components/landing/typewriter-placeholder";
import { cn } from "@/lib/utils";

const LOADING_STEPS = ["Fetching Business Profile…", "Analyzing Sentiment…", "Waking Claude AI…"];
const NAME_EXAMPLES = ["Sac Valley Plumbing", "The Copper Fork", "Willow & Co. Salon", "Brightleaf Cafe"];

const COMPLAINT_TEMPLATES = [
  "Absolutely furious. Waited over an hour past my appointment time at {business} and nobody even acknowledged it. Won't be back.",
  "Terrible experience at {business}. Paid full price for something that felt rushed and careless. Very disappointed.",
  "I've never been treated this poorly. {business} completely dropped the ball on my order and no one apologized.",
  "Do NOT waste your money here. {business} was rude, disorganized, and clearly doesn't care about customers.",
  "Extremely frustrated with {business}. Was promised one thing and got another. This is unacceptable.",
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function templateFor(name: string) {
  const trimmed = name.trim() || "your business";
  const seed = hashString(trimmed);
  return COMPLAINT_TEMPLATES[seed % COMPLAINT_TEMPLATES.length].replace("{business}", trimmed);
}

type Status = "idle" | "loading" | "done" | "error";

export function InstantReviewFixer() {
  const [name, setName] = useState("");
  const [complaint, setComplaint] = useState(() => templateFor(""));
  const [complaintTouched, setComplaintTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fixedResponse, setFixedResponse] = useState("");
  const [step, setStep] = useState(0);
  const namePlaceholder = useTypewriterPlaceholder(NAME_EXAMPLES);

  function handleNameChange(value: string) {
    setName(value);
    if (!complaintTouched) {
      setComplaint(templateFor(value));
    }
  }

  async function handleFix(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 550);

    try {
      const [res] = await Promise.all([
        fetch("/api/public/instant-fix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: name.trim() || "Your Business",
            complaint,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, LOADING_STEPS.length * 550)),
      ]);

      if (!res.ok) {
        setStatus("error");
        return;
      }

      const data = await res.json();
      setFixedResponse(data.response || "");
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      clearInterval(stepInterval);
    }
  }

  const displayName = name.trim() || "Your Business";

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-slate-300">Instant Review Fixer</span>
          </div>
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
            Live Claude AI
          </span>
        </div>

        <form onSubmit={handleFix} className="space-y-3 p-5">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-400">
              Your business name
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={namePlaceholder}
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-400">
              An angry 1-star review
            </label>
            <Textarea
              value={complaint}
              onChange={(e) => {
                setComplaintTouched(true);
                setComplaint(e.target.value);
              }}
              rows={3}
              className="resize-none border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500"
            />
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
            Fix This Review
          </Button>

          <AnimatePresence>
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pt-1 text-center">
                  {LOADING_STEPS.map((label, i) => (
                    <p
                      key={label}
                      className={cn(
                        "text-xs transition-colors",
                        i === step ? "font-medium text-white" : i < step ? "text-slate-600 line-through" : "text-slate-600"
                      )}
                    >
                      {label}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              className="overflow-hidden border-t border-white/10"
            >
              <div className="space-y-3 p-5">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-red-400">Before</span>
                    <div className="flex gap-0.5">
                      <Star className="h-3 w-3 fill-red-400 text-red-400" />
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-slate-700" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">{complaint}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-400">
                      After — {displayName}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{fixedResponse}</p>
                </div>

                <Button
                  asChild
                  className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-200"
                >
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
  );
}
