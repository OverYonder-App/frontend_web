"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import EventSkeleton from "./EventSkeleton";
import type { Event } from "../types";

interface ApiEvent {
  event_id: string;
  title: string;
  start_date: string;
  address?: string | null;
  image_url?: string | null;
  organization?: { name: string | null } | null;
}

const formatDate = (iso: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
};

export default function HottestEventsCarousel({
  range = "week",
}: {
  range?: "week" | "month";
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/events?status=approved&sort=start_date&order=desc&range=${range}`,
          { credentials: "include" }
        );
        const json = await res.json();
        const mapped = (json.events || []).map((e: ApiEvent) => ({
          id: e.event_id,
          title: e.title,
          date: formatDate(e.start_date),
          location: e.address ?? "",
          image: e.image_url ?? "https://picsum.photos/seed/picsum/800/500",
          host: e.organization?.name || "",
          attendees: [],
        }));
        setEvents(mapped);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range]);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="min-w-[250px]">
            <EventSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">No events yet...</div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {events.map((event) => (
        <div key={event.id} className="min-w-[250px]">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}

