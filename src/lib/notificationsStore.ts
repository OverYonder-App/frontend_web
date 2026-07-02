"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// Shared store of the current user's in-app notifications. Rows are written only
// by SECURITY DEFINER triggers (see migration 20260611120010); the client just
// reads its own rows (RLS: user_id = auth.uid()) and marks them read. Loads once
// the first time the bell subscribes; `refresh()` re-pulls (called when the bell
// opens) so newly arrived notifications show without a full reload. Mirrors the
// favoritesStore / friendsStore pattern.

export interface NotificationItem {
  notification_id: string;
  type: string;
  actor_id: string | null;
  event_id: string | null;
  read: boolean;
  created_at: string;
  actor: {
    first_name: string | null;
    last_name: string | null;
    username: string;
  } | null;
  event: { title: string } | null;
}

const SELECT =
  "notification_id, type, actor_id, event_id, read, created_at, " +
  "actor:users!notifications_actor_id_fkey(first_name, last_name, username), " +
  "event:events(title)";

let items: NotificationItem[] | null = null;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function load() {
  const { data } = await supabase
    .from("notifications")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(50);
  items = (data as unknown as NotificationItem[] | null) ?? [];
}

function ensureLoaded() {
  if (items || loadPromise) return;
  loadPromise = load()
    .catch(() => {
      items = [];
    })
    .finally(emit);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  ensureLoaded();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return items;
}

/** The current user's notifications (newest first), or null while loading. */
export function useNotifications(): NotificationItem[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Count of unread notifications. */
export function useUnreadCount(): number {
  const list = useNotifications();
  return (list ?? []).reduce((n, item) => n + (item.read ? 0 : 1), 0);
}

/** Re-fetch from the server (e.g. when the bell is opened). */
export async function refreshNotifications(): Promise<void> {
  await load().catch(() => {});
  emit();
}

/** Optimistically mark every unread notification read; reverts on failure. */
export async function markAllRead(): Promise<void> {
  if (!items || !items.some((n) => !n.read)) return;
  const prev = items;
  items = items.map((n) => (n.read ? n : { ...n, read: true }));
  emit();
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false); // RLS already scopes this to the current user's rows
    if (error) throw error;
  } catch {
    items = prev;
    emit();
  }
}
