"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Event } from "../types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from("events").select("*");
      if (!error && data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return { events, loading };
}
