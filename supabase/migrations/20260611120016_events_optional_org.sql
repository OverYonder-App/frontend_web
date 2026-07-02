-- Make an event's club/organization OPTIONAL.
--
-- events.organization_id was NOT NULL, and the create form required a club. That
-- left a cliff: a brand-new institution with no approved clubs literally could
-- not create ANY event. Events can legitimately be campus-wide (an admin posting
-- an institution event not owned by a club), so the link is now optional. RLS is
-- unaffected — the Student/Faculty/Institution-Admin insert policies don't
-- reference organization_id, so a NULL org is permitted.

alter table public.events alter column organization_id drop not null;
