import { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/auth";
import type { EventRecord } from "@/lib/types";
import type { Database } from "@/lib/database.types";
import EventApprovalButtons from "@/components/EventApprovalButtons";

export const metadata: Metadata = {
  title: "Pending Events – Institution Admin",
};

type EventRow = Database["public"]["Tables"]["events"]["Row"] & {
  organizations: { name: string } | null;
};

export default async function PendingEventsPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("status", "pending");

  const events: EventRecord[] = ((data as EventRow[]) || []).map((ev) => ({
    id: ev.event_id,
    title: ev.title,
    date: ev.start_date,
    organizer: ev.organizations?.name || "",
  }));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Events</h1>
      <div className="overflow-auto rounded-lg border bg-white shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Organizer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{e.title}</td>
                <td className="px-4 py-2 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-sm">{e.organizer}</td>
                <td className="px-4 py-2 text-sm">
                  <EventApprovalButtons eventId={e.id} />
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
