-- Kjør dette i Supabase SQL Editor for å opprette tabellen.

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  user_id uuid references auth.users (id) on delete set null,
  type text not null check (type in ('bike', 'run')),
  direction text not null check (direction in ('roundtrip', 'oneway')),
  points int not null check (points in (1, 2))
);

create index if not exists trips_created_at_idx on public.trips (created_at desc);
create index if not exists trips_name_idx on public.trips (name);
create index if not exists trips_user_id_idx on public.trips (user_id);

alter table public.trips enable row level security;

-- Alle kan se ledertavlen
create policy "Alle kan lese turer"
  on public.trips for select
  using (true);

-- Kun innloggede kan registrere turer knyttet til egen bruker
create policy "Innloggede kan registrere egne turer"
  on public.trips for insert
  to authenticated
  with check (auth.uid() = user_id);
