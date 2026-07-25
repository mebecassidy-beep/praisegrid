import { SocialPostGenerator } from "@/components/marketing/social-post-generator";
import { requireAccount } from "@/lib/team/account";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function MarketingPage() {
  const { accountId } = await requireAccount();
  const data = await getDashboardData(accountId);

  const eligible = data.reviews.filter((r) => r.rating === 5 && r.status === "posted");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Social Auto-Pilot</h1>
        <p className="text-sm text-muted-foreground">
          Turn your verified 5-star reviews into ready-to-post Instagram &amp; Facebook graphics and captions.
        </p>
      </div>

      {eligible.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/20 py-16 text-center text-sm text-muted-foreground">
          No eligible reviews yet, 5-star reviews with an approved response will show up here.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eligible.map((review) => (
            <SocialPostGenerator key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
