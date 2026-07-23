"use client";

import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RevenueEstimateCard({ initialValue }: { initialValue: number }) {
  const [value, setValue] = useState(String(initialValue));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/settings/revenue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimated_customer_value: Number(value) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't save this.");
      setSaved(true);
    } catch (err: any) {
      setError(err.message || "Couldn't save this.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Reputation Revenue Forensics
        </CardTitle>
        <CardDescription>
          What&apos;s an average customer worth to your business? We multiply this by the negative
          reviews you resolve to estimate revenue rescued, so this number should be yours, not a
          guess we make for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="estimated-customer-value">Estimated value per customer (USD)</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="estimated-customer-value"
              type="number"
              min={0}
              step="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {saved && !saving && (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>

        <p className="text-xs text-muted-foreground">
          A common starting point is your average ticket size times how many times a typical
          customer returns in a year, but you know your numbers better than we do.
        </p>
      </CardContent>
    </Card>
  );
}
