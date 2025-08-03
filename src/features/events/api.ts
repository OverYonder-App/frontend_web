import type { Database } from "@/lib/database.types";
import { getBaseUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export type EventRecord = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

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
}

export async function fetchEvents(
  options: FetchEventsOptions = {}
): Promise<{ events: EventRecord[]; count: number }> {
  const params = new URLSearchParams();
  if (options.status) params.append("status", options.status);
  if (options.search) params.append("q", options.search);
  if (options.page) params.append("page", String(options.page));

  const opts: RequestInit = { credentials: "include" };
  if (typeof window === "undefined") {
    opts.headers = { Cookie: cookies().toString() };
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, opts);
  const data = await handleResponse(res);
  return { events: data.events as EventRecord[], count: data.count as number };
}

export async function fetchEvent(id: string) {
  const opts: RequestInit = { credentials: "include" };
  if (typeof window === "undefined") {
    opts.headers = { Cookie: cookies().toString() };
  }

  const res = await fetch(`${BASE_URL}/${id}`, opts);
  return (await handleResponse(res)) as { event: EventRecord };
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
