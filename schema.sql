-- Praisegrid database schema
-- Run against a Supabase (PostgreSQL) project. Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

-- ============================================================================
-- profiles
-- Extends auth.users with billing + company metadata.
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  company_name text,
  stripe_customer_id text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'starter', 'pro', 'enterprise')),
  onboarding_completed_at timestamptz,
  welcome_email_sent_at timestamptz,
  report_frequency text not null default 'weekly'
    check (report_frequency in ('weekly', 'monthly', 'off')),
  alert_phone_number text,
  competitor_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz,
  add column if not exists report_frequency text not null default 'weekly'
    check (report_frequency in ('weekly', 'monthly', 'off')),
  add column if not exists alert_phone_number text;

alter table public.profiles
  add column if not exists competitor_name text;

alter table public.profiles
  add column if not exists phone_number text,
  add column if not exists website text;

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new Supabase auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- locations
-- Business locations managed by a user.
-- ============================================================================
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  address text,
  google_place_id text,
  yelp_business_id text,
  created_at timestamptz not null default now()
);

create index if not exists locations_user_id_idx on public.locations (user_id);

alter table public.locations enable row level security;

drop policy if exists "Users can view their own locations" on public.locations;
create policy "Users can view their own locations"
  on public.locations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own locations" on public.locations;
create policy "Users can insert their own locations"
  on public.locations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own locations" on public.locations;
create policy "Users can update their own locations"
  on public.locations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own locations" on public.locations;
create policy "Users can delete their own locations"
  on public.locations for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- reviews
-- Reviews synced from external platforms for a location.
-- ============================================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  platform text not null check (platform in ('google', 'yelp', 'facebook')),
  reviewer_name text,
  rating smallint not null check (rating between 1 and 5),
  review_text text,
  review_date timestamptz,
  response_text text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'posted')),
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  flagged_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reviews
  add column if not exists risk_level text check (risk_level in ('low', 'medium', 'high')),
  add column if not exists flagged_at timestamptz;

alter table public.reviews
  add column if not exists flagged_as_fake boolean not null default false,
  add column if not exists dispute_notes text,
  add column if not exists dispute_draft text,
  add column if not exists social_generated_at timestamptz;

-- Stable per-platform review ID (e.g. Google's places/{id}/reviews/{id}
-- resource name), the idempotency key for the review-sync cron jobs so
-- repeated syncs never insert duplicate rows for the same review. Nullable
-- and only unique-constrained when present, so existing manually-created
-- rows (support/demo data, the pre-sync ingestion endpoint) are unaffected.
alter table public.reviews
  add column if not exists external_review_id text;

create unique index if not exists reviews_location_platform_external_id_idx
  on public.reviews (location_id, platform, external_review_id)
  where external_review_id is not null;

create index if not exists reviews_location_id_idx on public.reviews (location_id);
create index if not exists reviews_status_idx on public.reviews (status);

alter table public.reviews enable row level security;

drop policy if exists "Users can view reviews for their own locations" on public.reviews;
create policy "Users can view reviews for their own locations"
  on public.reviews for select
  using (
    exists (
      select 1 from public.locations
      where locations.id = reviews.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert reviews for their own locations" on public.reviews;
create policy "Users can insert reviews for their own locations"
  on public.reviews for insert
  with check (
    exists (
      select 1 from public.locations
      where locations.id = reviews.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update reviews for their own locations" on public.reviews;
create policy "Users can update reviews for their own locations"
  on public.reviews for update
  using (
    exists (
      select 1 from public.locations
      where locations.id = reviews.location_id
        and locations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.locations
      where locations.id = reviews.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete reviews for their own locations" on public.reviews;
create policy "Users can delete reviews for their own locations"
  on public.reviews for delete
  using (
    exists (
      select 1 from public.locations
      where locations.id = reviews.location_id
        and locations.user_id = auth.uid()
    )
  );

-- Adds `reviews` to Supabase's realtime publication so the dashboard can
-- subscribe to new-review inserts live instead of only picking them up on
-- the next page load. Postgres Changes subscriptions still enforce the RLS
-- policies above, so a client only ever receives inserts for their own
-- locations. Guarded because ALTER PUBLICATION ... ADD TABLE errors (rather
-- than no-ops) if the table's already a member.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;

-- ============================================================================
-- ai_settings
-- Per-location voice/tone configuration for AI-generated responses.
-- ============================================================================
create table if not exists public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null unique references public.locations (id) on delete cascade,
  auto_approve_5star boolean not null default false,
  tone_instructions text,
  sign_off_name text
);

alter table public.ai_settings
  add column if not exists auto_approve_min_rating smallint not null default 5
    check (auto_approve_min_rating between 1 and 5),
  add column if not exists tone_preset text not null default 'custom'
    check (tone_preset in ('friendly_neighborhood', 'professional_corporate', 'custom'));

alter table public.ai_settings enable row level security;

drop policy if exists "Users can view ai_settings for their own locations" on public.ai_settings;
create policy "Users can view ai_settings for their own locations"
  on public.ai_settings for select
  using (
    exists (
      select 1 from public.locations
      where locations.id = ai_settings.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert ai_settings for their own locations" on public.ai_settings;
create policy "Users can insert ai_settings for their own locations"
  on public.ai_settings for insert
  with check (
    exists (
      select 1 from public.locations
      where locations.id = ai_settings.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update ai_settings for their own locations" on public.ai_settings;
create policy "Users can update ai_settings for their own locations"
  on public.ai_settings for update
  using (
    exists (
      select 1 from public.locations
      where locations.id = ai_settings.location_id
        and locations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.locations
      where locations.id = ai_settings.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete ai_settings for their own locations" on public.ai_settings;
create policy "Users can delete ai_settings for their own locations"
  on public.ai_settings for delete
  using (
    exists (
      select 1 from public.locations
      where locations.id = ai_settings.location_id
        and locations.user_id = auth.uid()
    )
  );

-- ============================================================================
-- leads
-- Anonymous homepage lead captures (exit-intent modal, etc.) — not tied to a
-- signed-up account, so no user-scoped RLS policy: only the service-role
-- client (server-side routes) ever reads/writes this table.
-- ============================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- ============================================================================
-- feedback_responses
-- Private "Feedback Shield" ratings captured from the public post-service
-- link (app/feedback/[locationId]). Same anonymous-capture pattern as
-- `leads`: RLS is enabled with no policies, so only the service-role client
-- (server-side routes) ever reads/writes it. Every recipient of the
-- post-service SMS/email sees the same public review links regardless of
-- what they submit here — this table only feeds the business's private
-- inbox, it never determines who is invited to review publicly (that would
-- be "review gating", which the FTC's 2024 rule on fake/manipulated reviews
-- prohibits).
-- ============================================================================
create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  customer_name text,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  viewed_at timestamptz
);

create index if not exists feedback_responses_location_id_idx on public.feedback_responses (location_id);

alter table public.feedback_responses enable row level security;

drop policy if exists "Users can view feedback for their own locations" on public.feedback_responses;
create policy "Users can view feedback for their own locations"
  on public.feedback_responses for select
  using (
    exists (
      select 1 from public.locations
      where locations.id = feedback_responses.location_id
        and locations.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update feedback for their own locations" on public.feedback_responses;
create policy "Users can update feedback for their own locations"
  on public.feedback_responses for update
  using (
    exists (
      select 1 from public.locations
      where locations.id = feedback_responses.location_id
        and locations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.locations
      where locations.id = feedback_responses.location_id
        and locations.user_id = auth.uid()
    )
  );

-- No insert policy: the public capture route (app/api/feedback/[locationId])
-- uses the service-role client, matching the leads table's insert path.

-- ============================================================================
-- scheduled_blasts
-- Queued post-service review requests for the "smart-timing" send option on
-- the One-Click Review Blast card (e.g. "2 hours after service" instead of
-- immediately). Polled by /api/cron/send-scheduled-blasts.
-- ============================================================================
create table if not exists public.scheduled_blasts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  method text not null check (method in ('sms', 'email')),
  to_address text not null,
  customer_name text not null,
  send_at timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists scheduled_blasts_due_idx on public.scheduled_blasts (send_at) where sent_at is null;

alter table public.scheduled_blasts enable row level security;

drop policy if exists "Users can view their own scheduled blasts" on public.scheduled_blasts;
create policy "Users can view their own scheduled blasts"
  on public.scheduled_blasts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own scheduled blasts" on public.scheduled_blasts;
create policy "Users can insert their own scheduled blasts"
  on public.scheduled_blasts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own scheduled blasts" on public.scheduled_blasts;
create policy "Users can delete their own scheduled blasts"
  on public.scheduled_blasts for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- support_conversations
-- Logs every chat transcript escalated via the "Talk to a human" button in
-- the support widget (see app/api/support/escalate). Written by the
-- service-role client since the widget is public and often unauthenticated,
-- same insert pattern as leads/feedback_responses.
-- ============================================================================
create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  contact_email text,
  transcript jsonb not null,
  status text not null default 'escalated'
    check (status in ('escalated', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists support_conversations_user_id_idx on public.support_conversations (user_id);

alter table public.support_conversations enable row level security;

drop policy if exists "Users can view their own support conversations" on public.support_conversations;
create policy "Users can view their own support conversations"
  on public.support_conversations for select
  using (auth.uid() = user_id);

-- No insert/update policy: only the service-role escalate route writes here.

-- ============================================================================
-- feedback_responses: Win-Back SMS support
-- Optional phone number a customer can leave alongside private feedback, so
-- a low rating (1-2 stars) can trigger a one-click "olive branch" SMS from
-- the dashboard. winback_sent_at guards against double-sends and drives the
-- button's sent/unsent state.
-- ============================================================================
alter table public.feedback_responses
  add column if not exists customer_phone text,
  add column if not exists winback_sent_at timestamptz;

-- ============================================================================
-- Reputation Revenue Forensics
-- responded_at is stamped once, the first time a review's response is
-- approved & posted (see app/api/reviews/[id]/route.ts) - never overwritten
-- on later edits, so it stays a true "time to first response" mark. Together
-- with review_date/created_at it drives real response-time math; nothing
-- about this feature is a fabricated number, see lib/analytics/revenue-forensics.ts.
-- ============================================================================
alter table public.reviews
  add column if not exists responded_at timestamptz;

-- estimated_customer_value is the business owner's own estimate of what an
-- average customer is worth (conservative default below), used to translate
-- a count of rescued negative reviews into a revenue-rescued estimate. This
-- is deliberately an owner-editable assumption (see Settings ->
-- components/settings/revenue-estimate-card.tsx), not a number we invent on
-- their behalf - the review counts and response times it's multiplied by are
-- real, but the dollar figure is always presented as an estimate.
alter table public.profiles
  add column if not exists estimated_customer_value numeric(10,2) not null default 150;

-- Optional Slack incoming-webhook URL for the "Notify Crisis Manager" button
-- on high-risk reviews (see lib/slack/send-crisis-notification.ts). Separate
-- from alert_phone_number's automatic SMS alert (lib/sms/send-crisis-alert.ts,
-- pro-tier only, fires on ingestion) - this is an on-demand, team-visible
-- channel notification the owner triggers manually per review.
alter table public.profiles
  add column if not exists crisis_slack_webhook_url text;
