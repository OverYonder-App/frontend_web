-- In-app notifications (Phase 2 #5).
--
-- One user's action creates a notification for ANOTHER user (e.g. you send a
-- friend request → the *receiver* gets notified). A plain "insert own" RLS policy
-- would block that, so notifications are written exclusively by SECURITY DEFINER
-- triggers (owned by postgres, bypassing RLS). Clients only ever SELECT/UPDATE
-- their own rows (to read them and mark them read) — there is deliberately no
-- INSERT policy.

create table public.notifications (
  notification_id uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(user_id) on delete cascade,  -- recipient
  type       text not null,        -- friend_request | friend_accepted | friend_going | event_approved | event_rejected
  actor_id   uuid references public.users(user_id) on delete set null,          -- who triggered it (nullable)
  event_id   uuid references public.events(event_id) on delete cascade,         -- related event (nullable)
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_unread_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Select own notifications"
  on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

create policy "Update own notifications"
  on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Delete own notifications"
  on public.notifications
  for delete to authenticated
  using (user_id = auth.uid());

create policy "Manage notifications (OY Admin)"
  on public.notifications
  to authenticated
  using (is_oy_admin())
  with check (is_oy_admin());

-- ── friend request received → notify the receiver ────────────────────────────
create or replace function public.notify_friend_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'sent' and new.requester_id <> new.receiver_id then
    insert into public.notifications (user_id, type, actor_id)
    values (new.receiver_id, 'friend_request', new.requester_id);
  end if;
  return new;
end;
$$;

create trigger friend_requests_after_insert_notify
  after insert on public.friend_requests
  for each row execute function public.notify_friend_request();

-- ── friend request accepted → notify the original requester ──────────────────
create or replace function public.notify_friend_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted'
     and new.requester_id <> new.receiver_id then
    insert into public.notifications (user_id, type, actor_id)
    values (new.requester_id, 'friend_accepted', new.receiver_id);
  end if;
  return new;
end;
$$;

create trigger friend_requests_after_update_notify
  after update on public.friend_requests
  for each row execute function public.notify_friend_accepted();

-- ── someone RSVPs → notify their accepted friends already attending that event ─
-- This is the "friends going" social hook: "Frank is also going to X". Bounded by
-- the number of the new attendee's accepted friends who are themselves attending.
create or replace function public.notify_friend_going()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, actor_id, event_id)
  select friend_id, 'friend_going', new.user_id, new.event_id
  from (
    select case when fr.requester_id = new.user_id then fr.receiver_id
                else fr.requester_id end as friend_id
    from public.friend_requests fr
    where fr.status = 'accepted'
      and (fr.requester_id = new.user_id or fr.receiver_id = new.user_id)
  ) friends
  where exists (
    select 1 from public.event_attendance ea
    where ea.event_id = new.event_id
      and ea.user_id = friends.friend_id
  );
  return new;
end;
$$;

create trigger event_attendance_after_insert_notify
  after insert on public.event_attendance
  for each row execute function public.notify_friend_going();

-- ── event approved/rejected → notify the event's creator ─────────────────────
create or replace function public.notify_event_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and new.status in ('approved', 'rejected') then
    insert into public.notifications (user_id, type, actor_id, event_id)
    values (new.created_by, 'event_' || new.status::text, null, new.event_id);
  end if;
  return new;
end;
$$;

create trigger events_after_update_notify
  after update on public.events
  for each row execute function public.notify_event_status();
