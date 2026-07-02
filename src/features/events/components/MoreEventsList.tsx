"use client";

import { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";
import EventSkeleton from "./EventSkeleton";
import type { Event } from "../types";
import { fetchEvents, type EventRecord } from "../api";

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

export default function MoreEventsList({
  range = "week",
}: {
  range?: "week" | "month";
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { events: fetched, count } = await fetchEvents({
          page,
          status: "approved",
          range,
        });
        setEvents((prev) => {
          const newEvents = fetched.map((e: EventRecord) => ({
            id: e.event_id,
            title: e.title,
            date: formatDate(e.start_date),
            location: e.address ?? "",
            image: e.image_url ?? "https://picsum.photos/seed/picsum/800/500",
            host: e.organization?.name || "",
            attendees: [],
          }));
          // Page 1 replaces instead of appending so the effect re-running
          // (StrictMode, range reset) can't duplicate entries; later pages
          // skip ids already in the list.
          const base = page === 1 ? [] : prev;
          const seen = new Set(base.map((e) => e.id));
          const updated = [
            ...base,
            ...newEvents.filter((e: Event) => !seen.has(e.id)),
          ];
          setHasMore(updated.length < count);
          return updated;
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, range]);

  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
  }, [range]);

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

