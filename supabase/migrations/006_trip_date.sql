-- Én tur per bruker per dag + dato innen konkurranseperioden
-- Kjør i Supabase SQL Editor

alter table public.trips
  add column if not exists trip_date date;

update public.trips
set trip_date = (created_at at time zone 'Europe/Oslo')::date
where trip_date is null;

alter table public.trips
  alter column trip_date set not null;

alter table public.trips
  alter column trip_date set default (timezone('Europe/Oslo', now()))::date;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'trips_trip_date_range'
  ) then
    alter table public.trips
      add constraint trips_trip_date_range
      check (trip_date >= '2026-05-26' and trip_date <= '2026-06-26');
  end if;
end $$;

create unique index if not exists trips_user_trip_date_unique
  on public.trips (user_id, trip_date)
  where user_id is not null;

create index if not exists trips_trip_date_idx on public.trips (trip_date desc);
