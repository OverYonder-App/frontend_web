"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// Shared store of the current user's friend_requests rows. A friendship is a
// single directional row (PK = requester_id, receiver_id) with bidirectional
// meaning, so we load every row where I'm the requester OR the receiver and
// derive the relationship for any user from it. Loads once the first time a
// component subscribes and is kept in sync optimistically so every button for a
// given user reflects the same state. Writes go straight through the browser
// client — the friend_requests RLS policies protect them. Mirrors favoritesStore.

export type FriendStatus = "sent" | "accepted" | "blocked";

export interface FriendRow {
  requester_id: string;
  receiver_id: string;
  status: FriendStatus;
}

export type Friendship =
  | "loading"
  | "self"
  | "none"
  | "outgoing" // I sent a request that's still pending
  | "incoming" // they sent me a request that's still pending
  | "friends"
  | "blocked";

let rows: FriendRow[] | null = null;
let myId: string | null = null;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  // Replace the array reference so useSyncExternalStore sees a new snapshot.
  rows = rows ? [...rows] : rows;
  listeners.forEach((l) => l());
}

function ensureLoaded() {
  if (rows || loadPromise) return;
  loadPromise = (async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    myId = user?.id ?? null;
    if (!myId) {
      rows = [];
      return;
    }
    const { data } = await supabase
      .from("friend_requests")
      .select("requester_id, receiver_id, status")
      .or(`requester_id.eq.${myId},receiver_id.eq.${myId}`);
    rows = (data ?? []) as FriendRow[];
  })()
    .catch(() => {
      rows = [];
    })
    .finally(() => {
      listeners.forEach((l) => l());
    });
}

async function waitLoaded() {
  ensureLoaded();
  if (loadPromise) await loadPromise;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  ensureLoaded();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return rows;
}

/** All of the current user's friend_requests rows, or null while loading. */
export function useFriendRows(): FriendRow[] | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** The signed-in user's id, or null until the store has loaded. */
export function useMyId(): string | null {
  useFriendRows(); // subscribe so this re-renders once the load resolves
  return myId;
}

function rowBetween(otherId: string): FriendRow | undefined {
  return (rows ?? []).find(
    (r) =>
      (r.requester_id === myId && r.receiver_id === otherId) ||
      (r.requester_id === otherId && r.receiver_id === myId)
  );
}

/** The current user's relationship to `otherId`, derived from the loaded rows. */
export function useFriendship(otherId: string): Friendship {
  const current = useFriendRows();
  if (current === null) return "loading";
  if (otherId === myId) return "self";
  const row = rowBetween(otherId);
  if (!row) return "none";
  if (row.status === "accepted") return "friends";
  if (row.status === "blocked") return "blocked";
  return row.requester_id === myId ? "outgoing" : "incoming";
}

/** Send a friend request to `otherId` (insert status='sent'). */
export async function sendFriendRequest(otherId: string): Promise<void> {
  await waitLoaded();
  if (!myId) throw new Error("Not signed in");

  const optimistic: FriendRow = {
    requester_id: myId,
    receiver_id: otherId,
    status: "sent",
  };
  rows = [...(rows ?? []), optimistic];
  emit();

  try {
    const { error } = await supabase
      .from("friend_requests")
      .insert({ requester_id: myId, receiver_id: otherId, status: "sent" });
    if (error) throw error;
  } catch (err) {
    rows = (rows ?? []).filter(
      (r) => !(r.requester_id === myId && r.receiver_id === otherId)
    );
    emit();
    throw err;
  }
}

/** Accept an incoming request from `otherId` (update status to 'accepted'). */
export async function acceptFriendRequest(otherId: string): Promise<void> {
  await waitLoaded();
  if (!myId) throw new Error("Not signed in");

  const prev = rows;
  rows = (rows ?? []).map((r) =>
    r.requester_id === otherId && r.receiver_id === myId
      ? { ...r, status: "accepted" as const }
      : r
  );
  emit();

  try {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("requester_id", otherId)
      .eq("receiver_id", myId);
    if (error) throw error;
  } catch (err) {
    rows = prev;
    emit();
    throw err;
  }
}

/**
 * Remove the single row between me and `otherId` in either direction. Backs the
 * three "tear down the connection" actions, which are all deletes per the
 * schema: reject an incoming request, cancel a sent request, and unfriend.
 */
export async function removeFriendship(otherId: string): Promise<void> {
  await waitLoaded();
  if (!myId) throw new Error("Not signed in");

  const prev = rows;
  rows = (rows ?? []).filter(
    (r) =>
      !(
        (r.requester_id === myId && r.receiver_id === otherId) ||
        (r.requester_id === otherId && r.receiver_id === myId)
      )
  );
  emit();

  try {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .or(
        `and(requester_id.eq.${myId},receiver_id.eq.${otherId}),` +
          `and(requester_id.eq.${otherId},receiver_id.eq.${myId})`
      );
    if (error) throw error;
  } catch (err) {
    rows = prev;
    emit();
    throw err;
  }
}
