import type { Database } from "@/lib/database.types";
import { getBaseUrl } from "@/lib/utils";


// The events API embeds the organization name (select "*, organization:organizations(name)").
export type EventRecord = Database["public"]["Tables"]["events"]["Row"] & {
  organization?: { name: string | null } | null;
};
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type EventAttendee = Database["public"]["Tables"]["event_attendance"]["Row"] & {
  users?: Database["public"]["Tables"]["users"]["Row"] | null;
};

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

const BASE_URL = `${getBaseUrl()}/api/events`;

export interface FetchEventsOptions {
  status?: string;
  search?: string;
  page?: number;
  creatorId?: string;
  participantId?: string;
  range?: string;
}

export async function fetchEvents(
  options: FetchEventsOptions = {}
): Promise<{ events: EventRecord[]; count: number }> {
  const params = new URLSearchParams();
  if (options.status) params.append("status", options.status);
  if (options.search) params.append("q", options.search);
  if (options.page) params.append("page", String(options.page));
  if (options.creatorId) params.append("creator", options.creatorId);
  if (options.participantId) params.append("participant", options.participantId);
  if (options.range) params.append("range", options.range);

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    credentials: "include",
  });
  const data = await handleResponse(res);
  return { events: data.events as EventRecord[], count: data.count as number };
}

export async function fetchEvent(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: "include" });
  return (await handleResponse(res)) as { event: EventRecord };
}

export async function fetchEventAttendees(id: string): Promise<EventAttendee[]> {
  const res = await fetch(`${BASE_URL}/${id}/attendees`, {
    credentials: "include",
  });
  const data = await handleResponse(res);
  return data.attendees as EventAttendee[];
}

export async function createEvent(
  payload: EventInsert
): Promise<EventRecord> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await handleResponse(res);
  return data.event as EventRecord;
}

export async function updateEvent(
  id: string,
  payload: EventUpdate
): Promise<EventRecord> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const data = await handleResponse(res);
  return data.event as EventRecord;
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
}

export async function approveEvent(id: string): Promise<EventRecord> {
  return updateEvent(id, { status: "approved" } as EventUpdate);
}

export async function rejectEvent(id: string): Promise<EventRecord> {
  return updateEvent(id, { status: "rejected" } as EventUpdate);
}
