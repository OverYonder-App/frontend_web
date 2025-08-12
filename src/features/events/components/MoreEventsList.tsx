"use client";

import { useEffect, useRef, useState } from "react";
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

export default function MoreEventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadEvents(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((p) => p + 1);
      }
    });
    const current = loadMoreRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  async function loadEvents(p: number) {
    setLoading(true);
    const currentLength = events.length;
    try {
      const res = await fetch(
        `/api/events?page=${p}&status=approved&sort=start_date&order=asc`,
        { credentials: "include" }
      );
      const json = await res.json();
      const newEvents = (json.events || []).map((e: ApiEvent) => ({
        id: e.event_id,
        title: e.title,
        date: formatDate(e.start_date),
        location: e.address ?? "",
        image: e.image_url ?? "https://picsum.photos/seed/picsum/800/500",
        host: e.organization?.name || "",
        attendees: [],
      }));
      setEvents((prev) => [...prev, ...newEvents]);
      const total = json.count ?? 0;
      setHasMore(currentLength + newEvents.length < total);
    } finally {
      setLoading(false);
    }
  }

  if (loading && events.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <EventSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && events.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">No events yet...</div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {loading && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      )}
      <div ref={loadMoreRef} />
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            className="text-sm text-primary underline"
            onClick={() => setPage((p) => p + 1)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

