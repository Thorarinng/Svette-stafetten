-- ═══════════════════════════════════════════════════════════════
-- LIM INN I SUPABASE → SQL EDITOR → RUN
-- Fikser rediger og slett (ingen RPC-funksjoner nødvendig)
-- ═══════════════════════════════════════════════════════════════

-- Kolonne for innlogging (hopp over hvis den finnes)
alter table public.trips
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.trips enable row level security;

-- Rettigheter
grant usage on schema public to anon, authenticated;
grant select on public.trips to anon, authenticated;
grant insert, update, delete on public.trips to authenticated;

-- Lesing: alle
drop policy if exists "Alle kan lese turer" on public.trips;
create policy "Alle kan lese turer"
  on public.trips for select
  using (true);

-- Innsetting: innloggede, egen user_id
drop policy if exists "Innloggede kan registrere egne turer" on public.trips;
drop policy if exists "Alle kan registrere turer" on public.trips;
create policy "Innloggede kan registrere egne turer"
  on public.trips for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Oppdatering: egne turer + gamle uten user_id
drop policy if exists "Brukere kan oppdatere egne turer" on public.trips;
create policy "Brukere kan oppdatere egne turer"
  on public.trips for update
  to authenticated
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id);

-- Sletting: egne turer + gamle uten user_id
drop policy if exists "Brukere kan slette egne turer" on public.trips;
create policy "Brukere kan slette egne turer"
  on public.trips for delete
  to authenticated
  using (auth.uid() = user_id or user_id is null);

-- Oppdater schema-cache (PostgREST)
notify pgrst, 'reload schema';
