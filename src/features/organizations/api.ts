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

export async function fetchClubs(): Promise<Organization[]> {
  const res = await fetch("/api/organizations");
  const data = await handleResponse(res);
  return data.organizations as Organization[];
}

export async function createClub(
  payload: OrganizationInsert
): Promise<Organization> {
  const res = await fetch("/api/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data.organization as Organization;
}

export async function updateClub(
  id: string,
  payload: OrganizationUpdate
): Promise<Organization> {
  const res = await fetch(`/api/organizations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return data.organization as Organization;
}

export async function deleteClub(id: string): Promise<void> {
  const res = await fetch(`/api/organizations/${id}`, {
    method: "DELETE",
  });
  await handleResponse(res);
}

