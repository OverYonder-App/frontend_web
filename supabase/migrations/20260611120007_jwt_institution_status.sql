-- Add the user's institution approval status to the JWT so middleware can route
-- members of an unapproved (pending/rejected) institution to a holding page,
-- while letting the institution's own admin through to set things up.

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
