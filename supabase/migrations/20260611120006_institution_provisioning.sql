-- Multi-tenant institution self-serve provisioning.
--
-- When a new institution is created during admin onboarding we must also: seed
-- its role set, register its email domain, and promote the creating user to
-- Institution Admin of it. A self-onboarding user isn't an Institution Admin
-- yet, so they can't INSERT into institutions/roles under RLS. This is all done
-- via a SECURITY DEFINER function (bypassing RLS) plus a trigger that seeds the
-- standard role set for every new institution.

-- ── Auto-seed roles for every new institution ────────────────────────────────
create or replace function public.institutions_after_insert_create_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.roles (role_name, description, institution_id)
  values
    ('OY Admin',          'Platform-wide OverYonder administrator', new.institution_id),
    ('Institution Admin', 'Institution-level administrator',        new.institution_id),
    ('Faculty',           'Educators and staff',                    new.institution_id),
    ('Student Leader',    'Club/group executives',                  new.institution_id),
    ('Student',           'Default role for authenticated users',   new.institution_id),
    ('Pending',           'No access to system yet',                new.institution_id)
  on conflict (role_name, institution_id) do nothing;
  return new;
end;
$$;

create trigger institutions_after_insert_roles
  after insert on public.institutions
  for each row execute function public.institutions_after_insert_create_roles();

-- ── Create an institution (pending) and make the caller its admin ────────────
create or replace function public.create_institution_and_admin(
  p_name text,
  p_abbr text,
  p_address text,
  p_domain text,
  p_domain_type text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_inst uuid;
  v_admin_role uuid;
  v_dtype domain_type;
  v_domain text := lower(trim(p_domain));
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if coalesce(trim(p_name), '') = '' or coalesce(trim(p_abbr), '') = ''
     or v_domain = '' then
    raise exception 'Missing required fields';
  end if;

  v_dtype := case lower(coalesce(p_domain_type, 'student'))
               when 'faculty' then 'Faculty'::domain_type
               else 'Student'::domain_type
             end;

  if exists (select 1 from public.institution_domains where domain = v_domain) then
    raise exception 'That email domain is already registered to an institution';
  end if;

  -- Insert institution (the trigger above seeds its roles).
  insert into public.institutions (institution_name, abbreviated_name, address, status)
  values (p_name, p_abbr, nullif(trim(p_address), ''), 'pending')
  returning institution_id into v_inst;

  insert into public.institution_domains (institution_id, domain, type_category)
  values (v_inst, v_domain, v_dtype);

  select role_id into v_admin_role
  from public.roles
  where institution_id = v_inst and role_name = 'Institution Admin'
  limit 1;

  update public.users
     set institution_id = v_inst,
         role_id        = v_admin_role,
         onboarding     = true
   where user_id = v_uid;

  return v_inst;
end;
$$;

grant execute on function public.create_institution_and_admin(text, text, text, text, text) to authenticated;
