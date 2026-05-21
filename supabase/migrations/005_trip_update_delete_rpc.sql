-- Kjør denne i Supabase SQL Editor (fikser rediger/slett)

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

revoke all on function public.update_own_trip(uuid, text, text, int) from public;
revoke all on function public.delete_own_trip(uuid) from public;
grant execute on function public.update_own_trip(uuid, text, text, int) to authenticated;
grant execute on function public.delete_own_trip(uuid) to authenticated;

-- Behold også direkte RLS (for API-kall uten RPC)
drop policy if exists "Brukere kan oppdatere egne turer" on public.trips;
drop policy if exists "Brukere kan slette egne turer" on public.trips;

create policy "Brukere kan oppdatere egne turer"
  on public.trips for update
  to authenticated
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id);

create policy "Brukere kan slette egne turer"
  on public.trips for delete
  to authenticated
  using (auth.uid() = user_id or user_id is null);

grant update, delete on public.trips to authenticated;
