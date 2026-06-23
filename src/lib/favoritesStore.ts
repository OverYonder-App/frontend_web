"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

// Shared store of the current user's saved (favorited) event ids. Loads once
// the first time a FavoriteButton subscribes and is kept in sync optimistically
// so every card for a given event reflects the same state. Writes go straight
// to user_event_favorites (protected by the "Manage own favorites" RLS policy).

let favorites: Set<string> | null = null;
let userId: string | null = null;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  favorites = favorites ? new Set(favorites) : favorites;
  listeners.forEach((l) => l());
}

function ensureLoaded() {
  if (favorites || loadPromise) return;
  loadPromise = (async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
    if (!userId) {
      favorites = new Set();
      return;
    }
    const { data } = await supabase
      .from("user_event_favorites")
      .select("event_id")
      .eq("user_id", userId);
    favorites = new Set((data ?? []).map((r) => r.event_id));
  })()
    .catch(() => {
      favorites = new Set();
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
  return favorites;
}

/** Set of saved event ids, or null while still loading. */
export function useFavorites(): Set<string> | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** Optimistically save/unsave an event, reverting on failure. */
export async function toggleFavorite(eventId: string, save: boolean): Promise<void> {
  if (!favorites) favorites = new Set();
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }
  if (!userId) throw new Error("Not signed in");

  if (save) favorites.add(eventId);
  else favorites.delete(eventId);
  emit();

  try {
    if (save) {
      const { error } = await supabase
        .from("user_event_favorites")
        .upsert(
          { user_id: userId, event_id: eventId },
          { onConflict: "user_id,event_id", ignoreDuplicates: true }
        );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("user_event_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("event_id", eventId);
      if (error) throw error;
    }
  } catch (err) {
    if (save) favorites.delete(eventId);
    else favorites.add(eventId);
    emit();
    throw err;
  }
}
