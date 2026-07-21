import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in — Reputicious",
  description: "Log in to your Reputicious account.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.25), transparent 40%)",
        }}
      />

      <div className="relative w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <Star className="h-4 w-4 fill-white text-white" />
          </span>
          Reputicious
        </Link>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-lg">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-slate-400">Log in to your dashboard.</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
