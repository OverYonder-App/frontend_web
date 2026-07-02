"use server"
import type { Database } from "@/lib/database.types";
import { getBaseUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export type AnnouncementRecord = Database["public"]["Tables"]["announcements"]["Row"] & {
  users?: {
    first_name: string | null;
    last_name: string | null;
    roles: { role_name: string } | null;
  } | null;
};

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

const BASE_URL = `${getBaseUrl()}/api/announcements`;

export async function fetchAnnouncements(): Promise<AnnouncementRecord[]> {
  const opts: RequestInit = { credentials: "include" };

  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    opts.headers = { Cookie: cookieStore.toString() };
  }

  const res = await fetch(BASE_URL, opts);
  const data = await handleResponse(res);
  return data.announcements as AnnouncementRecord[];
}
