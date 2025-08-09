import type { Database } from "@/lib/database.types";
import { getBaseUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export type UserRecord = Database["public"]["Tables"]["users"]["Row"];

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

const BASE_URL = `${getBaseUrl()}/api/users`;

export async function fetchUsers(): Promise<UserRecord[]> {
  const opts: RequestInit = { credentials: "include" };

  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    opts.headers = { Cookie: cookieStore.toString() };
  }

  const res = await fetch(BASE_URL, opts);
  const data = await handleResponse(res);
  return data.users as UserRecord[];
}
