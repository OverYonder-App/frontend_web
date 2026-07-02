import { Metadata } from "next";
import Link from "next/link";
import type { EventRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Event Templates – Institution Admin",
};

export default async function EventTemplatesPage() {
  // The events.status enum has no "template" value, so there is nothing to
  // query yet; the previous status=template filter always errored and
  // rendered an empty list.
  const templates: EventRecord[] = [];

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
