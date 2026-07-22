import {
  PlatformVolumeChart,
  RatingTrendChart,
  ResponseTimeChart,
} from "@/components/dashboard/analytics-charts";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { CompetitorLeakFinderCard } from "@/components/dashboard/competitor-leak-finder-card";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const [data, profile] = await Promise.all([getDashboardData(user.id), getProfile(user.id)]);
  const hasLocation = data.locations.length > 0;
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Trends across ratings, response speed, and platform mix over the last six months.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingTrendChart
          monthlyRatingTrend={data.monthlyRatingTrend}
          hasLocation={hasLocation}
          googlePlacesEnabled={googlePlacesEnabled}
        />
        <ResponseTimeChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlatformVolumeChart
            monthlyPlatformVolume={data.monthlyPlatformVolume}
            hasLocation={hasLocation}
            googlePlacesEnabled={googlePlacesEnabled}
          />
        </div>
        <SentimentBreakdown ratingDistribution={data.ratingDistribution} />
      </div>

      <CompetitorLeakFinderCard hasCompetitor={Boolean(profile.competitor_name)} />
    </div>
  );
}
