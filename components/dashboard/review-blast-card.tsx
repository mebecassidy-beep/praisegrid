"use client";

import { useState } from "react";
import { Check, Clock, Loader2, Mail, MessageSquareText, Send, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

type Method = "sms" | "email";
type Delay = "now" | "2h" | "next_morning";

const DELAY_OPTIONS: { value: Delay; label: string }[] = [
  { value: "now", label: "Send now" },
  { value: "2h", label: "In 2 hours" },
  { value: "next_morning", label: "Tomorrow, 9am" },
];

export function ReviewBlastCard({ locations }: { locations: Location[] }) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [method, setMethod] = useState<Method>("email");
  const [delay, setDelay] = useState<Delay>("now");
  const [customerName, setCustomerName] = useState("");
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    setSent(false);
    setScheduled(false);
    try {
      const res = await fetch("/api/reviews/blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, to, customerName, location_id: locationId, delay }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't send that request.");
      setSent(true);
      setScheduled(Boolean(data.scheduled));
      setCustomerName("");
      setTo("");
    } catch (err: any) {
      setError(err.message || "Couldn't send that request.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/[0.04] to-violet-500/[0.04]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          One-tap smart-timing blast
        </CardTitle>
        <CardDescription>
          Text or email a recent customer for feedback, timed for right after their visit. Everyone gets the
          same request and the same option to also post publicly, nobody&apos;s routed away from Google or Yelp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Add a location first to send feedback requests to your customers.
          </p>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  method === "email"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600"
                    : "border-input text-muted-foreground hover:bg-accent"
                )}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setMethod("sms")}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  method === "sms"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600"
                    : "border-input text-muted-foreground hover:bg-accent"
                )}
              >
                <MessageSquareText className="h-3.5 w-3.5" />
                Text
              </button>
            </div>

            {locations.length > 1 && (
              <div className="space-y-1.5">
                <Label htmlFor="blast-location">Location</Label>
                <select
                  id="blast-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="blast-name">Customer name</Label>
              <Input
                id="blast-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blast-to">{method === "email" ? "Email address" : "Phone number"}</Label>
              <Input
                id="blast-to"
                type={method === "email" ? "email" : "tel"}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder={method === "email" ? "customer@email.com" : "+1 555 123 4567"}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blast-delay" className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Smart timing
              </Label>
              <div className="flex gap-1.5">
                {DELAY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDelay(opt.value)}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                      delay === opt.value
                        ? "border-blue-500 bg-blue-500/10 text-blue-600"
                        : "border-input text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={sending || !locationId}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:opacity-90"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sent ? (
                <Check className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {sent ? (scheduled ? "Scheduled" : "Sent") : "Send feedback request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
