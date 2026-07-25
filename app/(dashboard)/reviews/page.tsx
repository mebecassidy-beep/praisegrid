import Link from "next/link";
import { X } from "lucide-react";
import { ReviewExplorer } from "@/components/reviews/review-explorer";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { location?: string; q?: string };
}) {
  const { accountId } = await requireAccount();
  const data = await getDashboardData(accountId);
  const googlePlacesEnabled = Boolean(process.env.GOOGLE_PLACES_API_KEY);

  const selectedLocation = searchParams.location
    ? data.locations.find((l) => l.id === searchParams.location) ?? null
    : null;
  const scopedReviews = selectedLocation
    ? data.reviews.filter((r) => r.location_id === selectedLocation.id)
    : data.reviews;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            {selectedLocation
              ? `Showing reviews for ${selectedLocation.name} only.`
              : "Manage and respond to every review across your connected platforms."}
          </p>
        </div>
        {selectedLocation && (
          <Link
            href={searchParams.q ? `/reviews?q=${encodeURIComponent(searchParams.q)}` : "/reviews"}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear location filter
          </Link>
        )}
      </div>

      <ReviewExplorer
        reviews={scopedReviews}
        hasLocation={data.locations.length > 0}
        googlePlacesEnabled={googlePlacesEnabled}
        initialQuery={searchParams.q}
      />
    </div>
  );
}
