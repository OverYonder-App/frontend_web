"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Users } from "lucide-react";
import StudentLayout from "@/app/dashboard/StudentLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FriendActions from "@/features/friends/components/FriendActions";
import { supabase } from "@/lib/supabase";
import { useFriendRows, useMyId } from "@/lib/friendsStore";

interface DirectoryUser {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string;
  avatar_url: string;
}

function displayName(u: DirectoryUser): string {
  const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return full || u.username || u.email || "Member";
}

function initials(u: DirectoryUser): string {
  const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  const source = full || u.username || u.email || "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function UserRow({
  user,
  children,
}: {
  user: DirectoryUser;
  children?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-row items-center gap-3 p-3">
      <Link
        href={`/users/${user.user_id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar className="size-10">
          <AvatarImage src={user.avatar_url} alt={displayName(user)} />
          <AvatarFallback>{initials(user)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{displayName(user)}</p>
          {user.email && (
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          )}
        </div>
      </Link>
      {children}
    </Card>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {title}
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {count}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}

export default function FriendsPage() {
  const rows = useFriendRows();
  const myId = useMyId();
  const [users, setUsers] = useState<DirectoryUser[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("users")
        .select("user_id, email, first_name, last_name, username, avatar_url");
      if (active) setUsers((data as DirectoryUser[] | null) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  const byId = useMemo(() => {
    const map = new Map<string, DirectoryUser>();
    for (const u of users ?? []) map.set(u.user_id, u);
    return map;
  }, [users]);

  const { incoming, outgoing, friends } = useMemo(() => {
    const inc: string[] = [];
    const out: string[] = [];
    const fr: string[] = [];
    for (const r of rows ?? []) {
      if (r.status === "accepted") {
        fr.push(r.requester_id === myId ? r.receiver_id : r.requester_id);
      } else if (r.status === "sent") {
        if (r.receiver_id === myId) inc.push(r.requester_id);
        else if (r.requester_id === myId) out.push(r.receiver_id);
      }
    }
    return { incoming: inc, outgoing: out, friends: fr };
  }, [rows, myId]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (users ?? [])
      .filter((u) => u.user_id !== myId)
      .filter(
        (u) =>
          displayName(u).toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [users, query, myId]);

  const loading = rows === null || users === null;

  const renderRow = (id: string, actions: React.ReactNode) => {
    const user = byId.get(id);
    if (!user) return null;
    return (
      <UserRow key={id} user={user}>
        {actions}
      </UserRow>
    );
  };

  return (
    <StudentLayout>
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Users size={24} />
          Friends
        </h1>
        <p className="text-sm text-muted-foreground">
          Connect with other members of your institution.
        </p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <Section title="Add a friend">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members by name or email"
                className="pl-9"
              />
            </div>
            {query.trim() && (
              <div className="space-y-2">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500">No members found.</p>
                ) : (
                  searchResults.map((u) => (
                    <UserRow key={u.user_id} user={u}>
                      <FriendActions userId={u.user_id} />
                    </UserRow>
                  ))
                )}
              </div>
            )}
          </Section>

          {incoming.length > 0 && (
            <Section title="Friend requests" count={incoming.length}>
              <div className="space-y-2">
                {incoming.map((id) =>
                  renderRow(id, <FriendActions userId={id} />)
                )}
              </div>
            </Section>
          )}

          {outgoing.length > 0 && (
            <Section title="Sent requests" count={outgoing.length}>
              <div className="space-y-2">
                {outgoing.map((id) =>
                  renderRow(id, <FriendActions userId={id} />)
                )}
              </div>
            </Section>
          )}

          <Section title="Your friends" count={friends.length}>
            {friends.length === 0 ? (
              <Card className="flex flex-col items-center gap-2 p-8 text-center">
                <UserPlus className="text-gray-300" size={32} />
                <p className="text-sm text-gray-500">
                  You haven&apos;t added any friends yet. Search above to get
                  started.
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {friends.map((id) =>
                  renderRow(
                    id,
                    <FriendActions userId={id} allowUnfriend />
                  )
                )}
              </div>
            )}
          </Section>
        </div>
      )}
    </StudentLayout>
  );
}
