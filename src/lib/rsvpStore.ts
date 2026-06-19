"use client";

import { useSyncExternalStore } from "react";

// A tiny shared store for the current user's RSVP'd event ids. It loads once
// (the first time any RsvpButton subscribes) and is kept in sync optimistically
// so every button for a given event reflects the same state without each one
// hitting the network.

let attending: Set<string> | null = null;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  // Replace the Set reference so useSyncExternalStore sees a new snapshot.
  attending = attending ? new Set(attending) : attending;
  listeners.forEach((l) => l());
}

function ensureLoaded() {
  if (attending || loadPromise) return;
  loadPromise = fetch("/api/events/attending", { credentials: "include" })
    .then((r) => (r.ok ? r.json() : { eventIds: [] }))
    .then((d: { eventIds?: string[] }) => {
      attending = new Set(d.eventIds ?? []);
    })
    .catch(() => {
      attending = new Set();
    })
    .finally(() => {
      listeners.forEach((l) => l());
    });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  ensureLoaded();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return attending;
}

/** Returns the set of RSVP'd event ids, or null while still loading. */
export function useAttending(): Set<string> | null {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null // server snapshot: nothing loaded during SSR
  );
}

/**
 * Toggle the current user's RSVP for an event. Optimistically updates the
 * store, then calls the API and reverts on failure.
 */
export async function toggleRsvp(eventId: string, going: boolean): Promise<void> {
  if (!attending) attending = new Set();
  if (going) attending.add(eventId);
  else attending.delete(eventId);
  emit();

  try {
    const res = await fetch(`/api/events/${eventId}/attendees`, {
      method: going ? "POST" : "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("RSVP request failed");
  } catch (err) {
    // revert
    if (going) attending.delete(eventId);
    else attending.add(eventId);
    emit();
    throw err;
  }
}

/** Seed the store with a known state (e.g. from a server-rendered page). */
export function primeAttending(eventIds: string[]) {
  if (attending) return; // don't clobber an already-loaded set
  attending = new Set(eventIds);
  loadPromise = Promise.resolve();
  listeners.forEach((l) => l());
}
