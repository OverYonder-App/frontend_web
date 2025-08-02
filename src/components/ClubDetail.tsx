"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Organization } from "@/features/organizations/api";
import {
  fetchClub,
  approveClub,
  rejectClub,
  deleteClub,
} from "@/features/organizations/api";

interface Props {
  clubId: string;
}

export default function ClubDetail({ clubId }: Props) {
  const [club, setClub] = useState<Organization | null>(null);
  const [history, setHistory] = useState<
    { status: string; changed_at: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    fetchClub(clubId).then((data) => {
      setClub(data.club);
      setHistory(data.history);
    });
  }, [clubId]);

  if (!club) {
    return <div>Loading...</div>;
  }

  const handleApprove = async () => {
    await approveClub(club.organization_id);
    router.refresh();
    const data = await fetchClub(clubId);
    setClub(data.club);
    setHistory(data.history);
  };

  const handleReject = async () => {
    await rejectClub(club.organization_id);
    router.refresh();
    const data = await fetchClub(clubId);
    setClub(data.club);
    setHistory(data.history);
  };

  const handleDelete = async () => {
    if (confirm("Delete club?")) {
      await deleteClub(club.organization_id);
      router.push("/dashboard/institution-admin/clubs");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{club.name}</h1>
      <p>{club.description}</p>
      <p className="font-medium">Status: {club.status}</p>
      <div className="space-x-2">
        <button
          onClick={handleApprove}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          className="rounded bg-yellow-600 px-4 py-2 text-white"
        >
          Reject
        </button>
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Delete
        </button>
      </div>
      <div>
        <h2 className="text-lg font-medium">Status History</h2>
        <ul className="mt-2 space-y-1">
          {history.map((h) => (
            <li key={h.changed_at} className="text-sm">
              {h.status} – {new Date(h.changed_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
