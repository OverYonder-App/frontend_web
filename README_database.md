# OverYonder DB Design Readme

This document describes the **database schema** for _OverYonder_, the platform enabling students, clubs, groups, and institutions to manage and discover events on campus.

## **Schemas**

- `public` — Main application data (users, events, institutions, etc.)
- `auth` - Users creation table
- `billing` - Billing institutions

## **Naming Convention**

- `{schema}_{table}_{timing}\_{event}\_trigger`
- `{schema}_{table}_{action}\_function`

## **Roles**

- `OY Admin`: Platform-wide OverYonder administrator with access to all institutions.
- `Institution Admin`: Institution-level administrator limited to their assigned institution.
- `Faculty`: Educators and staff with permissions to post announcements and view categories.
- `Student`: Default role for authenticated users at an institution.
- `Student Leader`: Elevated role for club/group executives with broader content management.
- `Pending`: no access to system yet

## Policy Design

_Institutions_

- OY Admin: full access
- Institution Admin: can manage their institution details
- Faculty: can see their institution details
- Student: can see their institution details
- Student Leader: can see their institution details
- Pending: none

_Users_

- OY Admin: can manage all users
- Institution Admin: can manage all users in their institution
- Student: can update, delete or select their own data but see all other users on their institution
- Faculty: can update, delete or select their own data but see all other users on their institution
- Student Leader: can update, delete or select their own data but see all other users on their institution
- Pending: no access

_Organizations_

- OY Admin: can manage all organizations
- Institution Admin: can manage all organizations in their institution
- Faculty: can create, update or delete groups they’ve created but not clubs. they can see all other clubs on campus and see only groups they have created or are apart of in their institution
- Student Leader: can create, update or delete clubs in organizations but should be draft or pending status for organizations that are clubs. For groups they can create groups. they can see all other clubs and groups they have created and are apart of in their institution.
- Student: can create, update or delete clubs in organizations but should be draft or pending status for organizations that are clubs. For groups they can create groups. they can see all other clubs and groups they have created and are apart of in their institution
- Pending: none

_Media_assets_

- OY admin: can manage all media assets
- Institution Admin: can manage media assets in their institution
- Faculty: can manage their own media assets in their institution
- Student Leader: can manage their own media assets in their institution
- Student: can manage their own media assets in their institution
- Pending: none

_org_media_links_

- OY Admin: can manage all media links all organizations in all institutions
- Institution Admin: can manage media asset links for all organizations in their institution.
- Faculty: can manage their own media asset links for their organizations(groups) in their institution
- Student leader: can manage media asset links for organizations they are in executives of (clubs) or groups they’ve created
- Student: can manage media assets links for organizations(groups) they’ve created in their institutions
- Pending: none

_event_media_links_

- OY Admin: can manage all media links all organizations in all institutions
- Institution Admin: can manage their media assets links for their events in their institutions
- Faculty: can manage their own media assets links for their events in their institution
- Student Leader: can manage their own media assets links for their events they’ve in their institution
- Student: can manage their own media assets links for their events they’ve created.
- Pending: none

_friend_requests_

- OY Admin: can manage all friend requests in all institutions
- Institution Admin: can manage friend requests in their institution
- Faculty: Can manage their friend requests they send to users in their institution or receive in their institution. When they delete a request it is rejected.
- Student Leader: Can manage their friend requests they send to users in their institution or receive in their institution. When they delete a request it is rejected.
- Student: Can manage their friend requests they send to users in their institution or receive in their institution. When they delete a request it is rejected.
- Pending: none

_Reports_

- OY Admin: can manage all reports in all institutions
- Institution Admin: can mange all reports for their institution
- Faculty: can send reports, view reports they have created and update reports they’ve created. can delete reports they’ve created.
- Student leader: can send reports, view reports they have created and update reports they’ve created. can delete reports they’ve created.
- Student: can send reports, view reports they have created and update reports they’ve created. can delete reports they’ve created.
- Pending: none

_Events_

- OY Admin: can manage all events
- Institution admin: can manage all events in their institution
- Faculty: can view events update events they have created, create draft or pending events.
- Student Leader: can manage draft or pending events they’ve created unless it is a group event then it will be automatically be approved.
- Student: can manage can manage draft or pending events they’ve created unless it is a group event then it will be automatically be approved.
- Pending: none

_Roles_

- OY Admin: can manage all roles
- Institution Admin: can manage roles in their institution
- Faculty: can see all roles in their institution
- Student Leader: can see all roles in their institution
- Student: can see all roles in their institution
- Pending: none

_Tags_

- OY Admin: can manage all tags
- Institution Admin: can manage all tags in their institution
- Faculty: can see all tags in their institution
- Student Leader: can see all tags in their institution
- Student: can see all tags in their institution

_Event_tags_

- OY Admin: can manage all tags
- Institution Admin: can manage all tags in institution
- Faculty: can view all event tags in their institution
- Student Leader: can view all event tags in their institution
- Student: can view all event tags in their institution

_event_approvals_

- OY Admin: can manage all event approvals
- Institution Admin: can manage all event approvals in institution
- Faculty can see all events that have been approved in their institution
- Student leader: can see all events that have been approved in their institution
- Student: can see all events that have been approved in their institution

_org_members_

- OY Admin: can manage all members of each organization in all institutions
- Institution Admin: can manage all members of each organization in their institution
- Faculty: can see members of each organization in their institution
- Student Leader: can see members of each organization in their institution. Can add members to organizations they create
- Student: can see members of organizations their institution

_categories_

- OY Admin: can manage all categories
- Institution Admin: can manage all categories in their institution
- Faculty: can see all categories in their institution
- Student Leader: can see all categories in their institution
- Student: can see all categories in their institution

_institution_domains_

- OY Admin: can manage all institution domains
- Institution Admin: can manage all institution domains in their institution
- Faculty: can see all institution domains in their institution
- Student leader: can see all institution domains in their institution
- Student: can see all institution domains in their institution

_event_categories_

- OY Admin: can manage all event categories
- Institution Admin: can manage all event categories in their institution
- Faculty: can manage all event categories in their institution
- Student leader: can manage all event categories in their institution
- Student: can manage all event categories in their institution

_subcategories_

- OY Admin: can manage all subcategories
- Institution Admin: can manage all subcategories in their institution
- Faculty: can see all subcategories in their institution
- Student leader: can see all subcategories in their institution
- Student: can see all subcategories in their institution

  _user_event_favorites_

- OY Admin: can manage all user event favorites
- Institution Admin: can manage all user event favorites
- Faculty: can manage their own event favorites
- Student leader: can manage their own event favorites
- Student: can manage their own event favorites

_event_comments_

- OY Admin: can manage all event comments
- Institution Admin: can manage all event comments in their their institution
- Faculty: can manage their own event comment
- Student leader: can manage their own event comment
- Student: can manage their own event comment

_event_attendance_

- OY Admin: can manage all event attendance
- Institution Admin: can manage their event attendance for their institution
- Faculty: can manage their own event attendance in their institution
- Student leader: can manage their own event attendance in their institution
- Student: can manage their own event attendance in their institution

_announcements_

- OY Admin: can manage all announcements
- Institution Admin: can manage all announcements in their institution
- Faculty: can manage their own announcements in their institution
- Student leader: can manage their own announcements in their institution
- Student: can see announcements in their institution

_org_invites_

- OY Admin: can manage all organization invites
- Institution Admin: can manage all organization invites in their institution
- Faculty: can manage their organization invites in their institution. can see organization invites sent to them
- Student leader: can manage their organization invites in their institution
- Student: can manage their organization invites in their institution and see invites sent to them.

_org_approvals_

- OY Admin: can manage all organization approvals
- Institution Admin: can manage all organization approvals in their institution
- Faculty: can see all approved organizations
- Student leader: can see all approved organizations
- Student: can see all approved organizations

  _event_invites_

- OY Admin: can manage all event invites
- Institution Admin: can manage all event invites in their institution
- Faculty: can see all event invites they’ve been sent in their institution and accept them.
- Student leader: can manage all event invites they send from organizations they created
- Student: can manage all event invites for groups they own and see all invites they’ve been sent and accept them.

<details>
<summary>SQL Definitions </summary>

### SQL

```SQL
CREATE TYPE event_status AS ENUM ('draft', 'pending', 'approved','rejected');
CREATE TYPE visibility_level AS ENUM ('public','friend','group');
CREATE TYPE friend_status AS ENUM ('sent','accepted','blocked');
CREATE TYPE status AS ENUM ('draft','rejected', 'accepted', 'pending');
CREATE TYPE domain_type AS ENUM ('Student', 'Faculty','Institution Admin', 'OY Admin');
CREATE TYPE org_type AS ENUM ('club','group');
CREATE TYPE status_report AS ENUM ('resolved','pending');
CREATE TYPE institution_verification AS ENUM ('pending', 'approved', 'rejected')

CREATE TABLE IF NOT EXISTS institutions (
  institution_id uuid not null default gen_random_uuid (),
  institution_name text not null unique,
  abbreviated_name text not null,
  address text null,
  longitude numeric null,
  latitude numeric null,
  primary_color text null,
  secondary_color text,
  logo_url text null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  status institution_verification not null default 'pending',
  PRIMARY KEY (institution_id)

);

CREATE TABLE IF NOT EXISTS roles (
  role_id uuid not null default gen_random_uuid (),
  role_name text not null,
  institution_id uuid not null,
  description text not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (role_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  UNIQUE (role_name, institution_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id uuid not null default gen_random_uuid (),
  first_name text null default ''::text,
  last_name text null default ''::text,
  username text not null default (
    'oy'::text || lpad(
      (
        floor((random() * (1000000000)::double precision))
      )::text,
      10,
      '0'::text
    )
  ),
  institution_id uuid null,
  email text,
  avatar_url text not null default 'https://pxrpvalhhtbudwrvuglt.supabase.co/storage/v1/object/public/avatar-url//profile_icon.png'::text,
  onboarding boolean not null default false,
  about text null default ''::text,
  website_url text null default ''::text,
  role_id uuid null,
  constraint users_pkey primary key (user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS organizations (
  organization_id uuid not null default gen_random_uuid (),
  name text not null,
  institution_id uuid not null,
  logo_url text null,
  description text not null,
  approved_by uuid not null,
  updated_at timestamp with time zone null,
  updated_by uuid null,
  created_by uuid not null,
  status event_status null,
  organization_type org_type not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (organization_id),
  FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_roles (
  user_role_id uuid not null default gen_random_uuid (),
  role_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (user_role_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS events (
  event_id uuid not null default gen_random_uuid (),
  title text not null,
  description text not null,
  address text null default '',
  latitude numeric not null,
  longitude numeric not null,
  image_url text not null,
  created_by uuid not null,
  institution_id uuid not null,
  organization_id uuid not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status event_status not null,
  visibility_level visibility_level not null,
  updated_at timestamp with time zone null,
  PRIMARY KEY (event_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media_assets (
  media_asset_id uuid not null default gen_random_uuid (),
  visibility_scope visibility_level not null,
  institution_id uuid not null,
  user_id uuid not null,
  asset_type text not null,
  url text not null,
  created_at timestamp with time zone default now (),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id)
);


CREATE TABLE IF NOT EXISTS org_media_links (
  media_asset_id uuid not null default gen_random_uuid (),
  org_id uuid not null,
  FOREIGN KEY (org_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
  FOREIGN KEY (media_asset_id) REFERENCES media_assets(media_asset_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id,org_id)
);

CREATE TABLE IF NOT EXISTS event_media_links (
  media_asset_id uuid not null default gen_random_uuid (),
  event_id uuid not null,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (media_asset_id) REFERENCES media_assets(media_asset_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id, event_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  requester_id uuid not null,
  receiver_id uuid not null,
  status friend_status not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (requester_id, receiver_id),
  FOREIGN KEY (receiver_id) REFERENCES users(user_id),
  FOREIGN KEY (requester_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS reports (
  report_id uuid not null default gen_random_uuid (),
  reason text not null,
  reported_by uuid,
  institution_id uuid not null,
  status status_report not null default 'pending'::status_report,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (report_id),
  FOREIGN KEY (reported_by) REFERENCES users(user_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id uuid not null default gen_random_uuid (),
  name text not null,
  institution_id uuid null,
  updated_at timestamp with time zone null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (tag_id)
);

CREATE TABLE IF NOT EXISTS event_tags (
  event_id uuid not null,
  tag_id uuid not null,
  created_at timestamp with time zone default now (),
  FOREIGN KEY (tag_id) REFERENCES tags(tag_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);


CREATE TABLE IF NOT EXISTS org_members (
  org_id uuid not null,
  user_id uuid not null,
  role text not null,
  is_executive boolean default false,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (org_id, user_id),
  FOREIGN KEY (org_id) REFERENCES organizations(organization_id)
);

CREATE TABLE IF NOT EXISTS categories (
  category_id uuid not null default gen_random_uuid (),
  name text not null,
  description text not null,
  created_at timestamp with time zone default now (),
  institution_id uuid not null,
  created_by uuid not null,
  PRIMARY KEY (category_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);


CREATE TABLE IF NOT EXISTS institution_domains (
  institution_domain_id uuid not null default gen_random_uuid (),
  institution_id uuid not null,
  domain text not null unique,
  type_category domain_type not null,
  created_at timestamp,
  PRIMARY KEY (institution_domain_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

CREATE TABLE IF NOT EXISTS event_categories (
  category_id uuid not null,
  institution_id uuid not null,
  event_id uuid not null,
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS subcategories (
  subcategory_id uuid not null default gen_random_uuid (),
  category_id uuid not null,
  name text not null,
  description text not null,
  created_at timestamp with time zone default now (),
  institution_id uuid not null,
  created_by uuid not null,
  PRIMARY KEY (subcategory_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id)
);

CREATE TABLE IF NOT EXISTS event_subcategories (
  subcategory_id uuid not null,
  institution_id uuid not null,
  event_id uuid not null,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS user_event_favorites (
  favorite_id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (favorite_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS event_comments (
  event_comment_id uuid not null default gen_random_uuid (),
  comment text not null,
  created_by uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (event_comment_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS event_approvals (
  approval_id uuid not null default gen_random_uuid (),
  event_id uuid not null,
  approved_by uuid null default null,
  status status not null default 'pending'::status,
  updated_at timestamp with time zone null,
  PRIMARY KEY (event_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_attendance (
  event_attendance_id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (event_attendance_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS announcements (
  announcement_id uuid not null default gen_random_uuid (),
  institution_id uuid not null,
  title text not null,
  org_id uuid null,
  body text not null,
  created_by uuid not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (announcement_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  FOREIGN KEY (org_id) REFERENCES organizations(organization_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);



CREATE TABLE IF NOT EXISTS org_invites (
  invite_id uuid not null default gen_random_uuid (),
  org_id uuid not null,
  institution_id uuid not null,
  invited_by uuid not null,
  invitee uuid not null,
  message text null,
  status status not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (invite_id),
  FOREIGN KEY (org_id) REFERENCES organizations(organization_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  FOREIGN KEY (invited_by) REFERENCES users(user_id),
  FOREIGN KEY (invitee) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS org_approvals (
  approval_id uuid,
  approved_by uuid,
  org_id uuid,
  status status,
  reviewed_at timestamp with time zone null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (approval_id),
  FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES organizations(organization_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_invites (
  invite_id uuid not null default gen_random_uuid (),
  event_id uuid not null,
  institution_id uuid not null,
  invited_by uuid not null,
  invitee uuid not null,
  status status not null,
  message text null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (invite_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
  FOREIGN KEY (invited_by) REFERENCES users(user_id),
  FOREIGN KEY (invitee) REFERENCES users(user_id)
);


-- Inserts
INSERT INTO public.roles (role_name, description, institution_id)
SELECT 'Pending', 'Temporary role assigned when Student role is missing', institution_id
FROM public.institutions
WHERE NOT EXISTS (
  SELECT 1 FROM public.roles r
  WHERE r.institution_id = institutions.institution_id AND r.role_name = 'Pending'
);



-- FUNCTIONS
CREATE OR REPLACE FUNCTION public_users_after_insert_trigger()
RETURNS trigger AS $$
DECLARE
  email_domain TEXT;
  institution_id_var UUID;
  default_institution_id UUID;
  student_role_id UUID;
  pending_role_id UUID;
BEGIN
  -- Extract domain from email
  email_domain := substring(NEW.email FROM '@(.*)$');

  -- Try to find matching institution by domain
  SELECT institution_id INTO institution_id_var
  FROM public.institution_domains
  WHERE domain = email_domain;

  -- Get fallback institution ("OverYonder") if not matched
  SELECT institution_id INTO default_institution_id
  FROM public.institutions
  WHERE institution_name = 'OverYonder'
  LIMIT 1;

  IF institution_id_var IS NULL THEN
    institution_id_var := default_institution_id;
  END IF;

  -- Try to get the Student role for the matched/default institution
  SELECT role_id INTO student_role_id
  FROM public.roles
  WHERE role_name = 'Student'
    AND institution_id = institution_id_var
  LIMIT 1;

  -- If Student role is not found, fallback to Pending role
  IF student_role_id IS NULL THEN
    SELECT role_id INTO pending_role_id
    FROM public.roles
    WHERE role_name = 'Pending'
      AND institution_id = institution_id_var
    LIMIT 1;

    -- If Pending also doesn't exist, raise an exception
    IF pending_role_id IS NULL THEN
      RAISE EXCEPTION 'No Student or Pending role found for institution_id: %', institution_id_var;
    END IF;

    student_role_id := pending_role_id;
  END IF;

  -- Insert user into public.users
  INSERT INTO public.users (
    user_id,
    email,
    institution_id,
    role_id
  ) VALUES (
    NEW.id,
    NEW.email,
    institution_id_var,
    student_role_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- TRIGGERS
CREATE TRIGGER auth_users_after_insert_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public_users_after_insert_trigger();

CREATE TRIGGER events_trigger_set_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER institutions_trigger_set_updated_at
BEFORE UPDATE ON institutions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER roles_trigger_set_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orgs_trigger_set_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER reports_trigger_set_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER friend_requests_trigger_set_updated_at
BEFORE UPDATE ON friend_requests
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER event_invites_trigger_set_updated_at
BEFORE UPDATE ON event_invites
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER org_invites_trigger_set_updated_at
BEFORE UPDATE ON org_invites
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER event_comments_trigger_set_updated_at
BEFORE UPDATE ON event_comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER event_approvals_trigger_set_updated_at
BEFORE UPDATE ON event_approvals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER announcements_trigger_set_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Tables
-- institutions, users, organizations, media_assets, org_media_links, friend_requests, reports, events, roles, user_roles, tags, event_tags, event_approvals, org_members, categories, institution_domains, event_categories, subcategories, user_event_favorites, event_comments, event_attendance, announcements, org_invites, org_approvals, event_invites,

-- POLICIES
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_event_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_invites ENABLE ROW LEVEL SECURITY;


-- ── institutions ───────────────────────────────────────────────────────────────
CREATE POLICY "Select own institution"
  ON public.institutions
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert institution (Institution Admin)"
  ON public.institutions
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update institution (Institution Admin)"
  ON public.institutions
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Delete institution (Institution Admin)"
  ON public.institutions
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );


-- ── roles ─────────────────────────────────────────────────────────────────────
CREATE POLICY "Select roles (Institution Admin)"
  ON public.roles
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert roles (Institution Admin)"
  ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update roles (Institution Admin)"
  ON public.roles
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete roles (Institution Admin)"
  ON public.roles
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── users ─────────────────────────────────────────────────────────────────────
CREATE POLICY "Select users in institution"
  ON public.users
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert self"
  ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update self"
  ON public.users
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "Delete self"
  ON public.users
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Manage users (Institution Admin)"
  ON public.users
  FOR ALL TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );


-- ── organizations ─────────────────────────────────────────────────────────────
CREATE POLICY "Select organizations in institution"
  ON public.organizations
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert draft organizations (Student)"
  ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update organizations (Institution Admin)"
  ON public.organizations
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Delete organizations (Institution Admin)"
  ON public.organizations
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );


-- ── user_roles ────────────────────────────────────────────────────────────────
CREATE POLICY "Manage user_roles (Institution Admin)"
  ON public.user_roles
  FOR ALL TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── events ───────────────────────────────────────────────────────────────────
CREATE POLICY "Select approved events"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    status = 'approved'
    AND (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert draft/pending events (Student)"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    AND status IN ('draft','pending')
    AND created_by = auth.uid()
  );

CREATE POLICY "Insert approved events (Institution Admin)"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    AND status = 'approved'
  );

CREATE POLICY "Update own events"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
  )
  WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY "Approve pending events (Institution Admin)"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    status = 'pending'
    AND (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    status = 'approved'
  );

CREATE POLICY "Delete approved events (Institution Admin)"
  ON public.events
  FOR DELETE TO authenticated
  USING (
    status = 'approved'
    AND (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Select own draft/rejected events (Student)"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    AND status IN ('draft','rejected')
    AND (auth.jwt()->'app_metadata'->>'role_type') = 'Student'
  );

CREATE POLICY "Resubmit rejected events (Student)"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    AND status = 'rejected'
  )
  WITH CHECK (
    status = 'pending'
    AND (auth.jwt()->'app_metadata'->>'role_type') = 'Student'
  );


-- ── media_assets ─────────────────────────────────────────────────────────────
CREATE POLICY "Select media_assets (Institution Admin)"
  ON public.media_assets
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert media_assets (Owner)"
  ON public.media_assets
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "Update media_assets (Owner or Institution Admin)"
  ON public.media_assets
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
      AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR (
      (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
      AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Delete media_assets (Institution Admin)"
  ON public.media_assets
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_media_links ────────────────────────────────────────────────────────
CREATE POLICY "Select event_media_links (Institution Admin)"
  ON public.event_media_links
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert event_media_links (Owner)"
  ON public.event_media_links
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_media_links.event_id
         AND e.created_by = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.media_assets m
       WHERE m.media_asset_id = public.event_media_links.media_asset_id
         AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Update event_media_links (Institution Admin)"
  ON public.event_media_links
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete event_media_links (Institution Admin)"
  ON public.event_media_links
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── org_media_links ──────────────────────────────────────────────────────────
CREATE POLICY "Select org_media_links (Institution Admin)"
  ON public.org_media_links
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert org_media_links (Institution Admin)"
  ON public.org_media_links
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update org_media_links (Institution Admin)"
  ON public.org_media_links
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete org_media_links (Institution Admin)"
  ON public.org_media_links
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── friend_requests ──────────────────────────────────────────────────────────
CREATE POLICY "Select friend_requests"
  ON public.friend_requests
  FOR SELECT TO authenticated
  USING (
    (requester_id = auth.uid() OR receiver_id = auth.uid())
  );

CREATE POLICY "Insert friend_requests"
  ON public.friend_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    requester_id = auth.uid()
    AND EXISTS (
      SELECT 1
        FROM public.users u1
        JOIN public.users u2
          ON u2.user_id = public.friend_requests.receiver_id
        WHERE u1.user_id = auth.uid()
          AND u1.institution_id = u2.institution_id
    )
  );

CREATE POLICY "Update own friend_requests"
  ON public.friend_requests
  FOR UPDATE TO authenticated
  USING (
    requester_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY "Delete own friend_requests"
  ON public.friend_requests
  FOR DELETE TO authenticated
  USING (
    requester_id = auth.uid() OR receiver_id = auth.uid()
  );


-- ── reports ──────────────────────────────────────────────────────────────────
CREATE POLICY "Select own reports"
  ON public.reports
  FOR SELECT TO authenticated
  USING (
    reported_by = auth.uid()
  );

CREATE POLICY "Insert own reports"
  ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (
    reported_by = auth.uid()
  );

CREATE POLICY "Update reports (Institution Admin)"
  ON public.reports
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete reports (Institution Admin)"
  ON public.reports
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── tags ─────────────────────────────────────────────────────────────────────
CREATE POLICY "Select tags"
  ON public.tags
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert tags (Institution Admin)"
  ON public.tags
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update tags (Institution Admin)"
  ON public.tags
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete tags (Institution Admin)"
  ON public.tags
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── categories ───────────────────────────────────────────────────────────────
CREATE POLICY "Select categories"
  ON public.categories
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert categories (Institution Admin)"
  ON public.categories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update categories (Institution Admin)"
  ON public.categories
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete categories (Institution Admin)"
  ON public.categories
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── subcategories ────────────────────────────────────────────────────────────
CREATE POLICY "Select subcategories"
  ON public.subcategories
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert subcategories (Institution Admin)"
  ON public.subcategories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update subcategories (Institution Admin)"
  ON public.subcategories
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete subcategories (Institution Admin)"
  ON public.subcategories
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_tags ───────────────────────────────────────────────────────────────
CREATE POLICY "Select event_tags"
  ON public.event_tags
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_tags.event_id
         AND e.institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Insert event_tags (Institution Admin)"
  ON public.event_tags
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update event_tags (Institution Admin)"
  ON public.event_tags
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete event_tags (Institution Admin)"
  ON public.event_tags
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_categories ────────────────────────────────────────────────────────
CREATE POLICY "Select event_categories"
  ON public.event_categories
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_categories.event_id
         AND e.institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Insert event_categories (Institution Admin)"
  ON public.event_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update event_categories (Institution Admin)"
  ON public.event_categories
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete event_categories (Institution Admin)"
  ON public.event_categories
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_subcategories ─────────────────────────────────────────────────────
CREATE POLICY "Select event_subcategories"
  ON public.event_subcategories
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_subcategories.event_id
         AND e.institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Insert event_subcategories (Institution Admin)"
  ON public.event_subcategories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update event_subcategories (Institution Admin)"
  ON public.event_subcategories
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete event_subcategories (Institution Admin)"
  ON public.event_subcategories
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── org_members ─────────────────────────────────────────────────────────────
CREATE POLICY "Select org_members (Institution Admin)"
  ON public.org_members
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert org_members (Institution Admin)"
  ON public.org_members
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update org_members (Institution Admin)"
  ON public.org_members
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete org_members (Institution Admin)"
  ON public.org_members
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_comments ──────────────────────────────────────────────────────────
CREATE POLICY "Select event_comments"
  ON public.event_comments
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
  );

CREATE POLICY "Insert event_comments"
  ON public.event_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY "Update event_comments"
  ON public.event_comments
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
  )
  WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY "Delete event_comments (Institution Admin)"
  ON public.event_comments
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_approvals ─────────────────────────────────────────────────────────
CREATE POLICY "Select event_approvals (Institution Admin)"
  ON public.event_approvals
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert event_approvals (Institution Admin)"
  ON public.event_approvals
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update event_approvals (Institution Admin)"
  ON public.event_approvals
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete event_approvals (Institution Admin)"
  ON public.event_approvals
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── org_approvals ───────────────────────────────────────────────────────────
CREATE POLICY "Select org_approvals (Institution Admin)"
  ON public.org_approvals
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert org_approvals (Institution Admin)"
  ON public.org_approvals
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Update org_approvals (Institution Admin)"
  ON public.org_approvals
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete org_approvals (Institution Admin)"
  ON public.org_approvals
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_attendance ────────────────────────────────────────────────────────
CREATE POLICY "Select event_attendance (Owner)"
  ON public.event_attendance
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Insert event_attendance (Owner)"
  ON public.event_attendance
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "Delete event_attendance (Institution Admin)"
  ON public.event_attendance
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── announcements ────────────────────────────────────────────────────────────
CREATE POLICY "Select announcements"
  ON public.announcements
  FOR SELECT TO authenticated
  USING (
    institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert announcements (Institution Admin)"
  ON public.announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update announcements (Institution Admin)"
  ON public.announcements
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Delete announcements (Institution Admin)"
  ON public.announcements
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── org_invites ───────────────────────────────────────────────────────────────
CREATE POLICY "Select org_invites (Institution Admin)"
  ON public.org_invites
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert org_invites (Member)"
  ON public.org_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members om
       WHERE om.user_id = auth.uid()
         AND om.org_id  = public.org_invites.org_id
    )
  );

CREATE POLICY "Delete org_invites (Institution Admin)"
  ON public.org_invites
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );


-- ── event_invites ─────────────────────────────────────────────────────────────
CREATE POLICY "Select event_invites (Institution Admin)"
  ON public.event_invites
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert event_invites (Creator)"
  ON public.event_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id   = public.event_invites.event_id
         AND e.created_by = auth.uid()
    )
  );

CREATE POLICY "Delete event_invites (Institution Admin)"
  ON public.event_invites
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Faculty select announcements"
  ON public.announcements
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
    AND institution_id = (auth.jwt() -> 'app_metadata' ->> 'institution_id')::uuid
  );

CREATE POLICY "Faculty insert announcements"
  ON public.announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
    AND institution_id = (auth.jwt() -> 'app_metadata' ->> 'institution_id')::uuid
  );

CREATE POLICY "Faculty view tags"
  ON public.tags
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
  );

CREATE POLICY "Faculty view categories"
  ON public.categories
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
  );

CREATE POLICY "Faculty view subcategories"
  ON public.subcategories
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
  );

CREATE POLICY "Faculty view users"
  ON public.users
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Faculty'
    AND institution_id = (auth.jwt() -> 'app_metadata' ->> 'institution_id')::uuid
  );


-- 6) Student Leader policies
--    • Can manage (INSERT/UPDATE/DELETE) events for clubs/groups they executive
--    • Can SELECT draft events they create in those orgs

CREATE POLICY "Student Leader manage club events"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student Leader'
    AND EXISTS (
      SELECT 1
        FROM public.org_members om
       WHERE om.user_id      = auth.uid()
         AND om.org_id       = public.events.organization_id
         AND om.is_executive = true
    )
  );

CREATE POLICY "Student Leader update club events"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student Leader'
    AND EXISTS (
      SELECT 1 FROM public.org_members om
       WHERE om.user_id      = auth.uid()
         AND om.org_id       = public.events.organization_id
         AND om.is_executive = true
    )
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student Leader'
  );

CREATE POLICY "Student Leader delete club events"
  ON public.events
  FOR DELETE TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student Leader'
    AND EXISTS (
      SELECT 1 FROM public.org_members om
       WHERE om.user_id      = auth.uid()
         AND om.org_id       = public.events.organization_id
         AND om.is_executive = true
    )
  );

CREATE POLICY "Student Leader view own draft events"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student Leader'
    AND status = 'draft'
    AND created_by = auth.uid()
  );


7) Student policies (default)
   • Can INSERT draft/pending events in their institution
   • Can VIEW their own draft/rejected events
   • Can resubmit rejected
   • Can send friend_requests, report, comment

CREATE POLICY "Student insert draft/pending events"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student'
    AND institution_id = (auth.jwt() -> 'app_metadata' ->> 'institution_id')::uuid
    AND status IN ('draft','pending')
    AND created_by = auth.uid()
  );

CREATE POLICY "Student view own draft/rejected"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student'
    AND created_by = auth.uid()
    AND status IN ('draft','rejected')
  );

CREATE POLICY "Student resubmit rejected"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    status = 'rejected'
    AND created_by = auth.uid()
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student'
    AND status = 'pending'
  );

CREATE POLICY "Student manage own friend_requests"
  ON public.friend_requests
  FOR ALL TO authenticated
  USING (
    (requester_id = auth.uid() OR receiver_id = auth.uid())
  )
  WITH CHECK (
    requester_id = auth.uid()
  );

CREATE POLICY "Student report own (insert)"
  ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (
    reported_by = auth.uid()
  );



CREATE POLICY "Student comment own"
  ON public.event_comments
  FOR ALL TO authenticated
  USING (
    created_by = auth.uid()
  );

CREATE POLICY "Student report own (select)"
  ON public.reports
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role_type') = 'Student'
    AND reported_by = auth.uid()
  );



-- INDEXES
CREATE INDEX concurrently IF NOT EXISTS idx_users_institution_id ON public.users(institution_id);
CREATE INDEX concurrently IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX concurrently IF NOT EXISTS idx_events_institution_id ON public.events (institution_id);
CREATE INDEX concurrently IF NOT EXISTS idx_org_members_user_id ON org_members (user_id);
CREATE INDEX concurrently IF NOT EXISTS idx_event_invites_event_id ON event_invites (event_id);
CREATE INDEX concurrently IF NOT EXISTS idx_org_invites_org_id ON org_invites (org_id);
CREATE INDEX concurrently IF NOT EXISTS idx_event_approvals_event_id ON event_approvals (event_id);


-- Buckets 
CREATE POLICY "Upload files by role and path"
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'oy_media'
    AND (
      -- User uploading to their personal folder
      name LIKE (auth.jwt()->>'institution_id') || '/users/' || auth.uid() || '/%'

      -- Event-related media (e.g., banner, docs)
      OR name LIKE (auth.jwt()->>'institution_id') || '/events/%'

      -- Org uploads by Student Leaders
      OR (
        (auth.jwt()->>'role_type') = 'Student Leader'
        AND name LIKE (auth.jwt()->>'institution_id') || '/organizations/%'
      )

      -- Institution Admin full access
      OR (
        (auth.jwt()->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->>'institution_id') || '/%'
      )

      -- OY Admin full access
      OR (auth.jwt()->>'role_type') = 'OY Admin')
  );


-- 2. SELECT (READ)
CREATE POLICY "Read files within institution or owned"
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'oy_media'
    AND (
      -- Files inside user's own folder
      name LIKE '%/users/' || auth.uid() || '/%'

      -- Files in the user's institution
      OR name LIKE (auth.jwt()->>'institution_id') || '/%'

      -- OY Admin has full access
      OR (auth.jwt()->>'role_type') = 'OY Admin'
    )
  );


-- 3. DELETE
CREATE POLICY "Delete files by role or ownership"
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'oy_media'
    AND (
      -- Delete personal uploads
      name LIKE (auth.jwt()->>'institution_id') || '/users/' || auth.uid() || '/%'

      -- Institution Admin within their institution
      OR (
        (auth.jwt()->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->>'institution_id') || '/%'
      )

      -- OY Admin can delete all
      OR (auth.jwt()->>'role_type') = 'OY Admin'
    )
  );

```
</details>

## Database Visual Design
<img width="853" src="https://github.com/OverYonder-App/database_design/blob/main/OverYonder_DB_Design.png?raw=true" alt="OverYonder DB design"/>
![OverYonder_DB_Design.png](https://github.com/OverYonder-App/database_design/blob/main/OverYonder_DB_Design.png?raw=true)

## Bucket Structure

- Bucket name is `oy-media`
- Cap size is `15 MB`
<pre lang="markdown"> 
oy-media/
├── {institution_id}/
│
│   ├── users/
│   │   └── {user_id}/
│   │       ├── avatar.png
│   │       └── uploads/
│   │           ├── {media_asset_id}.jpg
│   │           └── {media_asset_id}.pdf
│   │
│   ├── events/
│   │   └── {event_id}/
│   │       ├── banner.jpg
│   │       ├── thumbnail.jpg
│   │       └── docs/
│   │           ├── flyer.pdf
│   │           └── rules.pdf
│   │
│   ├── organizations/
│   │   └── {org_id}/
│   │       ├── logo.jpg
│   │       └── docs/
│   │           ├── charter.pdf
│   │           └── constitution.pdf
│   │
│   └── uploads/
│       └── {media_asset_id}.{ext}
│
└── global/
    ├── default_avatar.png
    └── system_banners/
        └── intro_banner.jpg
</pre>
