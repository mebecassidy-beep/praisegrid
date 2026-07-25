import { BusinessProfileCard } from "@/components/settings/business-profile-card";
import { BillingCard } from "@/components/settings/billing-card";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { ConnectedPlatformsCard } from "@/components/settings/connected-platforms-card";
import { CompetitorTrackerCard } from "@/components/settings/competitor-tracker-card";
import { RevenueEstimateCard } from "@/components/settings/revenue-estimate-card";
import { CrisisNotificationsCard } from "@/components/settings/crisis-notifications-card";
import { TeamCard } from "@/components/settings/team-card";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";
import { getConnectedLocationIds } from "@/lib/oauth/queries";
import { getTeamMembers } from "@/lib/team/queries";
import { hasProAccess } from "@/lib/subscription";

export default async function SettingsPage() {
  const { accountId } = await requireAccount();
  const [profile, data] = await Promise.all([getProfile(accountId), getDashboardData(accountId)]);
  const [connectedFacebookLocationIds, teamMembers] = await Promise.all([
    getConnectedLocationIds(data.locations.map((l) => l.id), "facebook"),
    getTeamMembers(accountId),
  ]);

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
      <BillingCard tier={profile.subscription_tier} />
      <ConnectedPlatformsCard locations={data.locations} facebookConnected={connectedFacebookLocationIds.size > 0} />
      <TeamCard isPro={hasProAccess(profile.subscription_tier)} initialMembers={teamMembers} />
      <NotificationPreferencesCard initialReportFrequency={profile.report_frequency} />
      <CompetitorTrackerCard initialCompetitorName={profile.competitor_name} />
      <RevenueEstimateCard initialValue={profile.estimated_customer_value} />
      <CrisisNotificationsCard initialWebhookUrl={profile.crisis_slack_webhook_url} />
    </div>
  );
}
