"use client";

import { useEffect, useRef, useState } from "react";
import useGlobalEventFilters from "@/hooks/useGlobalEventFilters";

interface EventResult {
  id: string;
  title: string;
}

interface OrgResult {
  id: string;
  name: string;
}

export default function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventResult[]>([]);
  const [orgs, setOrgs] = useState<OrgResult[]>([]);
  const [open, setOpen] = useState(false);
  const { startDate, endDate } = useGlobalEventFilters();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setEvents([]);
      setOrgs([]);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const eventsParams = new URLSearchParams({
          search: query,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
        const orgParams = new URLSearchParams({
          organization_type: "club|group",
          search: query,
        });

        const [eventsRes, orgRes] = await Promise.all([
          fetch(`/api/events?${eventsParams.toString()}`, {
            credentials: "include",
            signal: controller.signal,
          }),
          fetch(`/api/organizations?${orgParams.toString()}`, {
            credentials: "include",
            signal: controller.signal,
          }),
        ]);

        const eventsJson = await eventsRes.json();
        const orgJson = await orgRes.json();

        setEvents(eventsJson.events ?? []);
        setOrgs(orgJson.organizations ?? []);
      } catch {
        // ignore errors
      }
    };

    fetchData();

    return () => controller.abort();
  }, [query, startDate, endDate]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search events or clubs..."
        className="w-full border rounded-md px-3 py-2"
      />
      {open && query && (
        <div className="absolute mt-2 w-full bg-white border rounded-md shadow z-10">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-500">Events</p>
            {events.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No events found.</div>
            ) : (
              events.map((e) => (
                <div key={e.id} className="p-2 hover:bg-gray-100 text-sm">
                  {e.title}
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t">
            <p className="text-xs font-semibold text-gray-500">
              Clubs & Groups
            </p>
            {orgs.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                No organizations found.
              </div>
            ) : (
              orgs.map((o) => (
                <div key={o.id} className="p-2 hover:bg-gray-100 text-sm">
                  {o.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

