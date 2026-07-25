import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAccount } from "@/lib/team/account";
import { PrintButton } from "@/components/dashboard/print-button";

const TARGET_LABEL: Record<string, string> = {
  feedback: "Tell us how we did",
  google: "Leave us a Google review",
  yelp: "Leave us a Yelp review",
};

export default async function TableTentPage({
  searchParams,
}: {
  searchParams: { location_id?: string; target?: string };
}) {
  const { accountId } = await requireAccount();
  const locationId = searchParams.location_id ?? "";
  const target = searchParams.target && searchParams.target in TARGET_LABEL ? searchParams.target : "feedback";

  const supabase = createClient();
  const { data: location } = await (supabase.from("locations") as any)
    .select("id, name")
    .eq("id", locationId)
    .eq("user_id", accountId)
    .single();

  if (!location) {
    redirect("/assets");
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-muted/20 p-8 print:bg-white print:p-0">
      <div className="print:hidden">
        <PrintButton />
      </div>

      <div className="flex aspect-[3/4] w-full max-w-sm flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-lg print:aspect-auto print:h-[9in] print:w-[6in] print:rounded-none print:border-none print:shadow-none">
        <p className="text-lg font-bold tracking-tight text-slate-900">{location.name}</p>
        <p className="text-2xl font-bold text-slate-900">{TARGET_LABEL[target]}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/assets/qr?location_id=${location.id}&target=${target}`}
          alt="QR code"
          className="h-56 w-56"
        />
        <p className="text-sm text-slate-500">Scan with your phone&apos;s camera</p>
      </div>
    </main>
  );
}
