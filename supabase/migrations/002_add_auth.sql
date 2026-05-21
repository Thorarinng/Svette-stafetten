-- Kjør dette hvis du allerede har opprettet trips uten innlogging.

alter table public.trips
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists trips_user_id_idx on public.trips (user_id);

drop policy if exists "Alle kan registrere turer" on public.trips;

create policy "Innloggede kan registrere egne turer"
  on public.trips for insert
  to authenticated
  with check (auth.uid() = user_id);
