"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLATFORM_META } from "@/components/reviews/platform-meta";
import type { Review } from "@/types";

const TOAST_LIFETIME_MS = 7000;
const REFRESH_DEBOUNCE_MS = 1500;

/**
 * Subscribes to new-review inserts across the signed-in user's locations via
 * Supabase Realtime (Postgres Changes) - requires `reviews` to be added to
 * the `supabase_realtime` publication (see schema.sql). RLS still applies to
 * the subscription, so this can only ever receive rows the viewer owns.
 * Multiple inserts arriving close together (e.g. a sync bringing in several
 * reviews at once) are debounced into a single router.refresh().
 */
export function RealtimeReviewListener({ locationIds }: { locationIds: string[] }) {
  const router = useRouter();
  const [toasts, setToasts] = useState<Review[]>([]);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (locationIds.length === 0) return;

    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | undefined;
    let cancelled = false;

    async function subscribe() {
      // Postgres Changes enforces the reviews RLS policy (auth.uid() against
      // the owning location) using whatever JWT is attached to the realtime
      // websocket. @supabase/ssr's browser client hydrates the session from
      // cookies asynchronously, so joining the channel immediately after
      // createClient() - before that finishes - joins as anonymous and every
      // row silently fails RLS: the channel reports SUBSCRIBED, but no
      // change ever arrives. Explicitly waiting for the session and calling
      // setAuth first guarantees the join carries the real user's token.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) supabase.realtime.setAuth(session.access_token);

      channel = supabase
        .channel("dashboard-reviews")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "reviews",
            filter: `location_id=in.(${locationIds.join(",")})`,
          },
          (payload) => {
            const review = payload.new as Review;
            setToasts((prev) => [review, ...prev].slice(0, 3));

            if (refreshTimer.current) clearTimeout(refreshTimer.current);
            refreshTimer.current = setTimeout(() => {
              router.refresh();
            }, REFRESH_DEBOUNCE_MS);
          }
        )
        .subscribe();
    }

    subscribe();

    return () => {
      cancelled = true;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIds.join(",")]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, TOAST_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [toasts]);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-2 sm:right-6">
      <AnimatePresence>
        {toasts.map((review) => {
          const meta = PLATFORM_META[review.platform];
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border bg-popover p-3.5 shadow-lg"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.badgeClass}`}>
                <meta.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  New {meta.label} review
                  <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-normal text-muted-foreground">
                    {review.rating}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                </p>
                {review.reviewer_name && (
                  <p className="truncate text-xs text-muted-foreground">from {review.reviewer_name}</p>
                )}
                <Link
                  href="/reviews"
                  onClick={() => dismiss(review.id)}
                  className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
                >
                  View
                </Link>
              </div>
              <button
                onClick={() => dismiss(review.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
