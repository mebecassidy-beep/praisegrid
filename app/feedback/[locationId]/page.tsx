import type { Metadata } from "next";
import { FeedbackCapture } from "@/components/feedback/feedback-capture";
import { getPublicLocation } from "@/lib/feedback/get-public-location";
import { buildGoogleReviewLink, buildYelpReviewLink } from "@/lib/reviews/public-review-links";

export const metadata: Metadata = {
  title: "Share your feedback | Reputicious",
};

export default async function FeedbackPage({ params }: { params: { locationId: string } }) {
  const location = await getPublicLocation(params.locationId);

  if (!location) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">This feedback link isn&apos;t valid.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
      <FeedbackCapture
        locationId={location.id}
        businessName={location.name}
        googleReviewLink={location.google_place_id ? buildGoogleReviewLink(location.google_place_id) : null}
        yelpReviewLink={location.yelp_business_id ? buildYelpReviewLink(location.yelp_business_id) : null}
      />
    </main>
  );
}
