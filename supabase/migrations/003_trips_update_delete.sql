-- Kjør i SQL Editor hvis tabellen allerede finnes (legger til rediger/slett)

drop policy if exists "Brukere kan oppdatere egne turer" on public.trips;
drop policy if exists "Brukere kan slette egne turer" on public.trips;

create policy "Brukere kan oppdatere egne turer"
  on public.trips for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Brukere kan slette egne turer"
  on public.trips for delete
  to authenticated
  using (auth.uid() = user_id);

grant update, delete on public.trips to authenticated;
