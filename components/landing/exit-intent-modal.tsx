"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DISMISS_KEY = "praisegrid_exit_intent_shown";
const SCROLL_DEPTH_TRIGGER = 0.65;

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [source, setSource] = useState<"exit-intent" | "scroll-depth">("exit-intent");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    function trigger(triggerSource: "exit-intent" | "scroll-depth") {
      setSource(triggerSource);
      setOpen(true);
      sessionStorage.setItem(DISMISS_KEY, "1");
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    }

    // Desktop signal — mouse leaving toward the browser chrome.
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) trigger("exit-intent");
    }

    // Mobile/touch signal — mouseleave never fires on touch devices, so deep
    // scroll (someone who's read most of the page but hasn't converted) is
    // the equivalent "about to leave without converting" moment there.
    function handleScroll() {
      const scrolled = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && scrolled / scrollable >= SCROLL_DEPTH_TRIGGER) {
        trigger("scroll-depth");
      }
    }

    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName, source, template: "ftc_shield" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[90] m-auto h-fit max-h-[85vh] w-full max-w-[min(420px,90vw)] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-6"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "done" ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <Mail className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Check your inbox</h3>
                <p className="mt-1 text-sm text-slate-400">Your Compliance &amp; FTC Shield Audit is on its way.</p>
              </div>
            ) : (
              <>
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </span>
                <h3 className="text-lg font-semibold text-white">Is your review strategy FTC-compliant?</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Get a free Local Review Compliance &amp; FTC Shield Audit. The FTC&apos;s 2024 rule bans a review
                  tactic a lot of local businesses use without realizing it, we&apos;ll check yours and send real
                  numbers on your current Google standing too.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business name (optional)"
                    className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@business.com"
                      className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                    />
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="shrink-0 gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
                    >
                      {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                      Send my Compliance Audit
                    </Button>
                  </div>
                </form>

                {status === "error" && (
                  <p className="mt-2 text-xs text-red-400">Something went wrong, please try again.</p>
                )}

                <p className="mt-3 text-center text-xs text-slate-500">
                  No account required • No credit card required • Takes 30 seconds
                </p>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
