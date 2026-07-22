import { AiSettingsPanel } from "@/components/settings/ai-settings-panel";

export default function AiSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure how Claude drafts and auto-approves responses for each location.
        </p>
      </div>

      <AiSettingsPanel />
    </div>
  );
}
