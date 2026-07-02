-- Row Level Security from README_database.md, with the gaps the frontend
-- needs filled in:
--   * "Select approved events" in the README was restricted to Institution
--     Admin, which would hide every approved event from students/faculty —
--     the explorer and dashboards browse approved events for any member of
--     the institution, so the select policy covers all authenticated members.
--   * institution_domains, user_event_favorites, and user_google_tokens had
--     RLS enabled (or were queried by the app) without any policies.
--   * OY Admin full-access policies (the README describes them in prose but
--     the SQL block never defines them).
--   * The duplicated Student event policies in the README are collapsed into
--     one set.

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
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- ── OY Admin: full access everywhere ─────────────────────────────────────────
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'institutions', 'roles', 'users', 'organizations', 'user_roles', 'events',
    'media_assets', 'org_media_links', 'event_media_links', 'friend_requests',
    'reports', 'tags', 'event_tags', 'org_members', 'categories',
    'institution_domains', 'event_categories', 'subcategories',
    'event_subcategories', 'user_event_favorites', 'event_comments',
    'event_approvals', 'event_attendance', 'announcements', 'org_invites',
    'org_approvals', 'event_invites'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "Manage %I (OY Admin)" ON public.%I FOR ALL TO authenticated USING (public.is_oy_admin()) WITH CHECK (public.is_oy_admin())',
      t, t
    );
  END LOOP;
END;
$$;

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
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Delete self"
  ON public.users
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

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
    (auth.jwt()->'app_metadata'->>'role_type') IN ('Student', 'Student Leader', 'Faculty')
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert organizations (Institution Admin)"
  ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
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
CREATE POLICY "Select approved events in institution"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    status = 'approved'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Select pending events (Institution Admin)"
  ON public.events
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Select own events"
  ON public.events
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Insert draft/pending events (Student)"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') IN ('Student', 'Faculty')
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    AND status IN ('draft', 'pending')
    AND created_by = auth.uid()
  );

CREATE POLICY "Insert approved events (Institution Admin)"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Update own events"
  ON public.events
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Moderate events (Institution Admin)"
  ON public.events
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Delete events (Institution Admin)"
  ON public.events
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Student Leader manage club events"
  ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
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
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
    AND EXISTS (
      SELECT 1 FROM public.org_members om
       WHERE om.user_id      = auth.uid()
         AND om.org_id       = public.events.organization_id
         AND om.is_executive = true
    )
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
  );

CREATE POLICY "Student Leader delete club events"
  ON public.events
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
    AND EXISTS (
      SELECT 1 FROM public.org_members om
       WHERE om.user_id      = auth.uid()
         AND om.org_id       = public.events.organization_id
         AND om.is_executive = true
    )
  );

-- ── media_assets ─────────────────────────────────────────────────────────────
CREATE POLICY "Select media_assets (Institution Admin)"
  ON public.media_assets
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Select own media_assets"
  ON public.media_assets
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Insert media_assets (Owner)"
  ON public.media_assets
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

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
  USING (reported_by = auth.uid());

CREATE POLICY "Select reports (Institution Admin)"
  ON public.reports
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

CREATE POLICY "Insert own reports"
  ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (reported_by = auth.uid());

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
    OR institution_id IS NULL
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

CREATE POLICY "Insert event_tags (event owner or Institution Admin)"
  ON public.event_tags
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    OR EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_tags.event_id
         AND e.created_by = auth.uid()
    )
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

CREATE POLICY "Insert event_categories (event owner or Institution Admin)"
  ON public.event_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    OR EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_categories.event_id
         AND e.created_by = auth.uid()
    )
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

CREATE POLICY "Insert event_subcategories (event owner or Institution Admin)"
  ON public.event_subcategories
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    OR EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_subcategories.event_id
         AND e.created_by = auth.uid()
    )
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
CREATE POLICY "Select org_members in institution"
  ON public.org_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
       WHERE o.organization_id = public.org_members.org_id
         AND o.institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Insert org_members (Institution Admin or executive)"
  ON public.org_members
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    OR EXISTS (
      SELECT 1 FROM public.organizations o
       WHERE o.organization_id = public.org_members.org_id
         AND o.created_by = auth.uid()
    )
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
    EXISTS (
      SELECT 1 FROM public.events e
       WHERE e.event_id = public.event_comments.event_id
         AND e.institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
    )
  );

CREATE POLICY "Insert event_comments"
  ON public.event_comments
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Update event_comments"
  ON public.event_comments
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Delete own event_comments"
  ON public.event_comments
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

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
  USING (user_id = auth.uid());

CREATE POLICY "Select event_attendance (Institution Admin)"
  ON public.event_attendance
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

CREATE POLICY "Insert event_attendance (Owner)"
  ON public.event_attendance
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Delete own event_attendance"
  ON public.event_attendance
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

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

CREATE POLICY "Insert announcements (Institution Admin or Faculty)"
  ON public.announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') IN ('Institution Admin', 'Faculty')
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

CREATE POLICY "Select own org_invites"
  ON public.org_invites
  FOR SELECT TO authenticated
  USING (invited_by = auth.uid() OR invitee = auth.uid());

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

CREATE POLICY "Update own org_invites"
  ON public.org_invites
  FOR UPDATE TO authenticated
  USING (invited_by = auth.uid() OR invitee = auth.uid())
  WITH CHECK (invited_by = auth.uid() OR invitee = auth.uid());

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

CREATE POLICY "Select own event_invites"
  ON public.event_invites
  FOR SELECT TO authenticated
  USING (invited_by = auth.uid() OR invitee = auth.uid());

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

CREATE POLICY "Update own event_invites"
  ON public.event_invites
  FOR UPDATE TO authenticated
  USING (invited_by = auth.uid() OR invitee = auth.uid())
  WITH CHECK (invited_by = auth.uid() OR invitee = auth.uid());

CREATE POLICY "Delete event_invites (Institution Admin)"
  ON public.event_invites
  FOR DELETE TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
  );

-- ── Faculty extras (from README) ──────────────────────────────────────────────
CREATE POLICY "Faculty view tags"
  ON public.tags
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Faculty'
  );

CREATE POLICY "Faculty view categories"
  ON public.categories
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Faculty'
  );

CREATE POLICY "Faculty view subcategories"
  ON public.subcategories
  FOR SELECT TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Faculty'
  );

-- ── institution_domains ──────────────────────────────────────────────────────
-- The onboarding flow (/api/institution_domains/check) and the signup trigger
-- both need to read domains; admins manage them.
CREATE POLICY "Select institution_domains"
  ON public.institution_domains
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Manage institution_domains (Institution Admin)"
  ON public.institution_domains
  FOR ALL TO authenticated
  USING (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  )
  WITH CHECK (
    (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
    AND institution_id = (auth.jwt()->'app_metadata'->>'institution_id')::uuid
  );

-- ── user_event_favorites ─────────────────────────────────────────────────────
CREATE POLICY "Manage own favorites"
  ON public.user_event_favorites
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── user_google_tokens ───────────────────────────────────────────────────────
CREATE POLICY "Manage own google tokens"
  ON public.user_google_tokens
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
