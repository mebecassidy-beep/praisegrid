import { QrAssetHub } from "@/components/dashboard/qr-asset-hub";
import { requireUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";

export default async function AssetsPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">QR &amp; Table Tents</h1>
        <p className="text-sm text-muted-foreground">
          Print-ready QR codes for your counter, receipts, or table tents.
        </p>
      </div>

      <QrAssetHub locations={data.locations} />
    </div>
  );
}
