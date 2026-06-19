// File: src/app/admin/events/page.tsx
import { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/auth";
import EventsExplorer from "@/components/EventsExplorer";
import type { EventRecord } from "@/lib/types";
import type { Database } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Events – Institution Admin",
};

type EventRow = Database["public"]["Tables"]["events"]["Row"] & {
  organizations: { name: string } | null;
};

interface EventsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const supabase = await getSupabaseServerClient();
  // const { data } = await supabase
  //   .from("events")
  //   .select("*, organizations(name)");

     const { status } = await searchParams;

     let query = supabase.from("events").select("*, organizations(name)");
     const allowedStatuses = ["approved", "pending", "rejected"] as const;
     type AllowedStatus = (typeof allowedStatuses)[number];
     if (status && allowedStatuses.includes(status as AllowedStatus)) {
       query = query.eq("status", status as AllowedStatus);
     }

     const { data } = await query;

  const events: EventRecord[] = ((data as EventRow[]) || []).map((ev) => ({
    id: ev.event_id,
    title: ev.title,
    date: ev.start_date,
    status: ev.status as EventRecord["status"],
    organizer: ev.organizations?.name || "",
    description: ev.description,
    location: { lat: ev.latitude, lng: ev.longitude },
    start: ev.start_date,
    end: ev.end_date,
    imageUrl: ev.image_url,
    visibility: ev.visibility_level,
  }));

  return (
    <section className="p-5 bg-background min-h-full">
      <EventsExplorer events={events} />
    </section>
  );
}
