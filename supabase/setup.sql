-- Kjør HELE denne filen i Supabase → SQL Editor → Run
-- Oppretter trips-tabellen + RLS (løser "Could not find table public.trips")

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trip_date date not null default (timezone('Europe/Oslo', now()))::date,
  name text not null,
  user_id uuid references auth.users (id) on delete set null,
  type text not null check (type in ('bike', 'run')),
  direction text not null check (direction in ('roundtrip', 'oneway')),
  points int not null check (points in (1, 2)),
  constraint trips_trip_date_range check (
    trip_date >= '2026-05-26' and trip_date <= '2026-06-26'
  )
);

create unique index if not exists trips_user_trip_date_unique
  on public.trips (user_id, trip_date)
  where user_id is not null;

create index if not exists trips_created_at_idx on public.trips (created_at desc);
create index if not exists trips_trip_date_idx on public.trips (trip_date desc);
create index if not exists trips_name_idx on public.trips (name);
create index if not exists trips_user_id_idx on public.trips (user_id);

alter table public.trips enable row level security;

drop policy if exists "Alle kan lese turer" on public.trips;
drop policy if exists "Alle kan registrere turer" on public.trips;
drop policy if exists "Innloggede kan registrere egne turer" on public.trips;

create policy "Alle kan lese turer"
  on public.trips for select
  using (true);

create policy "Innloggede kan registrere egne turer"
  on public.trips for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne turer"
  on public.trips for update
  to authenticated
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id);

create policy "Brukere kan slette egne turer"
  on public.trips for delete
  to authenticated
  using (auth.uid() = user_id or user_id is null);

grant usage on schema public to anon, authenticated;
grant select on public.trips to anon, authenticated;
grant insert, update, delete on public.trips to authenticated;

-- Sikker rediger/slett via RPC (unngår RLS-problemer)
create or replace function public.update_own_trip(
  p_trip_id uuid,
  p_type text,
  p_direction text,
  p_points int
)
returns setof public.trips
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.trips t
  set
    type = p_type,
    direction = p_direction,
    points = p_points,
    user_id = coalesce(t.user_id, auth.uid())
  where t.id = p_trip_id
    and (t.user_id = auth.uid() or t.user_id is null)
  returning t.*;
end;
$$;

create or replace function public.delete_own_trip(p_trip_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
begin
  delete from public.trips t
  where t.id = p_trip_id
    and (t.user_id = auth.uid() or t.user_id is null);
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

grant execute on function public.update_own_trip(uuid, text, text, int) to authenticated;
grant execute on function public.delete_own_trip(uuid) to authenticated;
