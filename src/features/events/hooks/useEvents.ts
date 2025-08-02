"use client";
import { useEffect, useState } from "react";
import { fetchEvents, type EventRecord } from "../api";

export function useEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(({ events }) => setEvents(events))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}
