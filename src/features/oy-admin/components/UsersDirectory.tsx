"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { fetchAllUsers, type OyUser } from "@/features/oy-admin/api";

function fullName(u: OyUser): string {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || u.username;
}

export default function UsersDirectory() {
  const [users, setUsers] = useState<OyUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setError("Couldn't load users."));
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, fullName(u), u.username, u.institutions?.institution_name, u.roles?.role_name]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [users, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <p className="text-sm text-muted-foreground">
          Every member across all institutions.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Input
        placeholder="Search by name, email, institution, or role…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      {users === null ? (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {query ? "No users match your search." : "No users yet."}
        </p>
      ) : (
        <div className="overflow-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Institution</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/users/${u.user_id}`} className="block">
                      <div className="font-medium text-foreground">{fullName(u)}</div>
                      <div className="text-xs text-gray-500">{u.email ?? "—"}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.institutions?.institution_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {u.roles?.role_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.onboarding
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.onboarding ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
