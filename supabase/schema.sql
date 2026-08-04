create extension if not exists pgcrypto;

create type public.letter_status as enum ('draft','sealed','travelling','arrived','opened','archived','cancelled');
create type public.media_kind as enum ('photo','voice','video','music');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  preferred_language text default 'en',
  created_at timestamptz not null default now()
);

create table public.letters (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  recipient_name text not null,
  origin_city text not null,
  origin_region text,
  destination_city text not null,
  destination_region text,
  occasion_type text not null,
  theme_id text not null default 'midnight-post',
  message_ciphertext text not null,
  unlock_at timestamptz not null,
  timezone text not null default 'Asia/Kolkata',
  status public.letter_status not null default 'draft',
  public_token_hash text not null unique,
  opened_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journey_chapters (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  chapter_index integer not null check (chapter_index >= 0),
  scene_key text not null,
  region_name text not null,
  reveal_at timestamptz not null,
  title text not null,
  description text not null,
  clue text,
  weather_label text,
  ambience_label text,
  progress integer not null check (progress between 0 and 100),
  unique(letter_id, chapter_index)
);

create table public.letter_media (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  kind public.media_kind not null,
  private_object_key text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  created_at timestamptz not null default now()
);

create table public.letter_events (
  id bigint generated always as identity primary key,
  letter_id uuid not null references public.letters(id) on delete cascade,
  event_type text not null,
  chapter_index integer,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete restrict,
  provider text not null,
  provider_order_id text not null unique,
  provider_payment_id text,
  amount_paise integer not null check (amount_paise >= 0),
  currency text not null default 'INR',
  status text not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters(id) on delete cascade,
  reporter_email text,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.letters enable row level security;
alter table public.journey_chapters enable row level security;
alter table public.letter_media enable row level security;
alter table public.letter_events enable row level security;
alter table public.payments enable row level security;
alter table public.reports enable row level security;

create policy "owners read own profile" on public.profiles for select using (auth.uid() = id);
create policy "owners update own profile" on public.profiles for update using (auth.uid() = id);
create policy "senders manage own letters" on public.letters for all using (auth.uid() = sender_id) with check (auth.uid() = sender_id);
create policy "senders read own journey chapters" on public.journey_chapters for select using (
  exists (select 1 from public.letters l where l.id = letter_id and l.sender_id = auth.uid())
);
create policy "senders read own payments" on public.payments for select using (
  exists (select 1 from public.letters l where l.id = letter_id and l.sender_id = auth.uid())
);

-- Recipient access should use a server route that hashes the supplied token,
-- checks server time and returns only the current safe projection.
