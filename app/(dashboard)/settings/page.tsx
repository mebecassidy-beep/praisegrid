import { BusinessProfileCard } from "@/components/settings/business-profile-card";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { ConnectedPlatformsCard } from "@/components/settings/connected-platforms-card";
import { CompetitorTrackerCard } from "@/components/settings/competitor-tracker-card";
import { RevenueEstimateCard } from "@/components/settings/revenue-estimate-card";
import { CrisisNotificationsCard } from "@/components/settings/crisis-notifications-card";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";

export default async function SettingsPage() {
  const user = await requireUser();
  const [profile, data] = await Promise.all([getProfile(user.id), getDashboardData(user.id)]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your business profile, notifications, and connected review platforms.
        </p>
      </div>

      <BusinessProfileCard
        initialCompanyName={profile.company_name}
        initialPhoneNumber={profile.phone_number}
        initialWebsite={profile.website}
      />
      <ConnectedPlatformsCard locations={data.locations} />
      <NotificationPreferencesCard initialReportFrequency={profile.report_frequency} />
      <CompetitorTrackerCard initialCompetitorName={profile.competitor_name} />
      <RevenueEstimateCard initialValue={profile.estimated_customer_value} />
      <CrisisNotificationsCard initialWebhookUrl={profile.crisis_slack_webhook_url} />
    </div>
  );
}
