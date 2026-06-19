"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  fetchAnnouncements,
  type AnnouncementRecord,
} from "@/features/announcements/api";

const roleColors: Record<string, string> = {
  "OY Admin": "bg-red-100 text-red-800",
  "Institution Admin": "bg-orange-100 text-orange-800",
  Faculty: "bg-green-100 text-green-800",
  "Student Leader": "bg-purple-100 text-purple-800",
  Student: "bg-blue-100 text-blue-800",
};

export default function NotificationsBell() {
  const [items, setItems] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchAnnouncements()
      .then((d) => active && setItems(d))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Popover className="relative">
      <PopoverButton
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-md p-1.5 text-current hover:bg-black/10 focus:outline-none"
      >
        <Bell size={20} />
        {items.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
      </PopoverButton>

      <PopoverPanel
        anchor="bottom start"
        className="z-[1000] w-80 [--anchor-gap:8px] rounded-lg border bg-white text-gray-800 shadow-lg"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 space-y-2 overflow-auto p-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-gray-100" />
            ))
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No notifications yet...
            </p>
          ) : (
            items.map((a) => (
              <div
                key={a.announcement_id}
                className="rounded p-2 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  {a.users?.roles?.role_name && (
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-[10px] ${
                        roleColors[a.users.roles.role_name] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {a.users.roles.role_name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-600">{a.body}</p>
              </div>
            ))
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
