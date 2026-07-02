// OY Admin data access (Phase 5).
//
// OY Admin holds a `Manage <table> (OY Admin)` RLS policy (USING is_oy_admin())
// on institutions/users/events/reports/institution_requests/etc., so the browser
// supabase client can SELECT/UPDATE cross-institution directly — no SECURITY
// DEFINER RPC needed. These helpers are called from the OY client components.
import { supabase } from "@/lib/supabase";

export type InstitutionStatus = "pending" | "approved" | "rejected";

export interface OyInstitution {
  institution_id: string;
  institution_name: string;
  abbreviated_name: string;
  status: InstitutionStatus;
  created_at: string | null;
  institution_domains: { domain: string; type_category: string }[];
}

export interface OyInstitutionRequest {
  request_id: string;
  user_email: string;
  director_email: string | null;
  email_domain: string | null;
  note: string | null;
  status: string;
  created_at: string | null;
}

export interface OyMetrics {
  institutionsTotal: number;
  institutionsPending: number;
  usersTotal: number;
  eventsTotal: number;
  reportsPending: number;
}

// Pending schools surface first (the work queue), then rejected, then approved.
const STATUS_ORDER: Record<InstitutionStatus, number> = {
  pending: 0,
  rejected: 1,
  approved: 2,
};

/** Every institution across the platform with its registered email domains. */
export async function fetchInstitutions(): Promise<OyInstitution[]> {
  const { data, error } = await supabase
    .from("institutions")
    .select(
      "institution_id, institution_name, abbreviated_name, status, created_at, " +
        "institution_domains(domain, type_category)"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  // sort() is stable in V8, so newest-first within each status group is kept.
  return ((data ?? []) as unknown as OyInstitution[]).sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  );
}

/** Approve / reject an institution. Releases (or holds) its members' /pending gate. */
export async function setInstitutionStatus(
  institutionId: string,
  status: InstitutionStatus
): Promise<void> {
  const { error } = await supabase
    .from("institutions")
    .update({ status })
    .eq("institution_id", institutionId);
  if (error) throw error;
}

/** "Add my school" submissions from users whose institution isn't onboarded yet. */
export async function fetchInstitutionRequests(): Promise<OyInstitutionRequest[]> {
  const { data, error } = await supabase
    .from("institution_requests")
    .select("request_id, user_email, director_email, email_domain, note, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OyInstitutionRequest[];
}

/** Update a school request's status (pending | contacted | approved | rejected). */
export async function setRequestStatus(requestId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("institution_requests")
    .update({ status })
    .eq("request_id", requestId);
  if (error) throw error;
}

/** Live cross-institution counts for the OY dashboard. */
export async function fetchMetrics(): Promise<OyMetrics> {
  const head = { count: "exact" as const, head: true };
  const [inst, pending, users, events, reports] = await Promise.all([
    supabase.from("institutions").select("*", head),
    supabase.from("institutions").select("*", head).eq("status", "pending"),
    supabase.from("users").select("*", head),
    supabase.from("events").select("*", head),
    supabase.from("reports").select("*", head).eq("status", "pending"),
  ]);
  return {
    institutionsTotal: inst.count ?? 0,
    institutionsPending: pending.count ?? 0,
    usersTotal: users.count ?? 0,
    eventsTotal: events.count ?? 0,
    reportsPending: reports.count ?? 0,
  };
}

// ── Global member directory (/dashboard/oy/users) ────────────────────────────
export interface OyUser {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string;
  onboarding: boolean;
  avatar_url: string;
  roles: { role_name: string } | null;
  institutions: { institution_name: string; abbreviated_name: string } | null;
}

/** Every user across the platform with their role + institution. */
export async function fetchAllUsers(): Promise<OyUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "user_id, email, first_name, last_name, username, onboarding, avatar_url, " +
        "roles(role_name), institutions(institution_name, abbreviated_name)"
    )
    .order("email");
  if (error) throw error;
  return (data ?? []) as unknown as OyUser[];
}

// ── Reports moderation queue (/dashboard/oy/reports) ─────────────────────────
export type ReportStatus = "pending" | "resolved";

export interface OyReport {
  report_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string | null;
  institutions: { abbreviated_name: string } | null;
  reporter: { email: string | null; username: string } | null;
}

/** All reports across institutions, unresolved first. */
export async function fetchReports(): Promise<OyReport[]> {
  const { data, error } = await supabase
    .from("reports")
    .select(
      "report_id, reason, status, created_at, " +
        "institutions(abbreviated_name), " +
        "reporter:users!reports_reported_by_fkey(email, username)"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as OyReport[];
  // Pending first; created_at desc preserved within each group (stable sort).
  return rows.sort((a, b) =>
    a.status === b.status ? 0 : a.status === "pending" ? -1 : 1
  );
}

/** Resolve / reopen a report. */
export async function setReportStatus(
  reportId: string,
  status: ReportStatus
): Promise<void> {
  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("report_id", reportId);
  if (error) throw error;
}

// ── Media assets (/dashboard/oy/media) ───────────────────────────────────────
export interface OyMedia {
  media_asset_id: string;
  url: string;
  asset_type: string;
  visibility_scope: string;
  created_at: string | null;
  institutions: { abbreviated_name: string } | null;
  owner: { email: string | null; username: string } | null;
}

/** Every media asset across institutions, newest first. */
export async function fetchMedia(): Promise<OyMedia[]> {
  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "media_asset_id, url, asset_type, visibility_scope, created_at, " +
        "institutions(abbreviated_name), " +
        "owner:users!media_assets_user_id_fkey(email, username)"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OyMedia[];
}

/** Remove a media asset (OY RLS permits cross-institution delete). */
export async function deleteMedia(mediaAssetId: string): Promise<void> {
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("media_asset_id", mediaAssetId);
  if (error) throw error;
}
