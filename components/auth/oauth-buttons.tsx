"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.66h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.87c2.27-2.09 3.58-5.17 3.58-8.85z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3a7.4 7.4 0 0 1-4.07 1.14c-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.468 2.213-1.238 3.02-.836.87-2.192 1.55-3.26 1.46-.13-1.09.42-2.24 1.19-3.02.83-.86 2.28-1.53 3.31-1.46zM20.86 17.24c-.5 1.15-.73 1.66-1.36 2.68-.88 1.42-2.12 3.2-3.66 3.21-1.37.02-1.72-.9-3.58-.89-1.86.01-2.25.9-3.62.88-1.54-.02-2.71-1.62-3.59-3.04-2.46-3.98-2.72-8.65-1.2-11.13.14-.23 1.86-2.87 4.29-2.86 1.34.01 1.98.9 3.28.9 1.3 0 2.07-.9 3.6-.9 1.14 0 3.06.62 4.19 2.5-3.69 2.02-3.1 7.28 1.65 8.65z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.12.82-.27.82-.59 0-.29-.01-1.06-.02-2.08-3.34.75-4.04-1.64-4.04-1.64-.55-1.43-1.34-1.82-1.34-1.82-1.09-.77.08-.75.08-.75 1.21.09 1.84 1.28 1.84 1.28 1.07 1.87 2.81 1.33 3.49 1.02.11-.79.42-1.33.76-1.64-2.67-.31-5.47-1.37-5.47-6.09 0-1.35.47-2.45 1.24-3.31-.12-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.27a11.2 11.2 0 0 1 6 0c2.29-1.6 3.3-1.27 3.3-1.27.66 1.7.24 2.96.12 3.27.77.86 1.24 1.96 1.24 3.31 0 4.73-2.81 5.77-5.49 6.08.43.38.81 1.13.81 2.28 0 1.65-.01 2.98-.01 3.38 0 .32.21.72.82.59C20.56 22.34 24 17.74 24 12.3 24 5.5 18.63 0 12 0z" />
    </svg>
  );
}

const READY_TO_CONNECT_TITLE =
  "Ready to connect — needs Apple/GitHub OAuth credentials configured in the Supabase dashboard first.";

export function OauthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWith(provider: "google" | "facebook") {
    setError(null);
    setLoadingProvider(provider);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoadingProvider(null);
    }
    // On success the browser is redirected away to the provider — no further
    // client-side state update happens here.
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signInWith("google")}
          disabled={loadingProvider !== null}
          className="flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => signInWith("facebook")}
          disabled={loadingProvider !== null}
          className="flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <FacebookIcon />
          Facebook
        </button>

        {/* Apple/GitHub: code path is wired and correct (same signInWithOAuth
            call as Google/Facebook above), but Supabase's Apple and GitHub
            providers still need real OAuth app credentials registered in the
            Supabase dashboard (Authentication -> Providers) before these can
            go live — that step needs an Apple Developer / GitHub account and
            can't be done from here. Left disabled with a "Soon" tag rather
            than clickable-but-erroring, matching this app's pattern of never
            presenting an unfinished feature as if it were live. */}
        <button
          type="button"
          disabled
          title={READY_TO_CONNECT_TITLE}
          className="relative flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-white/40"
        >
          <AppleIcon />
          Apple
          <span className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-700 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-300">
            Soon
          </span>
        </button>
        <button
          type="button"
          disabled
          title={READY_TO_CONNECT_TITLE}
          className="relative flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-sm font-medium text-white/40"
        >
          <GithubIcon />
          GitHub
          <span className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-700 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-300">
            Soon
          </span>
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-slate-500">or continue with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
