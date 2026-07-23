"use client";

import { useState } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Low-friction secondary CTA inside the live-scan "done" state — a bridge
 * for visitors who found their score but aren't ready to click the primary
 * "Start Free Trial" button yet. Single field (email only; we already have
 * their business data from the scan), inline success state, no modal.
 */
export function ScanEmailCapture({ businessName, placeId }: { businessName: string; placeId: string | null }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName, placeId, source: "homepage-scan", template: "standard" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
        <Check className="h-4 w-4 shrink-0" />
        Sent to {email}, check your inbox.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
        <Mail className="h-3.5 w-3.5 text-blue-400" />
        Not ready to start your trial yet?
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Get your full breakdown, emailed instantly, every factor above, plus the ones we don&apos;t show here.
      </p>
      <form onSubmit={handleSubmit} className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          className="border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 gap-1.5 bg-white text-sm text-slate-900 hover:bg-slate-200"
        >
          {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Email me my breakdown
        </Button>
      </form>
      {status === "error" && <p className="mt-1.5 text-xs text-red-400">Something went wrong, please try again.</p>}
      <p className="mt-2 text-[11px] text-slate-500">Takes 10 seconds • We&apos;ll never share your email</p>
    </div>
  );
}
