-- Onboarding completion.
--
-- A self-onboarding user (Student/Faculty) can't read the roles table under RLS
-- (only Institution Admins can), and letting them UPDATE their own role_id
-- directly would allow assigning themselves any role. This SECURITY DEFINER
-- function does the role assignment safely: it only permits the self-selectable
-- roles, resolves the role within the user's own institution, and marks
-- onboarding complete.

create or replace function public.complete_user_onboarding(
  p_first text,
  p_last text,
  p_about text,
  p_avatar text,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_inst uuid;
  v_role_id uuid;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Only roles a user may pick for themselves during onboarding.
  if p_role not in ('Student', 'Student Leader', 'Faculty') then
    raise exception 'Invalid role selection: %', p_role;
  end if;

  select institution_id into v_inst from public.users where user_id = v_uid;
  if v_inst is null then
    raise exception 'No institution assigned to user';
  end if;

  select role_id into v_role_id
  from public.roles
  where institution_id = v_inst and role_name = p_role
  limit 1;
  if v_role_id is null then
    raise exception 'Role % not found for institution', p_role;
  end if;

  update public.users
     set first_name = p_first,
         last_name  = p_last,
         about      = coalesce(p_about, about),
         avatar_url = coalesce(nullif(p_avatar, ''), avatar_url),
         role_id    = v_role_id,
         onboarding = true
   where user_id = v_uid;
end;
$$;

grant execute on function public.complete_user_onboarding(text, text, text, text, text) to authenticated;
