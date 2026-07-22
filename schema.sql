-- Reputicious database schema
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
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz,
  add column if not exists report_frequency text not null default 'weekly'
    check (report_frequency in ('weekly', 'monthly', 'off')),
  add column if not exists alert_phone_number text;

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
