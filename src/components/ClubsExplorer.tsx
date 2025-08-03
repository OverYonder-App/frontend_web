"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Organization } from "@/features/organizations/api";
import {
  fetchClubs,
  approveClub,
  rejectClub,
  deleteClub,
} from "@/features/organizations/api";

export default function ClubsExplorer() {
  const [clubs, setClubs] = useState<Organization[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const { clubs } = await fetchClubs({ status, search, page });
    setClubs(clubs);
  }, [status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clubs</h1>
        <Link
          href="/dashboard/institution-admin/clubs/create"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Club
        </Link>
      </div>
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded border px-2 py-1"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded border px-2 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={() => {
            setPage(1);
            load();
          }}
          className="rounded border px-4 py-1"
        >
          Filter
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.organization_id} className="border-b">
              <td className="px-4 py-2">{club.name}</td>
              <td className="px-4 py-2">{club.status}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <Link
                  href={`/dashboard/institution-admin/clubs/${club.organization_id}`}
                  className="text-blue-600"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/institution-admin/clubs/${club.organization_id}/edit`}
                  className="text-green-600"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    await approveClub(club.organization_id);
                    load();
                  }}
                  className="text-blue-600"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await rejectClub(club.organization_id);
                    load();
                  }}
                  className="text-yellow-600"
                >
                  Reject
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this club?")) {
                      await deleteClub(club.organization_id);
                      load();
                    }
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="rounded border px-3 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
}
