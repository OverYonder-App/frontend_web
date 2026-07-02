-- Local development seed data.
-- Every test account signs in with password "password123":
--   oyadmin@overyonder.test      -> OY Admin (OverYonder)
--   admin@collegeofidaho.edu     -> Institution Admin (College of Idaho)
--   faculty@collegeofidaho.edu   -> Faculty (College of Idaho)
--   leader@collegeofidaho.edu    -> Student Leader (College of Idaho)
--   student@collegeofidaho.edu   -> Student (College of Idaho)

-- ── Institutions ─────────────────────────────────────────────────────────────
INSERT INTO public.institutions
  (institution_id, institution_name, abbreviated_name, address, latitude, longitude,
   primary_color, secondary_color, logo_url, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'OverYonder', 'OY',
   NULL, NULL, NULL, '#1d4ed8', '#f59e0b', '/images/overyonder-logo.png', 'approved'),
  ('00000000-0000-0000-0000-000000000002', 'College of Idaho', 'C of I',
   '2112 Cleveland Blvd, Caldwell, ID 83605', 43.6529, -116.6874,
   '#5e2d91', '#ffc72c', '/images/college-of-idaho-logo.png', 'approved');

-- ── Roles (one set per institution) ──────────────────────────────────────────
-- The institutions_after_insert trigger already seeds these for each institution
-- inserted above; this is kept as a belt-and-suspenders no-op (ON CONFLICT).
INSERT INTO public.roles (role_name, description, institution_id)
SELECT r.role_name, r.description, i.institution_id
FROM public.institutions i
CROSS JOIN (VALUES
  ('OY Admin',          'Platform-wide OverYonder administrator'),
  ('Institution Admin', 'Institution-level administrator'),
  ('Faculty',           'Educators and staff'),
  ('Student Leader',    'Club/group executives'),
  ('Student',           'Default role for authenticated users'),
  ('Pending',           'No access to system yet')
) AS r(role_name, description)
ON CONFLICT (role_name, institution_id) DO NOTHING;

-- ── Institution domains (drives signup institution matching) ────────────────
INSERT INTO public.institution_domains (institution_id, domain, type_category)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'collegeofidaho.edu', 'Student'),
  ('00000000-0000-0000-0000-000000000002', 'yotes.collegeofidaho.edu', 'Student'),
  ('00000000-0000-0000-0000-000000000001', 'overyonder.test', 'OY Admin');

-- ── Test auth users ──────────────────────────────────────────────────────────
-- The auth_users_after_insert_trigger creates the public.users rows.
INSERT INTO auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change, email_change_token_new,
   email_change_token_current)
SELECT
  '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
  u.email, crypt('password123', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
  '', '', '', '', ''
FROM (VALUES
  ('10000000-0000-0000-0000-000000000001'::uuid, 'oyadmin@overyonder.test'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'admin@collegeofidaho.edu'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'faculty@collegeofidaho.edu'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'leader@collegeofidaho.edu'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'student@collegeofidaho.edu')
) AS u(id, email);

INSERT INTO auth.identities
  (id, user_id, provider_id, provider, identity_data, last_sign_in_at,
   created_at, updated_at)
SELECT
  gen_random_uuid(), u.id, u.id::text, 'email',
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  now(), now(), now()
FROM auth.users u
WHERE u.email IN (
  'oyadmin@overyonder.test', 'admin@collegeofidaho.edu',
  'faculty@collegeofidaho.edu', 'leader@collegeofidaho.edu',
  'student@collegeofidaho.edu'
);

-- Promote each test user to their intended role and finish onboarding.
UPDATE public.users u
SET role_id = r.role_id,
    first_name = v.first_name,
    last_name = v.last_name,
    onboarding = true
FROM (VALUES
  ('10000000-0000-0000-0000-000000000001'::uuid, 'OY Admin',          'Olive', 'Yonder'),
  ('10000000-0000-0000-0000-000000000002'::uuid, 'Institution Admin', 'Ada',   'Adminson'),
  ('10000000-0000-0000-0000-000000000003'::uuid, 'Faculty',           'Frank', 'Faculty'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'Student Leader',    'Lena',  'Leader'),
  ('10000000-0000-0000-0000-000000000005'::uuid, 'Student',           'Sam',   'Student')
) AS v(user_id, role_name, first_name, last_name)
JOIN public.roles r
  ON r.role_name = v.role_name
WHERE u.user_id = v.user_id
  AND r.institution_id = u.institution_id;

-- ── Sample organization, members, events ─────────────────────────────────────
INSERT INTO public.organizations
  (organization_id, name, institution_id, description, organization_type, status,
   approved_by, created_by, logo_url)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Yotes Outdoor Club',
   '00000000-0000-0000-0000-000000000002',
   'Hiking, climbing, and camping trips around the Treasure Valley.',
   'club', 'approved',
   '10000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000004',
   '/images/college-of-idaho-logo.png');

INSERT INTO public.org_members (org_id, user_id, role, is_executive)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'President', true),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Member', false);

INSERT INTO public.events
  (event_id, title, description, address, latitude, longitude, image_url,
   created_by, institution_id, organization_id, start_date, end_date,
   status, visibility_level)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'Welcome Back Bonfire',
   'Kick off the semester with s''mores and music on the quad.',
   '2112 Cleveland Blvd, Caldwell, ID', 43.6529, -116.6874,
   '/images/sample-event-1.jpg',
   '10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000001',
   now() + interval '2 days', now() + interval '2 days 3 hours',
   'approved', 'public'),
  ('30000000-0000-0000-0000-000000000002', 'Table Rock Sunrise Hike',
   'Early morning hike up Table Rock. Carpool from campus at 5am.',
   'Table Rock Trailhead, Boise, ID', 43.5984, -116.1633,
   '/images/sample-event-2.jpg',
   '10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000001',
   now() + interval '7 days', now() + interval '7 days 4 hours',
   'approved', 'public'),
  ('30000000-0000-0000-0000-000000000003', 'Club Budget Planning',
   'Draft event awaiting review: planning session for spring trips.',
   '', 43.6529, -116.6874,
   '/images/sample-event-3.jpg',
   '10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000001',
   now() + interval '10 days', now() + interval '10 days 2 hours',
   'pending', 'public');

INSERT INTO public.event_approvals (event_id, status)
VALUES ('30000000-0000-0000-0000-000000000003', 'pending');

-- ── Announcements, categories, tags ──────────────────────────────────────────
INSERT INTO public.announcements (institution_id, title, body, created_by, org_id)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Spring Club Fair',
   'Sign your club up for the spring fair by Friday.',
   '10000000-0000-0000-0000-000000000002', NULL),
  ('00000000-0000-0000-0000-000000000002', 'Outdoor Club Gear Swap',
   'Bring gently used gear to trade at the student union.',
   '10000000-0000-0000-0000-000000000003',
   '20000000-0000-0000-0000-000000000001');

INSERT INTO public.categories (category_id, name, description, institution_id, created_by)
VALUES
  ('40000000-0000-0000-0000-000000000001', 'Social',
   'Mixers, parties, and community events',
   '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000002', 'Outdoors',
   'Hikes, trips, and outdoor recreation',
   '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002');

INSERT INTO public.event_categories (category_id, institution_id, event_id)
VALUES
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002');

INSERT INTO public.tags (name, institution_id)
VALUES
  ('Free Food', '00000000-0000-0000-0000-000000000002'),
  ('Outdoors', '00000000-0000-0000-0000-000000000002'),
  ('Music', '00000000-0000-0000-0000-000000000002');

-- RSVPs: Welcome Back Bonfire = 2 going, Table Rock Sunrise Hike = 1 going.
INSERT INTO public.event_attendance (user_id, event_id)
VALUES
  ('10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002')
ON CONFLICT (user_id, event_id) DO NOTHING;
