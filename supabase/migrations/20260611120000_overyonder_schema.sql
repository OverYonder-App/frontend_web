-- OverYonder core schema, from README_database.md ("SQL Definitions"),
-- adjusted where the frontend contract (src/lib/database.types.ts and the
-- feature APIs) requires it:
--   * org_members.user_id gets a FK to users so PostgREST can embed
--     org_members -> users(first_name,last_name,username)
--   * tags.institution_id gets the FK the generated types declare
--   * junction tables get primary keys
--   * "concurrently" dropped from index creation (not allowed in migrations)
--   * users.avatar_url default points at a bundled asset instead of the
--     decommissioned hosted-project URL

CREATE TYPE event_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
CREATE TYPE visibility_level AS ENUM ('public', 'friend', 'group');
CREATE TYPE friend_status AS ENUM ('sent', 'accepted', 'blocked');
CREATE TYPE status AS ENUM ('draft', 'rejected', 'accepted', 'pending');
CREATE TYPE domain_type AS ENUM ('Student', 'Faculty', 'Institution Admin', 'OY Admin');
CREATE TYPE org_type AS ENUM ('club', 'group');
CREATE TYPE status_report AS ENUM ('resolved', 'pending');
CREATE TYPE institution_verification AS ENUM ('pending', 'approved', 'rejected');

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
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  UNIQUE (role_name, institution_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id uuid not null default gen_random_uuid (),
  first_name text null default ''::text,
  last_name text null default ''::text,
  username text not null default (
    'oy'::text || lpad(
      (floor((random() * (1000000000)::double precision)))::text,
      10,
      '0'::text
    )
  ),
  institution_id uuid null,
  email text,
  avatar_url text not null default '/images/overyonder-logo.png'::text,
  onboarding boolean not null default false,
  about text null default ''::text,
  website_url text null default ''::text,
  role_id uuid null,
  constraint users_pkey primary key (user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE SET NULL,
  UNIQUE (user_id)
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
  FOREIGN KEY (updated_by) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_role_id uuid not null default gen_random_uuid (),
  role_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (user_role_id),
  FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
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
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media_assets (
  media_asset_id uuid not null default gen_random_uuid (),
  visibility_scope visibility_level not null,
  institution_id uuid not null,
  user_id uuid not null,
  asset_type text not null,
  url text not null,
  created_at timestamp with time zone default now (),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id)
);

CREATE TABLE IF NOT EXISTS org_media_links (
  media_asset_id uuid not null default gen_random_uuid (),
  org_id uuid not null,
  FOREIGN KEY (org_id) REFERENCES organizations (organization_id) ON DELETE CASCADE,
  FOREIGN KEY (media_asset_id) REFERENCES media_assets (media_asset_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id, org_id)
);

CREATE TABLE IF NOT EXISTS event_media_links (
  media_asset_id uuid not null default gen_random_uuid (),
  event_id uuid not null,
  FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
  FOREIGN KEY (media_asset_id) REFERENCES media_assets (media_asset_id) ON DELETE CASCADE,
  PRIMARY KEY (media_asset_id, event_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  requester_id uuid not null,
  receiver_id uuid not null,
  status friend_status not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (requester_id, receiver_id),
  FOREIGN KEY (receiver_id) REFERENCES users (user_id),
  FOREIGN KEY (requester_id) REFERENCES users (user_id)
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
  FOREIGN KEY (reported_by) REFERENCES users (user_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id)
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id uuid not null default gen_random_uuid (),
  name text not null,
  institution_id uuid null,
  updated_at timestamp with time zone null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (tag_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id)
);

CREATE TABLE IF NOT EXISTS event_tags (
  event_id uuid not null,
  tag_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (event_id, tag_id),
  FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id)
);

CREATE TABLE IF NOT EXISTS org_members (
  org_id uuid not null,
  user_id uuid not null,
  role text not null,
  is_executive boolean default false,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (org_id, user_id),
  FOREIGN KEY (org_id) REFERENCES organizations (organization_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  category_id uuid not null default gen_random_uuid (),
  name text not null,
  description text not null,
  created_at timestamp with time zone default now (),
  institution_id uuid not null,
  created_by uuid not null,
  PRIMARY KEY (category_id),
  FOREIGN KEY (created_by) REFERENCES users (user_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id)
);

CREATE TABLE IF NOT EXISTS institution_domains (
  institution_domain_id uuid not null default gen_random_uuid (),
  institution_id uuid not null,
  domain text not null unique,
  type_category domain_type not null,
  created_at timestamp default now (),
  PRIMARY KEY (institution_domain_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id)
);

CREATE TABLE IF NOT EXISTS event_categories (
  category_id uuid not null,
  institution_id uuid not null,
  event_id uuid not null,
  PRIMARY KEY (event_id, category_id),
  FOREIGN KEY (category_id) REFERENCES categories (category_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id)
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
  FOREIGN KEY (created_by) REFERENCES users (user_id),
  FOREIGN KEY (category_id) REFERENCES categories (category_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id)
);

CREATE TABLE IF NOT EXISTS event_subcategories (
  subcategory_id uuid not null,
  institution_id uuid not null,
  event_id uuid not null,
  PRIMARY KEY (event_id, subcategory_id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories (subcategory_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id)
);

CREATE TABLE IF NOT EXISTS user_event_favorites (
  favorite_id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (favorite_id),
  UNIQUE (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id)
);

CREATE TABLE IF NOT EXISTS event_comments (
  event_comment_id uuid not null default gen_random_uuid (),
  comment text not null,
  created_by uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  updated_at timestamp with time zone null,
  PRIMARY KEY (event_comment_id),
  FOREIGN KEY (created_by) REFERENCES users (user_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id)
);

CREATE TABLE IF NOT EXISTS event_approvals (
  approval_id uuid not null default gen_random_uuid (),
  event_id uuid not null,
  approved_by uuid null default null,
  status status not null default 'pending'::status,
  updated_at timestamp with time zone null,
  PRIMARY KEY (event_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_attendance (
  event_attendance_id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  event_id uuid not null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (event_attendance_id),
  UNIQUE (user_id, event_id),
  FOREIGN KEY (event_id) REFERENCES events (event_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
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
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  FOREIGN KEY (org_id) REFERENCES organizations (organization_id),
  FOREIGN KEY (created_by) REFERENCES users (user_id)
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
  FOREIGN KEY (org_id) REFERENCES organizations (organization_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  FOREIGN KEY (invited_by) REFERENCES users (user_id),
  FOREIGN KEY (invitee) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS org_approvals (
  approval_id uuid not null default gen_random_uuid (),
  approved_by uuid,
  org_id uuid,
  status status,
  reviewed_at timestamp with time zone null,
  created_at timestamp with time zone default now (),
  PRIMARY KEY (approval_id),
  FOREIGN KEY (approved_by) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES organizations (organization_id) ON DELETE CASCADE
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
  FOREIGN KEY (event_id) REFERENCES events (event_id),
  FOREIGN KEY (institution_id) REFERENCES institutions (institution_id),
  FOREIGN KEY (invited_by) REFERENCES users (user_id),
  FOREIGN KEY (invitee) REFERENCES users (user_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON public.users (institution_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_events_institution_id ON public.events (institution_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members (user_id);
CREATE INDEX IF NOT EXISTS idx_event_invites_event_id ON event_invites (event_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_org_id ON org_invites (org_id);

-- FUNCTIONS
-- Assigns institution (by email domain, falling back to OverYonder) and the
-- Student/Pending role when an auth user is created. SECURITY DEFINER because
-- it fires on auth.users, where the inserting role has no access to public.
CREATE OR REPLACE FUNCTION public_users_after_insert_trigger()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Custom access token hook: middleware.ts, UserContext.tsx, and all RLS
-- policies read role_type/institution_id from app_metadata in the JWT.
-- Wired up in supabase/config.toml under [auth.hook.custom_access_token].
CREATE OR REPLACE FUNCTION public.auth_customize_jwt(event jsonb)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role_type text;
  user_institution_id uuid;
  user_onboarding boolean;
BEGIN
  SELECT r.role_name, u.institution_id, u.onboarding
    INTO user_role_type, user_institution_id, user_onboarding
  FROM public.users u
  LEFT JOIN public.roles r ON r.role_id = u.role_id
  WHERE u.user_id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(
    claims,
    '{app_metadata}',
    coalesce(claims->'app_metadata', '{}'::jsonb)
      || jsonb_build_object(
           'role_type', coalesce(user_role_type, 'Pending'),
           'institution_id', user_institution_id,
           'onboarding', coalesce(user_onboarding, false)
         )
  );

  RETURN jsonb_set(event, '{claims}', claims);
END;
$$ LANGUAGE plpgsql;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.auth_customize_jwt TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.auth_customize_jwt FROM authenticated, anon, public;

-- Helper functions declared in src/lib/database.types.ts
CREATE OR REPLACE FUNCTION public.get_user_institution()
RETURNS uuid
STABLE
AS $$
  SELECT (auth.jwt()->'app_metadata'->>'institution_id')::uuid;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION public.is_oy_admin()
RETURNS boolean
STABLE
AS $$
  SELECT coalesce(auth.jwt()->'app_metadata'->>'role_type', '') = 'OY Admin';
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS TABLE (has_role boolean)
STABLE
AS $$
  SELECT coalesce(auth.jwt()->'app_metadata'->>'role_type', '')
           IN ('Institution Admin', 'OY Admin');
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    JOIN public.roles r ON r.role_id = u.role_id
    WHERE u.user_id = has_role.user_id
      AND r.role_name = has_role.role_name
  );
$$ LANGUAGE sql;

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
