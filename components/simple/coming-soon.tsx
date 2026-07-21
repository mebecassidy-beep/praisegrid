import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

export function ComingSoonPage({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main>
      <Navbar />
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{description}</p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      <Footer />
    </main>
  );
}
