// File: src/components/EventsExplorer.tsx
"use client";

import React, { useState, Fragment, useEffect } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import Link from "next/link";
import type { EventRecord } from "@/lib/types";
import { Eye, Grid, List, Menu, PencilIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ViewMode = "cards" | "list" | "compact";
type SortKey = "date" | "title";

// const TABS = ["All Events", "Pending", "Rejected"] as const;
const TABS = ["All Events", "Approved", "Pending", "Rejected"] as const;

type TabKey = (typeof TABS)[number];

const MODE_CONFIG: Record<
  ViewMode,
  { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  cards: { label: "Card View", Icon: Grid },
  list: { label: "List View", Icon: List },
  compact: { label: "Compact View", Icon: Menu },
};

const tabToStatus: Record<TabKey, string | null> = {
  "All Events": null,
  Approved: "approved",
  Pending: "pending",
  Rejected: "rejected",
};

const statusToTab = (status: string | null): TabKey => {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    default:
      return "All Events";
  }
};

const statusStyles: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  template: "bg-gray-100 text-gray-800",
};

export default function EventsExplorer({ events }: { events: EventRecord[] }) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [eventsList, setEventsList] = useState<EventRecord[]>(events);
  // const [selectedTab, setSelectedTab] = useState<TabKey>("All Events");
  const [selectedTab, setSelectedTab] = useState<TabKey>(() =>
    statusToTab(searchParams.get("status"))
  );
  const [mode, setMode] = useState<ViewMode>("cards");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");

  useEffect(() => {
    setSelectedTab(statusToTab(searchParams.get("status")));
  }, [searchParams]);

  useEffect(() => {
    setEventsList(events);
  }, [events]);

  const handleTabChange = (i: number) => {
    const tab = TABS[i];
    setSelectedTab(tab);
    const status = tabToStatus[tab];
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  // 1) filter by tab
  const filteredByTab = eventsList.filter((e) => {
    if (selectedTab === "All Events") return true;
    if (selectedTab === "Approved") return e.status === "approved";
    if (selectedTab === "Pending") return e.status === "pending";
    if (selectedTab === "Rejected") return e.status === "rejected";
    return true;
  });

  // 2) search + sort
  const filtered = filteredByTab
    .filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortKey === "date"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : a.title.localeCompare(b.title)
    );

  return (
    <div className="space-y-6 p-6 bg-background min-h-full">
      {/* ─── Tabs & Toolbar ───────────────────────────────────── */}
      <TabGroup
        selectedIndex={TABS.indexOf(selectedTab)}
        // onChange={(i) => setSelectedTab(TABS[i])}
        onChange={handleTabChange}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Tabs */}
          <TabList className="inline-flex overflow-hidden rounded-lg bg-card border border-border">
            {TABS.map((tab) => (
              <Tab as={Fragment} key={tab}>
                {({ selected }) => (
                  <button
                    className={`px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                )}
              </Tab>
            ))}
          </TabList>

          {/* Right Controls: View Modes + Plus Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="inline-flex overflow-hidden rounded-full border border-border bg-card">
              {(Object.keys(MODE_CONFIG) as ViewMode[]).map((m) => {
                const { label, Icon } = MODE_CONFIG[m];
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Plus Button */}
            <Link
              href="/dashboard/institution-admin/events/create"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow"
              aria-label="Create new event"
            >
              +
            </Link>
          </div>
        </div>

        {/* Search + Sort remains below */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary"
            />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-border rounded-xl px-3 py-2 shadow-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </TabGroup>

      {/* ─── Content ─────────────────────────────────────────── */}
      {mode === "cards" && <CardView events={filtered} />}
      {mode === "list" && <ListView events={filtered} />}
      {mode === "compact" && <CompactView events={filtered} />}
    </div>
  );
}

function CardView({ events }: { events: EventRecord[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((e) => (
        <div
          key={e.id}
          className="relative bg-card rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-1">{e.title}</h2>
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(e.start ?? e.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {e.start && (
              <>
                {" "}
                {new Date(e.start).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {e.end &&
                  ` - ${new Date(e.end).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
              </>
            )}
          </p>
          <span
            className={`
              inline-block px-3 py-1 rounded-full text-xs font-medium
              ${statusStyles[e.status]}
            `}
          >
            {e.status.toUpperCase()}
          </span>
          <p className="mt-3 text-sm text-foreground">
            Organizer: <span className="font-medium">{e.organizer}</span>
          </p>
          {e.creator && (
            <p className="mt-1 text-xs text-muted-foreground">Created by {e.creator}</p>
          )}
          <div className="absolute top-7 right-6 space-x-2 flex">
            <Link
              href={`/event/${e.id}`}
              className="text-primary hover:text-primary/80 transition"
              aria-label={`View ${e.title}`}
            >
              <Eye size={12} />
            </Link>
            <Link
              href={`/dashboard/institution-admin/events/${e.id}/edit`}
              className="text-primary hover:text-primary/80 transition"
              aria-label={`Edit ${e.title}`}
            >
              <PencilIcon size={12} />
            </Link>
            {/* <button
              onClick={() =>
                fetch(`/api/events/${e.id}/report`, {
                  method: "POST",
                  credentials: "include",
                })
              }
              className="text-red-600 hover:text-red-800 transition text-sm"
            >
              Report
            </button> */}
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <div className="col-span-full text-center py-20 text-muted-foreground">
          No events yet...
        </div>
      )}
    </div>
  );
}

function ListView({ events }: { events: EventRecord[] }) {
  return (
    <div className="overflow-auto rounded-lg border border-border bg-card shadow">
      <table className="min-w-full divide-y bg-card">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Title</th>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Organizer</th>
            <th className="px-4 py-2 text-left font-medium">Creator</th>
            <th className="px-4 py-2 text-left font-medium">Edit</th>
            <th className="px-4 py-2 text-left font-medium">Report</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-card">
          {events.map((e) => (
            <tr key={e.id} className="hover:bg-muted">
              <td className="px-4 py-2">{e.title}</td>
              <td className="px-4 py-2">
                {new Date(e.start ?? e.date).toLocaleDateString()}
                {e.start && (
                  <>
                    {" "}
                    {new Date(e.start).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {e.end &&
                      ` - ${new Date(e.end).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                  </>
                )}
              </td>
              <td className="px-4 py-2 capitalize">{e.status}</td>
              <td className="px-4 py-2">{e.organizer}</td>
              <td className="px-4 py-2">{e.creator ?? "Unknown"}</td>
              <td className="px-4 py-2">
                <Link
                  href={`/dashboard/institution-admin/events/${e.id}/edit`}
                  className="text-primary hover:underline"
                >
                  Edit
                </Link>
              </td>
              {/* <td className="px-4 py-2">
                <button
                  onClick={() =>
                    fetch(`/api/events/${e.id}/report`, {
                      method: "POST",
                      credentials: "include",
                    })
                  }
                  className="text-red-600 hover:underline"
                >
                  Report
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {events.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">No events yet...</div>
      )}
    </div>
  );
}

function CompactView({ events }: { events: EventRecord[] }) {
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between bg-card rounded-lg p-3 shadow hover:bg-muted transition"
        >
          <div className="flex-1">
            <p className="font-medium truncate">{e.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(e.start ?? e.date).toLocaleDateString()}
              {e.start && (
                <>
                  {" "}
                  {new Date(e.start).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {e.end &&
                    ` - ${new Date(e.end).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/institution-admin/events/${e.id}/edit`}
              className="text-primary hover:underline text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() =>
                fetch(`/api/events/${e.id}/report`, {
                  method: "POST",
                  credentials: "include",
                })
              }
              className="text-red-600 hover:underline text-sm"
            >
              Report
            </button>
          </div>
        </li>
      ))}
      {events.length === 0 && (
        <li className="text-center py-6 text-muted-foreground">No events yet...</li>
      )}
    </ul>
  );
}
