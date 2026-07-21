import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { GeoReadinessCard } from "@/components/dashboard/geo-readiness-card";
import { ReviewStream } from "@/components/dashboard/review-stream";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";
import { SmartRoutingCard } from "@/components/dashboard/smart-routing-card";
import { WidgetPreviewCard } from "@/components/dashboard/widget-preview-card";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening across your locations today.
          </p>
        </div>

        <StatTiles />

        <GeoReadinessCard />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReviewStream limit={4} />
          </div>
          <div>
            <SentimentBreakdown />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SmartRoutingCard />
          <WidgetPreviewCard />
        </div>
      </div>
    </DashboardShell>
  );
}
