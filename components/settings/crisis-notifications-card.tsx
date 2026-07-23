"use client";

import { useState } from "react";
import { Check, Siren } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CrisisNotificationsCard({ initialWebhookUrl }: { initialWebhookUrl: string | null }) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/settings/crisis-notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crisis_slack_webhook_url: webhookUrl }),
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
          <Siren className="h-4 w-4 text-red-500" />
          Crisis notifications
        </CardTitle>
        <CardDescription>
          Add a Slack incoming webhook to notify your team the moment you click &ldquo;Notify Crisis
          Manager&rdquo; on a high-risk review. Separate from your automatic SMS crisis alert.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-md space-y-1.5">
          <Label htmlFor="crisis-webhook">Slack webhook URL</Label>
          <Input
            id="crisis-webhook"
            type="url"
            placeholder="https://hooks.slack.com/services/…"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
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
          Create one from Slack under Settings &amp; administration → Manage apps → Incoming Webhooks.
        </p>
      </CardContent>
    </Card>
  );
}
