"use client";

import { useCallback, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// Shared, batched store of public "going" counts per event.
//
// Counts come from the event_attendance_counts RPC (SECURITY DEFINER, so it
// sees all attendees despite RLS). Requests made within the same microtask are
// coalesced into a single RPC call, so a page of cards resolves all its counts
// in one round-trip. The current user's RSVP toggles adjust counts optimistically.

const counts = new Map<string, number>();
const pending = new Set<string>();
const listeners = new Set<() => void>();
let flushScheduled = false;

const UNKNOWN = -1;

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
      const { data } = await supabase.rpc("event_attendance_counts", { ids });
      const rows = (data as { event_id: string; count: number }[] | null) ?? [];
      for (const row of rows) counts.set(row.event_id, row.count);
      // Events with no attendees aren't returned by the RPC — record them as 0.
      for (const id of ids) if (!counts.has(id)) counts.set(id, 0);
    } catch {
      for (const id of ids) if (!counts.has(id)) counts.set(id, 0);
    }
    emit();
  });
}

function request(id: string) {
  if (counts.has(id) || pending.has(id)) return;
  pending.add(id);
  scheduleFlush();
}

/** Subscribe to an event's "going" count. Returns -1 until first resolved. */
export function useEventCount(eventId: string): number {
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
    () => counts.get(eventId) ?? UNKNOWN,
    [eventId]
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => UNKNOWN);
}

/** Optimistically nudge a count (called when the current user RSVPs/cancels). */
export function adjustEventCount(eventId: string, delta: number) {
  const current = counts.get(eventId);
  if (current === undefined) return; // not loaded yet; RPC will fetch the truth
  counts.set(eventId, Math.max(0, current + delta));
  emit();
}
