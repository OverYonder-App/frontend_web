-- Let students join and leave clubs/groups themselves.
--
-- org_members previously only allowed Institution Admins or an org's creator to
-- INSERT members, and only Institution Admins to DELETE. That blocks the basic
-- "Join / Leave" action on the student club view. These two policies let a user
-- manage their OWN membership row (and, for joining, only in an org belonging to
-- their institution). They sit alongside the existing admin/executive policies
-- (RLS policies are OR-ed), so admin management is unaffected.

create policy "Join org (self)"
  on public.org_members
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.organizations o
      where o.organization_id = org_members.org_id
        and o.institution_id =
            (((auth.jwt() -> 'app_metadata') ->> 'institution_id'))::uuid
    )
  );

create policy "Leave org (self)"
  on public.org_members
  for delete
  to authenticated
  using (user_id = auth.uid());
