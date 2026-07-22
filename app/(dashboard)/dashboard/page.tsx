import { Suspense } from "react";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { HealthMeterCard } from "@/components/dashboard/health-meter-card";
import { GeoReadinessCard } from "@/components/dashboard/geo-readiness-card";
import { ReviewStream } from "@/components/dashboard/review-stream";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { SmartRoutingCard } from "@/components/dashboard/smart-routing-card";
import { WidgetPreviewCard } from "@/components/dashboard/widget-preview-card";
import { OfferBanner } from "@/components/dashboard/offer-banner";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <OfferBanner />
      </Suspense>

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
        <HealthMeterCard healthScore={data.healthScore} pendingCount={data.pendingCount} />
        <GeoReadinessCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReviewStream limit={4} />
        </div>
        <div>
          <SentimentBreakdown ratingDistribution={data.ratingDistribution} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SmartRoutingCard />
        <WidgetPreviewCard />
      </div>
    </div>
  );
}
