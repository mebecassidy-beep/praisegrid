"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OauthButtons } from "@/components/auth/oauth-buttons";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "magic-link") {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (otpError) {
        setError(otpError.message);
        return;
      }
      setMagicLinkSent(true);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function switchMode(next: "password" | "magic-link") {
    setMode(next);
    setError(null);
    setMagicLinkSent(false);
  }

  if (magicLinkSent) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Check <span className="font-medium text-white">{email}</span> for a link to log in, no
          password needed.
        </div>
        <button
          type="button"
          onClick={() => switchMode("password")}
          className="text-sm font-medium text-slate-400 hover:text-white"
        >
          &larr; Back to log in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <OauthButtons />

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
      </div>

      {mode === "password" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs font-medium text-slate-400 hover:text-white">
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-400 hover:to-violet-500"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "password" ? "Log in" : "Send magic link"}
      </Button>

      <button
        type="button"
        onClick={() => switchMode(mode === "password" ? "magic-link" : "password")}
        className="block w-full text-center text-sm font-medium text-slate-400 hover:text-white"
      >
        {mode === "password" ? "Use a magic link instead" : "Use your password instead"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-white hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
