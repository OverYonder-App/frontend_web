"use client";

import React, { useEffect, useState, Fragment } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import Link from "next/link";
import type { Organization } from "@/features/organizations/api";
import { Eye, Grid, List, Menu, PencilIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ViewMode = "cards" | "list" | "compact";
type SortKey = "created" | "name";

const TABS = ["All Clubs", "Approved", "Pending", "Rejected"] as const;
type TabKey = (typeof TABS)[number];

const MODE_CONFIG: Record<ViewMode, { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
  cards: { label: "Card View", Icon: Grid },
  list: { label: "List View", Icon: List },
  compact: { label: "Compact View", Icon: Menu },
};

const tabToStatus: Record<TabKey, string | null> = {
  "All Clubs": null,
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
      return "All Clubs";
  }
};

const statusStyles: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ClubsExplorer({ clubs }: { clubs: Organization[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [clubsList, setClubsList] = useState<Organization[]>(clubs);
  const [selectedTab, setSelectedTab] = useState<TabKey>(() =>
    statusToTab(searchParams.get("status"))
  );
  const [mode, setMode] = useState<ViewMode>("cards");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created");

  useEffect(() => {
    setSelectedTab(statusToTab(searchParams.get("status")));
  }, [searchParams]);

  useEffect(() => {
    setClubsList(clubs);
  }, [clubs]);

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

  const filteredByTab = clubsList.filter((c) => {
    if (selectedTab === "All Clubs") return true;
    if (selectedTab === "Approved") return c.status === "approved";
    if (selectedTab === "Pending") return c.status === "pending";
    if (selectedTab === "Rejected") return c.status === "rejected";
    return true;
  });

  const filtered = filteredByTab
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortKey === "created"
        ? new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
        : a.name.localeCompare(b.name)
    );

  return (
    <div className="space-y-6 p-6 bg-background min-h-full">
      <TabGroup selectedIndex={TABS.indexOf(selectedTab)} onChange={handleTabChange}>
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 flex-wrap">
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

            <Link
              href="/dashboard/institution-admin/clubs/create"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow"
              aria-label="Create new club"
            >
              +
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search clubs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-primary"
            />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-border rounded-xl px-3 py-2 shadow-sm"
            >
              <option value="created">Sort by Created</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </TabGroup>

      {mode === "cards" && <CardView clubs={filtered} />}
      {mode === "list" && <ListView clubs={filtered} />}
      {mode === "compact" && <CompactView clubs={filtered} />}
    </div>
  );
}

function CardView({ clubs }: { clubs: Organization[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {clubs.map((c) => (
        <div
          key={c.organization_id}
          className="relative bg-card rounded-2xl p-6 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-1">{c.name}</h2>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{c.description}</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusStyles[c.status ?? "pending"]
            }`}
          >
            {c.status?.toUpperCase()}
          </span>
          <div className="absolute top-6 right-6 space-x-2 flex">
            <Link
              href={`/dashboard/institution-admin/clubs/${c.organization_id}`}
              className="text-primary hover:text-primary/80 transition"
              aria-label={`View ${c.name}`}
            >
              <Eye size={12} />
            </Link>
            <Link
              href={`/dashboard/institution-admin/clubs/${c.organization_id}/edit`}
              className="text-primary hover:text-primary/80 transition"
              aria-label={`Edit ${c.name}`}
            >
              <PencilIcon size={12} />
            </Link>
          </div>
        </div>
      ))}
      {clubs.length === 0 && (
        <div className="col-span-full text-center py-20 text-muted-foreground">
          No clubs yet...
        </div>
      )}
    </div>
  );
}

function ListView({ clubs }: { clubs: Organization[] }) {
  return (
    <div className="overflow-auto rounded-lg border border-border bg-card shadow">
      <table className="min-w-full divide-y bg-card">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Edit</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-card">
          {clubs.map((c) => (
            <tr key={c.organization_id} className="hover:bg-muted">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2 capitalize">{c.status}</td>
              <td className="px-4 py-2">
                <Link
                  href={`/dashboard/institution-admin/clubs/${c.organization_id}/edit`}
                  className="text-primary hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clubs.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">No clubs yet...</div>
      )}
    </div>
  );
}

function CompactView({ clubs }: { clubs: Organization[] }) {
  return (
    <ul className="space-y-2">
      {clubs.map((c) => (
        <li
          key={c.organization_id}
          className="flex items-center justify-between bg-card rounded-lg p-3 shadow hover:bg-muted transition"
        >
          <p className="font-medium truncate">{c.name}</p>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/institution-admin/clubs/${c.organization_id}`}
              className="text-primary hover:underline text-sm"
            >
              View
            </Link>
            <Link
              href={`/dashboard/institution-admin/clubs/${c.organization_id}/edit`}
              className="text-primary hover:underline text-sm"
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
      {clubs.length === 0 && (
        <li className="text-center py-6 text-muted-foreground">No clubs yet...</li>
      )}
    </ul>
  );
}

