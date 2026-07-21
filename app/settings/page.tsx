import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BusinessProfileCard } from "@/components/settings/business-profile-card";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { ConnectedPlatformsCard } from "@/components/settings/connected-platforms-card";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your business profile, notifications, and connected review platforms.
          </p>
        </div>

        <BusinessProfileCard />
        <ConnectedPlatformsCard />
        <NotificationPreferencesCard />
      </div>
    </DashboardShell>
  );
}
