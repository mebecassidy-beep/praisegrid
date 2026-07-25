import {
  PlatformVolumeChart,
  RatingTrendChart,
  ResponseTimeChart,
} from "@/components/dashboard/analytics-charts";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { CompetitorLeakFinderCard } from "@/components/dashboard/competitor-leak-finder-card";
import { RevenueForensicsCard } from "@/components/dashboard/revenue-forensics-card";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";
import { computeRevenueForensics, computeResponseTimeTrend } from "@/lib/analytics/revenue-forensics";

const VALID_MONTH_RANGES = [3, 6, 12];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { months?: string };
}) {
  const { accountId } = await requireAccount();
  const requestedMonths = Number(searchParams.months);
  const months = VALID_MONTH_RANGES.includes(requestedMonths) ? requestedMonths : 6;

  const [data, profile] = await Promise.all([getDashboardData(accountId, undefined, months), getProfile(accountId)]);
  const hasLocation = data.locations.length > 0;
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);
  const forensics = computeRevenueForensics(data.reviews, profile.estimated_customer_value);
  const monthlyResponseTimeTrend = computeResponseTimeTrend(data.reviews, months);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Trends across ratings, response speed, and platform mix over the last {months} months.
          </p>
        </div>
        <DateRangePicker months={months} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RatingTrendChart
          monthlyRatingTrend={data.monthlyRatingTrend}
          hasLocation={hasLocation}
          googlePlacesEnabled={googlePlacesEnabled}
        />
        <ResponseTimeChart monthlyResponseTimeTrend={monthlyResponseTimeTrend} />
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

      <RevenueForensicsCard forensics={forensics} />

      <CompetitorLeakFinderCard hasCompetitor={Boolean(profile.competitor_name)} />
    </div>
  );
}
