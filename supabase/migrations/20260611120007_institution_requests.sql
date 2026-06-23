-- Institution onboarding requests.
--
-- When a student/faculty member's email domain doesn't match any institution,
-- they can request that their school be onboarded (and point us at their
-- Student Involvement Director). These are persisted for an OY Admin to act on.

create table if not exists public.institution_requests (
  request_id uuid not null default gen_random_uuid(),
  requested_by uuid not null,
  user_email text not null,
  email_domain text,
  director_email text,
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'approved', 'rejected')),
  note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone,
  primary key (request_id),
  foreign key (requested_by) references public.users (user_id) on delete cascade
);

create index if not exists idx_institution_requests_status
  on public.institution_requests (status);

alter table public.institution_requests enable row level security;

-- A user may file and see their own request.
create policy "Insert own institution request"
  on public.institution_requests
  for insert to authenticated
  with check (requested_by = auth.uid());

create policy "Select own institution request"
  on public.institution_requests
  for select to authenticated
  using (requested_by = auth.uid());

-- OY Admin reviews and manages all requests.
create policy "Manage institution requests (OY Admin)"
  on public.institution_requests
  for all to authenticated
  using (public.is_oy_admin())
  with check (public.is_oy_admin());

create trigger institution_requests_trigger_set_updated_at
  before update on public.institution_requests
  for each row execute function set_updated_at();
