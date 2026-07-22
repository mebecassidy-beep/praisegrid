import { BusinessProfileCard } from "@/components/settings/business-profile-card";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { ConnectedPlatformsCard } from "@/components/settings/connected-platforms-card";
import { requireUser } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dashboard/queries";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your business profile, notifications, and connected review platforms.
        </p>
      </div>

      <BusinessProfileCard />
      <ConnectedPlatformsCard />
      <NotificationPreferencesCard initialReportFrequency={profile.report_frequency} />
    </div>
  );
}
