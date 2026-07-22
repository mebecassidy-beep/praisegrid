import { ReviewExplorer } from "@/components/reviews/review-explorer";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function ReviewsPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage and respond to every review across your connected platforms.
        </p>
      </div>

      <ReviewExplorer
        reviews={data.reviews}
        hasLocation={data.locations.length > 0}
        googlePlacesEnabled={googlePlacesEnabled}
      />
    </div>
  );
}
