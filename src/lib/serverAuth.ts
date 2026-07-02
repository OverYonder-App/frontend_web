import jwt from "jsonwebtoken";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthContext {
  userId: string;
  roleType: string | null;
  institutionId: string | null;
}

/**
 * Resolves the signed-in user along with their role and institution.
 *
 * `role_type` and `institution_id` are injected into the access token by the
 * `auth_customize_jwt` hook and are NOT present on the stored user metadata
 * that `getUser()` returns — so they must be read from the JWT claims. We
 * still call `getUser()` first so the token is validated against the auth
 * server before we trust any claim from it.
 */
export async function getAuthContext(
  supabase: SupabaseClient
): Promise<AuthContext | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let roleType: string | null = null;
  let institutionId: string | null = null;
  if (session?.access_token) {
    const decoded = jwt.decode(session.access_token) as {
      app_metadata?: { role_type?: string; institution_id?: string };
    } | null;
    roleType = decoded?.app_metadata?.role_type ?? null;
    institutionId = decoded?.app_metadata?.institution_id ?? null;
  }

  return { userId: user.id, roleType, institutionId };
}
