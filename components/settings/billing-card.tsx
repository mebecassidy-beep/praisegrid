"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionTier } from "@/types";

const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export function BillingCard({ tier }: { tier: SubscriptionTier }) {
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openBillingPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Couldn't open billing portal.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Couldn't open billing portal.");
      setPortalLoading(false);
    }
  }

  async function startTrial(targetTier: "starter" | "pro") {
    setCheckoutLoading(targetTier);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: targetTier, trial: true }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Couldn't start checkout.");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Couldn't start checkout.");
      setCheckoutLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-blue-500" />
          Billing
        </CardTitle>
        <CardDescription>Manage your subscription, payment method, and invoices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3.5">
          <div>
            <p className="text-sm font-medium">Current plan</p>
            <Badge
              variant="outline"
              className={
                tier === "free"
                  ? "mt-1 border-transparent bg-muted text-muted-foreground"
                  : "mt-1 border-transparent bg-emerald-500/10 text-emerald-600"
              }
            >
              {TIER_LABEL[tier]}
            </Badge>
          </div>

          {tier === "free" ? null : (
            <Button size="sm" variant="outline" onClick={openBillingPortal} disabled={portalLoading} className="gap-1.5">
              {portalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
              Manage subscription
            </Button>
          )}
        </div>

        {tier === "free" && (
          <div className="rounded-lg border bg-muted/30 p-3.5">
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock more locations, unlimited AI responses, and auto-approve rules, start with a
              7-day free trial.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => startTrial("starter")} disabled={checkoutLoading !== null} className="gap-1.5">
                {checkoutLoading === "starter" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Try Starter
              </Button>
              <Button
                size="sm"
                onClick={() => startTrial("pro")}
                disabled={checkoutLoading !== null}
                className="gap-1.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
              >
                {checkoutLoading === "pro" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Try Pro
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {tier !== "free" && (
          <p className="text-xs text-muted-foreground">
            Update your card, download invoices, or cancel anytime, all handled securely by Stripe.
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
