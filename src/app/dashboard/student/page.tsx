"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventCard from "@/features/events/components/EventCard";
import StudentLayout from "../StudentLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Event } from "@/features/events/types";
import type { Database } from "@/lib/database.types";

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

export default function StudentHomeYonderView() {
  const { user } = useCurrentUser();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (!user?.institution_id) return;
    async function loadEvents() {
      type EventRow = Database["public"]["Tables"]["events"]["Row"] & {
        organization?: { name: string | null } | null;
      };

      const { data } = await supabase
        .from("events")
        .select(
          "event_id, title, start_date, address, image_url, organization:organizations(name)"
        )
        .eq("institution_id", user?.institution_id)
        .eq("status", "approved")
        .order("start_date", { ascending: true });
      if (data) {
        const mapped = (data as unknown as EventRow[]).map((e) => ({
          id: e.event_id,
          title: e.title,
          date: formatDate(e.start_date),
          location: e.address ?? "",
          image: e.image_url ?? "https://picsum.photos/seed/picsum/800/500",
          host: e.organization?.name || "",
          attendees: [],
        }));
        setEvents(mapped);
      }
    }
    loadEvents();
  }, [user]);

  return (
    <StudentLayout>
      <main className="min-h-screen bg-[#f9f9ff] p-4 md:p-8">
        <header className="mb-4 md:mb-6">
          <h1 className="text-2xl font-bold text-primary">
            What’s happening at your campus
          </h1>
        </header>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList className="bg-[#eee6f7] rounded-lg p-2 w-full max-w-lg flex gap-2">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="groups">
            <div className="text-center text-sm text-gray-500 pt-10">
              Groups view coming soon...
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="text-center text-sm text-gray-500 pt-10">
              No new announcements right now.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </StudentLayout>
  );
}
