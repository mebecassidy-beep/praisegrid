import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div className="bg-background py-20">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>

          <div className="mt-10 space-y-4">{children}</div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold tracking-tight">{children}</h2>;
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed text-muted-foreground">{children}</p>;
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">{children}</ul>;
}
