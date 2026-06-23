-- Prevent privilege escalation via direct profile updates.
--
-- The "Update self" RLS policy lets a user update their own row (needed for
-- profile edits), but must NOT let them change role_id or institution_id — that
-- would allow assigning themselves an admin role or moving institutions. This
-- BEFORE UPDATE trigger blocks such changes when they come from an ordinary
-- end-user role (authenticated/anon) that isn't an admin.
--
-- Legitimate role/institution changes still pass through, because they come from
-- a different context where current_user is NOT authenticated/anon:
--   * SECURITY DEFINER functions (complete_user_onboarding,
--     create_institution_and_admin) run as the function owner;
--   * the signup trigger INSERTs (not UPDATE);
--   * migrations/seed run as the superuser;
--   * Institution/OY Admins are allowed by their JWT role_type.
--
-- NOTE: this function is intentionally SECURITY INVOKER (the default) so that
-- current_user reflects the role that actually fired the update.

create or replace function public.users_guard_role_institution()
returns trigger
language plpgsql
as $$
begin
  if new.role_id is distinct from old.role_id
     or new.institution_id is distinct from old.institution_id then
    if current_user in ('authenticated', 'anon')
       and coalesce(auth.jwt() -> 'app_metadata' ->> 'role_type', '')
           not in ('Institution Admin', 'OY Admin') then
      raise exception
        'Not allowed to change your role or institution'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists users_guard_role_institution_trigger on public.users;
create trigger users_guard_role_institution_trigger
  before update on public.users
  for each row execute function public.users_guard_role_institution();
