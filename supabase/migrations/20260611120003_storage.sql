-- "oy-media" bucket (the id every upload call in the app uses) with the 15MB
-- cap from README_database.md. The README's storage policies referenced
-- bucket_id 'oy_media' and read role_type/institution_id from top-level JWT
-- claims; both are corrected here ('oy-media', app_metadata) to match the
-- code and the auth_customize_jwt hook.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('oy-media', 'oy-media', false, 15728640)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Upload files by role and path"
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'oy-media'
    AND (
      -- User uploading to their personal folder
      name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/users/' || auth.uid() || '/%'

      -- Event-related media (e.g., banner, docs)
      OR name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/events/%'

      -- Org uploads by Student Leaders
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/organizations/%'
      )

      -- Institution Admin full access
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/%'
      )

      -- OY Admin full access
      OR (auth.jwt()->'app_metadata'->>'role_type') = 'OY Admin'
    )
  );

CREATE POLICY "Read files within institution or owned"
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'oy-media'
    AND (
      -- Files inside user's own folder
      name LIKE '%/users/' || auth.uid() || '/%'

      -- Files in the user's institution
      OR name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/%'

      -- OY Admin has full access
      OR (auth.jwt()->'app_metadata'->>'role_type') = 'OY Admin'
    )
  );

CREATE POLICY "Delete files by role or ownership"
  ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'oy-media'
    AND (
      -- Delete personal uploads
      name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/users/' || auth.uid() || '/%'

      -- Institution Admin within their institution
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/%'
      )

      -- OY Admin can delete all
      OR (auth.jwt()->'app_metadata'->>'role_type') = 'OY Admin'
    )
  );

CREATE POLICY "Update files by role or ownership"
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'oy-media'
    AND (
      -- Update personal uploads
      name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/users/' || auth.uid() || '/%'

      -- Institution Admin within their institution
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/%'
      )

      -- Student Leader for org files
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/organizations/%'
      )

      -- OY Admin can update all
      OR (auth.jwt()->'app_metadata'->>'role_type') = 'OY Admin'
    )
  )
  WITH CHECK (
    bucket_id = 'oy-media'
    AND (
      name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/users/' || auth.uid() || '/%'
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Institution Admin'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/%'
      )
      OR (
        (auth.jwt()->'app_metadata'->>'role_type') = 'Student Leader'
        AND name LIKE (auth.jwt()->'app_metadata'->>'institution_id') || '/organizations/%'
      )
      OR (auth.jwt()->'app_metadata'->>'role_type') = 'OY Admin'
    )
  );
