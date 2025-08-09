import { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/auth";
import type { EventRecord } from "@/lib/types";
import type { Database } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Event Templates – Institution Admin",
};

type EventRow = Database["public"]["Tables"]["events"]["Row"] & {
  organizations: { name: string } | null;
};

export default async function EventTemplatesPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select("*, organizations(name)")
    .eq("status", "template");

  const templates: EventRecord[] = ((data as EventRow[]) || []).map((ev) => ({
    id: ev.event_id,
    title: ev.title,
    organizer: ev.organizations?.name || "",
  }));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Event Templates</h1>
      <div className="overflow-auto rounded-lg border border-border bg-card shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Organizer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-muted">
                <td className="px-4 py-2 text-sm">{t.title}</td>
                <td className="px-4 py-2 text-sm">{t.organizer}</td>
                <td className="px-4 py-2 text-sm">
                  <Link href={`/dashboard/institution-admin/events/create?template=${t.id}`} className="text-primary hover:underline">
                    Use Template
                  </Link>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No templates yet...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
