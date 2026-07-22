import { Suspense } from "react";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { HealthMeterCard } from "@/components/dashboard/health-meter-card";
import { GeoReadinessCard } from "@/components/dashboard/geo-readiness-card";
import { ReviewStream } from "@/components/dashboard/review-stream";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { SmartRoutingCard } from "@/components/dashboard/smart-routing-card";
import { WidgetPreviewCard } from "@/components/dashboard/widget-preview-card";
import { OfferBanner } from "@/components/dashboard/offer-banner";
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner";
import { RevenueProtectionBanner } from "@/components/dashboard/revenue-protection-banner";
import { ReviewBlastCard } from "@/components/dashboard/review-blast-card";
import { CompetitorBenchmarkCard } from "@/components/dashboard/competitor-benchmark-card";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getProfile } from "@/lib/dashboard/queries";
import { getCompetitorSnapshot } from "@/lib/competitor/get-competitor-snapshot";

export default async function DashboardPage() {
  const user = await requireUser();
  const [data, profile] = await Promise.all([getDashboardData(user.id), getProfile(user.id)]);
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);
  const hasLocation = data.locations.length > 0;

  const competitor = profile.competitor_name
    ? await getCompetitorSnapshot(profile.competitor_name)
    : null;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <OfferBanner />
      </Suspense>

      <RevenueProtectionBanner reviews={data.reviews} />

      {!profile.onboarding_completed_at && !hasLocation && (
        <OnboardingBanner googlePlacesEnabled={googlePlacesEnabled} />
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your locations today.
        </p>
      </div>

      <StatTiles
        totalReviews={data.totalReviews}
        avgRating={data.avgRating}
        responseRate={data.responseRate}
        pendingCount={data.pendingCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <HealthMeterCard
          healthScore={data.healthScore}
          pendingCount={data.pendingCount}
          googlePlacesEnabled={googlePlacesEnabled}
        />
        <GeoReadinessCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReviewStream reviews={data.reviews} hasLocation={hasLocation} googlePlacesEnabled={googlePlacesEnabled} limit={4} />
        </div>
        <div>
          <SentimentBreakdown ratingDistribution={data.ratingDistribution} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReviewBlastCard locations={data.locations} />
        <CompetitorBenchmarkCard
          yourName={profile.company_name || "Your business"}
          yourRating={data.avgRating}
          yourReviewCount={data.totalReviews}
          competitor={competitor}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SmartRoutingCard />
        <WidgetPreviewCard />
      </div>
    </div>
  );
}
