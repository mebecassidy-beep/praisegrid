"use client";

import { useState } from "react";
import { Check, Loader2, Mail, MessageSquareText, Send, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Location } from "@/types";

type Method = "sms" | "email";

export function ReviewBlastCard({ locations }: { locations: Location[] }) {
  const connectedLocations = locations.filter((l) => l.google_place_id);
  const [locationId, setLocationId] = useState(connectedLocations[0]?.id ?? "");
  const [method, setMethod] = useState<Method>("email");
  const [customerName, setCustomerName] = useState("");
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessName = connectedLocations.find((l) => l.id === locationId)?.name;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    setSent(false);
    try {
      const res = await fetch("/api/reviews/blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, to, customerName, location_id: locationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't send that request.");
      setSent(true);
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
          One-click review blast
        </CardTitle>
        <CardDescription>Text or email a recent customer a direct link to leave you a review.</CardDescription>
      </CardHeader>
      <CardContent>
        {connectedLocations.length === 0 ? (
          <p className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Connect a Google Business Profile with a real listing to unlock direct review links for your
            customers.
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

            {connectedLocations.length > 1 && (
              <div className="space-y-1.5">
                <Label htmlFor="blast-location">Location</Label>
                <select
                  id="blast-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                >
                  {connectedLocations.map((l) => (
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
              {sent ? `Sent to ${businessName ? "customer" : ""}` : "Send review request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
