"use client";

import { useEffect, useState } from "react";
import {
  fetchAnnouncements,
  AnnouncementRecord,
} from "@/features/announcements/api";

const roleColors: Record<string, string> = {
  "OY Admin": "bg-red-100 text-red-800",
  "Institution Admin": "bg-orange-100 text-orange-800",
  Faculty: "bg-green-100 text-green-800",
  "Student Leader": "bg-purple-100 text-purple-800",
  Student: "bg-blue-100 text-blue-800",
};

export default function AnnouncementsSidebar() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center pt-4">
        No announcements yet...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <div key={a.announcement_id} className="p-4 bg-white rounded shadow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-sm">{a.title}</h3>
            {a.users?.roles?.role_name && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  roleColors[a.users.roles.role_name] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {a.users.roles.role_name}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{a.body}</p>
        </div>
      ))}
    </div>
  );
}
