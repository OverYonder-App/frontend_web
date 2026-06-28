-- "Friends going" social proof for events.
--
-- RLS on event_attendance only lets a user see their OWN attendance rows, so a
-- client can't tell which of their friends are attending an event. This
-- SECURITY DEFINER function runs as the owner (bypassing RLS) but is scoped to
-- the *caller's own* accepted friends via auth.uid(), so it only ever reveals
-- attendance of people the caller is already friends with. Returns a per-event
-- count plus a few friend first names for a "Sarah +2" label. Takes an array of
-- ids so a page of cards resolves all its counts in one request, mirroring
-- event_attendance_counts.

create or replace function public.event_friends_going(ids uuid[])
returns table(event_id uuid, count integer, names text[])
language sql
security definer
set search_path = public
stable
as $$
  with my_friends as (
    select case
             when fr.requester_id = auth.uid() then fr.receiver_id
             else fr.requester_id
           end as friend_id
    from public.friend_requests fr
    where fr.status = 'accepted'
      and (fr.requester_id = auth.uid() or fr.receiver_id = auth.uid())
  ),
  going as (
    select ea.event_id,
           coalesce(nullif(trim(u.first_name), ''), u.username) as display_name
    from public.event_attendance ea
    join my_friends mf on mf.friend_id = ea.user_id
    join public.users u on u.user_id = ea.user_id
    where ea.event_id = any(ids)
  )
  select g.event_id,
         count(*)::int as count,
         (array_agg(g.display_name order by g.display_name))[1:3] as names
  from going g
  group by g.event_id;
$$;

grant execute on function public.event_friends_going(uuid[]) to authenticated;
