import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { HealthMeterCard } from "@/components/dashboard/health-meter-card";
import { GeoReadinessCard } from "@/components/dashboard/geo-readiness-card";
import { ReviewStream } from "@/components/dashboard/review-stream";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { FeedbackShieldCard } from "@/components/dashboard/feedback-shield-card";
import { WidgetPreviewCard } from "@/components/dashboard/widget-preview-card";
import { OfferBanner } from "@/components/dashboard/offer-banner";
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner";
import { RevenueProtectionBanner } from "@/components/dashboard/revenue-protection-banner";
import { ReviewBlastCard } from "@/components/dashboard/review-blast-card";
import { CompetitorBenchmarkCard } from "@/components/dashboard/competitor-benchmark-card";
import { requireUser } from "@/lib/supabase/server";
import {
  getDashboardData,
  getProfile,
  computeHealthScore,
  computeRatingDistribution,
  type LocationMetric,
} from "@/lib/dashboard/queries";
import { getCompetitorSnapshot } from "@/lib/competitor/get-competitor-snapshot";
import { getFeedbackResponses, getFeedbackResponseCount } from "@/lib/feedback/queries";
import { getPendingScheduledBlasts } from "@/lib/scheduled-blasts/queries";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { location?: string };
}) {
  const user = await requireUser();
  const [data, profile, feedbackResponses, feedbackResponseCount, pendingBlasts] = await Promise.all([
    getDashboardData(user.id),
    getProfile(user.id),
    getFeedbackResponses(user.id),
    getFeedbackResponseCount(user.id),
    getPendingScheduledBlasts(user.id),
  ]);
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);
  const hasLocation = data.locations.length > 0;

  const competitor = profile.competitor_name
    ? await getCompetitorSnapshot(profile.competitor_name)
    : null;

  const selectedLocation = searchParams.location
    ? data.locations.find((l) => l.id === searchParams.location) ?? null
    : null;

  const scopedReviews = selectedLocation
    ? data.reviews.filter((r) => r.location_id === selectedLocation.id)
    : data.reviews;

  const scopedMetric: LocationMetric = selectedLocation
    ? data.locationMetrics[selectedLocation.id]
    : { avgRating: data.avgRating, reviewCount: data.totalReviews, responseRate: data.responseRate, pendingCount: data.pendingCount };

  const scopedHealthScore = selectedLocation ? computeHealthScore(scopedMetric) : data.healthScore;
  const scopedRatingDistribution = selectedLocation
    ? computeRatingDistribution(scopedReviews)
    : data.ratingDistribution;

  const gbpChecks = [
    data.locations.length > 0,
    data.locations.length > 0 && data.locations.every((l) => !!l.address),
    data.locations.length > 0 && data.locations.every((l) => !!l.google_place_id),
    !!profile.website,
    !!profile.phone_number,
  ];
  const gbpCompleteness = Math.round((gbpChecks.filter(Boolean).length / gbpChecks.length) * 100);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <OfferBanner />
      </Suspense>

      <RevenueProtectionBanner reviews={scopedReviews} />

      {!profile.onboarding_completed_at && !hasLocation && (
        <OnboardingBanner googlePlacesEnabled={googlePlacesEnabled} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {selectedLocation
              ? `Showing ${selectedLocation.name} only.`
              : "Here's what's happening across your locations today."}
          </p>
        </div>
        {selectedLocation && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear location filter
          </Link>
        )}
      </div>

      <StatTiles
        totalReviews={scopedMetric.reviewCount}
        avgRating={scopedMetric.avgRating}
        responseRate={scopedMetric.responseRate}
        pendingCount={scopedMetric.pendingCount}
      />

      <RevealGroup className="space-y-6" stagger={0.1}>
        <RevealItem className="grid gap-6 lg:grid-cols-2">
          <HealthMeterCard
            healthScore={scopedHealthScore}
            pendingCount={scopedMetric.pendingCount}
            googlePlacesEnabled={googlePlacesEnabled}
          />
          <GeoReadinessCard gbpCompleteness={gbpCompleteness} responseRate={scopedMetric.responseRate} />
        </RevealItem>

        <RevealItem className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReviewStream reviews={scopedReviews} hasLocation={hasLocation} googlePlacesEnabled={googlePlacesEnabled} limit={4} />
          </div>
          <div>
            <SentimentBreakdown ratingDistribution={scopedRatingDistribution} />
          </div>
        </RevealItem>

        <RevealItem className="grid gap-6 lg:grid-cols-2">
          <ReviewBlastCard locations={data.locations} pendingBlasts={pendingBlasts} />
          <CompetitorBenchmarkCard
            yourName={profile.company_name || "Your business"}
            yourRating={scopedMetric.avgRating}
            yourReviewCount={scopedMetric.reviewCount}
            competitor={competitor}
          />
        </RevealItem>

        <RevealItem className="grid gap-6 lg:grid-cols-2">
          <FeedbackShieldCard recentResponses={feedbackResponses} totalResponseCount={feedbackResponseCount} />
          <WidgetPreviewCard reviews={scopedReviews} avgRating={scopedMetric.avgRating} totalReviews={scopedMetric.reviewCount} />
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
