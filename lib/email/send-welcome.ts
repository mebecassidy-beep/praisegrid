import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { sendEmail } from "@/lib/email/client";
import { welcomeEmail } from "@/lib/email/templates/welcome";
import { getOrCreateWelcomePromotionCode } from "@/lib/stripe";

/**
 * Sends the welcome email exactly once per user. Callable with any Supabase
 * client (route-handler session client for the OAuth path, service-role
 * client for the pre-confirmation signup path where there's no session yet).
 */
export async function sendWelcomeEmailIfDue(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("email, welcome_email_sent_at")
    .eq("id", userId)
    .single();

  if (!profile || profile.welcome_email_sent_at) return;

  const promoCode = await getOrCreateWelcomePromotionCode();
  const { subject, html } = welcomeEmail({ promoCode });

  await sendEmail({ to: profile.email, subject, html });

  await (supabase.from("profiles") as any)
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq("id", userId);
}

/** Same as above, but looks the user up by email — used by the public,
 * unauthenticated signup-triggered route where there may be no session yet. */
export async function sendWelcomeEmailByEmailIfDue(
  supabase: SupabaseClient<Database>,
  email: string
): Promise<void> {
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("id, email, welcome_email_sent_at")
    .eq("email", email)
    .single();

  if (!profile || profile.welcome_email_sent_at) return;

  await sendWelcomeEmailIfDue(supabase, profile.id);
}
