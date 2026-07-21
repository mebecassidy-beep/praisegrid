import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ReviewExplorer } from "@/components/reviews/review-explorer";

export default function ReviewsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Manage and respond to every review across your connected platforms.
          </p>
        </div>

        <ReviewExplorer />
      </div>
    </DashboardShell>
  );
}
