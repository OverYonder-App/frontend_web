-- Browser push subscriptions + reminder dedup (Phase 2 #5, Part B).
--
-- push_subscriptions stores one row per browser/device a user has granted
-- Notification permission on (the Web Push endpoint + its encryption keys). The
-- client writes its own rows (RLS own). The dispatch cron reads ACROSS all users
-- with the service-role key (bypassing RLS) to send due reminders.

create table public.push_subscriptions (
  push_subscription_id uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(user_id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "Select own push_subscriptions"
  on public.push_subscriptions
  for select to authenticated
  using (user_id = auth.uid());

create policy "Insert own push_subscriptions"
  on public.push_subscriptions
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "Delete own push_subscriptions"
  on public.push_subscriptions
  for delete to authenticated
  using (user_id = auth.uid());

-- Dedup ledger: one row per (event, user, offset) reminder already sent, so the
-- per-minute dispatch never double-sends. Written only by the service-role cron;
-- RLS is enabled with NO policies, which denies all client access.
create table public.event_reminders_sent (
  event_id   uuid not null references public.events(event_id) on delete cascade,
  user_id    uuid not null references public.users(user_id) on delete cascade,
  offset_min integer not null,
  sent_at    timestamptz not null default now(),
  primary key (event_id, user_id, offset_min)
);

alter table public.event_reminders_sent enable row level security;
