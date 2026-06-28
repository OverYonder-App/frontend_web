"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  fetchAnnouncements,
  type AnnouncementRecord,
} from "@/features/announcements/api";
import {
  markAllRead,
  refreshNotifications,
  useNotifications,
  useUnreadCount,
  type NotificationItem,
} from "@/lib/notificationsStore";

const roleColors: Record<string, string> = {
  "OY Admin": "bg-red-100 text-red-800",
  "Institution Admin": "bg-orange-100 text-orange-800",
  Faculty: "bg-green-100 text-green-800",
  "Student Leader": "bg-purple-100 text-purple-800",
  Student: "bg-blue-100 text-blue-800",
};

function actorName(n: NotificationItem): string {
  if (!n.actor) return "Someone";
  const full = [n.actor.first_name, n.actor.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || n.actor.username || "Someone";
}

function describe(n: NotificationItem): { text: string; href: string } {
  const who = actorName(n);
  const title = n.event?.title ?? "an event";
  const eventHref = n.event_id ? `/event/${n.event_id}` : "#";
  switch (n.type) {
    case "friend_request":
      return { text: `${who} sent you a friend request`, href: "/dashboard/student/friends" };
    case "friend_accepted":
      return { text: `${who} accepted your friend request`, href: "/dashboard/student/friends" };
    case "friend_going":
      return { text: `${who} is also going to ${title}`, href: eventHref };
    case "event_approved":
      return { text: `Your event “${title}” was approved`, href: eventHref };
    case "event_rejected":
      return { text: `Your event “${title}” was not approved`, href: eventHref };
    case "institution_approved":
      return {
        text: "Your institution was approved — members are now released",
        href: "/dashboard/institution-admin",
      };
    default:
      return { text: "You have a new notification", href: "#" };
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function NotificationRow({
  item,
  highlight,
}: {
  item: NotificationItem;
  highlight: boolean;
}) {
  const { text, href } = describe(item);
  return (
    <Link
      href={href}
      className={`block rounded p-2 hover:bg-gray-50 ${
        highlight ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {highlight && (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
        )}
        <div className="min-w-0">
          <p className="text-sm text-gray-800">{text}</p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {relativeTime(item.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function BellContents({ open }: { open: boolean }) {
  const notifications = useNotifications();
  const unread = useUnreadCount();
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loadingA, setLoadingA] = useState(true);
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  const wasOpen = useRef(false);

  useEffect(() => {
    let active = true;
    fetchAnnouncements()
      .then((d) => active && setAnnouncements(d))
      .catch(() => active && setAnnouncements([]))
      .finally(() => active && setLoadingA(false));
    return () => {
      active = false;
    };
  }, []);

  // On open: snapshot which rows were unread (so they stay highlighted while the
  // panel is open), pull the latest, then mark everything read to clear the badge.
  useEffect(() => {
    if (open && !wasOpen.current) {
      setHighlightIds(
        new Set(
          (notifications ?? [])
            .filter((n) => !n.read)
            .map((n) => n.notification_id)
        )
      );
      refreshNotifications().then(() => markAllRead());
    }
    if (!open && wasOpen.current) {
      setHighlightIds(new Set());
    }
    wasOpen.current = open;
  }, [open, notifications]);

  const loading = notifications === null && loadingA;
  const isEmpty =
    (notifications?.length ?? 0) === 0 && announcements.length === 0;

  return (
    <>
      <PopoverButton
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-md p-1.5 text-current hover:bg-black/10 focus:outline-none"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
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
        <div className="max-h-96 space-y-1 overflow-auto p-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-gray-100" />
            ))
          ) : isEmpty ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No notifications yet...
            </p>
          ) : (
            <>
              {(notifications ?? []).map((n) => (
                <NotificationRow
                  key={n.notification_id}
                  item={n}
                  highlight={highlightIds.has(n.notification_id)}
                />
              ))}
              {announcements.length > 0 && (
                <>
                  {(notifications?.length ?? 0) > 0 && (
                    <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Announcements
                    </div>
                  )}
                  {announcements.map((a) => (
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
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </PopoverPanel>
    </>
  );
}

export default function NotificationsBell() {
  return (
    <Popover className="relative">
      {({ open }) => <BellContents open={open} />}
    </Popover>
  );
}
