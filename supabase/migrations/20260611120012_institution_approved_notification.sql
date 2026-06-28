-- Institution approved → notify its Institution Admin(s) (Phase 5).
--
-- When an OY Admin flips an institution to 'approved', its members are released
-- from the /pending holding page. Tell the institution's admin(s) it happened.
-- Mirrors the 4 SECURITY DEFINER notification triggers in 20260611120010: the
-- recipient can't INSERT their own notification, so this runs as definer.

create or replace function public.notify_institution_approved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    insert into public.notifications (user_id, type)
    select u.user_id, 'institution_approved'
    from public.users u
    join public.roles r on r.role_id = u.role_id
    where u.institution_id = new.institution_id
      and r.role_name = 'Institution Admin';
  end if;
  return new;
end;
$$;

create trigger institutions_after_update_notify
  after update on public.institutions
  for each row execute function public.notify_institution_approved();
