-- Add the user's institution approval status to the JWT so middleware can route
-- members of an unapproved (pending/rejected) institution to a holding page,
-- while letting the institution's own admin through to set things up.
--
-- NOTE: renumbered from 20260611120007 → 20260611120013 to remove a duplicate
-- migration version (it collided with 20260611120007_institution_requests). Two
-- files sharing a version make `supabase db push` skip one — which here would
-- drop the final `create or replace` of auth_customize_jwt and silently strip
-- the `institution_status` claim in prod. This file has no dependency on the
-- other 120007 migration, so it is safe to apply last; it remains the final
-- definition of the hook, which is what must win.

create or replace function public.auth_customize_jwt(event jsonb)
returns jsonb
security definer
set search_path = public
as $$
declare
  claims jsonb;
  user_role_type text;
  user_institution_id uuid;
  user_onboarding boolean;
  user_inst_status text;
begin
  select r.role_name, u.institution_id, u.onboarding, i.status::text
    into user_role_type, user_institution_id, user_onboarding, user_inst_status
  from public.users u
  left join public.roles r on r.role_id = u.role_id
  left join public.institutions i on i.institution_id = u.institution_id
  where u.user_id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(
    claims,
    '{app_metadata}',
    coalesce(claims->'app_metadata', '{}'::jsonb)
      || jsonb_build_object(
           'role_type', coalesce(user_role_type, 'Pending'),
           'institution_id', user_institution_id,
           'onboarding', coalesce(user_onboarding, false),
           'institution_status', coalesce(user_inst_status, 'none')
         )
  );

  return jsonb_set(event, '{claims}', claims);
end;
$$ language plpgsql;
