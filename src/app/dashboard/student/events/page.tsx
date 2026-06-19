"use client";

import { useEffect, useState } from "react";
import StudentLayout from "@/app/dashboard/StudentLayout";
import EventCard from "@/features/events/components/EventCard";
import EventSkeleton from "@/features/events/components/EventSkeleton";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Event } from "@/features/events/types";

interface EventRow {
  event_id: string;
  title: string;
  start_date: string;
  address: string | null;
  image_url: string | null;
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

const toEvent = (e: EventRow): Event => ({
  id: e.event_id,
  title: e.title,
  date: formatDate(e.start_date),
  location: e.address ?? "",
  image: e.image_url ?? undefined,
  host: e.organization?.name || "",
  attendees: [],
});

export default function StudentEventsPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [created, setCreated] = useState<Event[]>([]);
  const [saved, setSaved] = useState<Event[]>([]);
  const [attending, setAttending] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      const select = "event_id,title,start_date,address,image_url,organization:organizations(name)";

      const [createdRes, savedRes, attendingRes] = await Promise.all([
        supabase
          .from("events")
          .select(select)
          .eq("created_by", user!.id)
          .order("start_date", { ascending: true }),
        supabase
          .from("user_event_favorites")
          .select(`events(${select})`)
          .eq("user_id", user!.id),
        supabase
          .from("event_attendance")
          .select(`events(${select})`)
          .eq("user_id", user!.id),
      ]);

      setCreated(((createdRes.data as EventRow[] | null) ?? []).map(toEvent));

      const savedRows =
        (savedRes.data as { events: EventRow | null }[] | null) ?? [];
      setSaved(
        savedRows
          .map((r) => r.events)
          .filter((e): e is EventRow => !!e)
          .map(toEvent)
      );

      const attendingRows =
        (attendingRes.data as { events: EventRow | null }[] | null) ?? [];
      setAttending(
        attendingRows
          .map((r) => r.events)
          .filter((e): e is EventRow => !!e)
          .map(toEvent)
      );

      setLoading(false);
    }
    load();
  }, [user, userLoading]);

  const Section = ({ title, events }: { title: string; events: Event[] }) => (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {events.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <StudentLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Your Events</h1>
        <p className="text-sm text-muted-foreground">
          Events you’ve saved and events you’ve created.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <Section title="Events you're attending" events={attending} />
          <Section title="Saved events" events={saved} />
          <Section title="Events you created" events={created} />
        </div>
      )}
    </StudentLayout>
  );
}
