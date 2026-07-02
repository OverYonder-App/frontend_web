"use client";

import { useCallback, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// Shared, batched store of how many of the current user's friends are going to
// each event — the social-proof signal behind the friends feature.
//
// Data comes from the event_friends_going RPC (SECURITY DEFINER, scoped to the
// caller's accepted friends so it can see attendance despite RLS). Requests made
// within the same microtask are coalesced into a single RPC call, so a page of
// cards resolves all its friend counts in one round-trip. Mirrors eventCounts.

export interface FriendsGoing {
  count: number;
  names: string[];
}

// Stable shared references so getSnapshot returns the same object identity until
// real data arrives (required by useSyncExternalStore to avoid render loops).
const UNKNOWN: FriendsGoing = Object.freeze({ count: -1, names: [] });
const EMPTY: FriendsGoing = Object.freeze({ count: 0, names: [] });

const data = new Map<string, FriendsGoing>();
const pending = new Set<string>();
const listeners = new Set<() => void>();
let flushScheduled = false;

function emit() {
  listeners.forEach((l) => l());
}

function scheduleFlush() {
  if (flushScheduled) return;
  flushScheduled = true;
  queueMicrotask(async () => {
    flushScheduled = false;
    const ids = [...pending];
    pending.clear();
    if (ids.length === 0) return;
    try {
      const { data: rows } = await supabase.rpc("event_friends_going", { ids });
      const list =
        (rows as { event_id: string; count: number; names: string[] }[] | null) ??
        [];
      for (const row of list)
        data.set(row.event_id, { count: row.count, names: row.names ?? [] });
      // Events with no friends going aren't returned by the RPC — record 0.
      for (const id of ids) if (!data.has(id)) data.set(id, EMPTY);
    } catch {
      for (const id of ids) if (!data.has(id)) data.set(id, EMPTY);
    }
    emit();
  });
}

function request(id: string) {
  if (data.has(id) || pending.has(id)) return;
  pending.add(id);
  scheduleFlush();
}

/**
 * Subscribe to how many of the current user's friends are attending an event.
 * Returns { count: -1, names: [] } until first resolved.
 */
export function useFriendsGoing(eventId: string): FriendsGoing {
  const subscribe = useCallback(
    (cb: () => void) => {
      listeners.add(cb);
      request(eventId);
      return () => {
        listeners.delete(cb);
      };
    },
    [eventId]
  );
  const getSnapshot = useCallback(
    () => data.get(eventId) ?? UNKNOWN,
    [eventId]
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => UNKNOWN);
}
