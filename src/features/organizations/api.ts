import type { Database } from "@/lib/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

const BASE_URL = "/api/clubs";

export interface FetchClubsOptions {
  status?: string;
  search?: string;
  page?: number;
}

export async function fetchClubs(
  opts: FetchClubsOptions = {}
): Promise<{ clubs: Organization[]; count: number }> {
  const params = new URLSearchParams();
  if (opts.status) params.append("status", opts.status);
  if (opts.search) params.append("q", opts.search);
  if (opts.page) params.append("page", String(opts.page));

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await handleResponse(res);
  return { clubs: data.clubs as Organization[], count: data.count as number };
}

export async function fetchClub(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await handleResponse(res);
  return data as { club: Organization; history: { status: string; changed_at: string }[] };
}

export async function createClub(
  payload: OrganizationInsert
): Promise<Organization> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data.club as Organization;
}

export async function updateClub(
  id: string,
  payload: OrganizationUpdate
): Promise<Organization> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data.club as Organization;
}

export async function approveClub(id: string): Promise<Organization> {
  return updateClub(id, { status: "approved" } as OrganizationUpdate);
}

export async function rejectClub(id: string): Promise<Organization> {
  return updateClub(id, { status: "rejected" } as OrganizationUpdate);
}

export async function deleteClub(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  await handleResponse(res);
}
