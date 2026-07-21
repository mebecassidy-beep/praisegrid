import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  PlatformVolumeChart,
  RatingTrendChart,
  ResponseTimeChart,
} from "@/components/dashboard/analytics-charts";
import { SentimentBreakdown } from "@/components/dashboard/sentiment-breakdown";

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Trends across ratings, response speed, and platform mix over the last six months.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RatingTrendChart />
          <ResponseTimeChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PlatformVolumeChart />
          </div>
          <SentimentBreakdown />
        </div>
      </div>
    </DashboardShell>
  );
}
