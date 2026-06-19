-- Public attendee counts for events.
--
-- RLS on event_attendance only lets a user see their OWN attendance rows, so a
-- client can't compute how many people are going. This SECURITY DEFINER
-- function runs as the owner (bypassing RLS) and returns only an aggregate
-- count per event — no attendee identities — so it's safe to expose. Takes an
-- array of ids so a page of cards resolves all its counts in one request.

create or replace function public.event_attendance_counts(ids uuid[])
returns table(event_id uuid, count integer)
language sql
security definer
set search_path = public
stable
as $$
  select ea.event_id, count(*)::int
  from public.event_attendance ea
  where ea.event_id = any(ids)
  group by ea.event_id;
$$;

grant execute on function public.event_attendance_counts(uuid[]) to authenticated, anon;
