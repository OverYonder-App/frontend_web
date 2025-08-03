"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Organization } from "@/features/organizations/api";
import {
  fetchClub,
  approveClub,
  rejectClub,
  deleteClub,
} from "@/features/organizations/api";

export default function ClubDetail({ clubId }: { clubId: string }) {
  const [club, setClub] = useState<Organization | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchClub(clubId).then((data) => {
      setClub(data.club);
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
  };

  const handleReject = async () => {
    await rejectClub(club.organization_id);
    router.refresh();
    const data = await fetchClub(clubId);
    setClub(data.club);
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
        <Link
          href={`/dashboard/institution-admin/clubs/${club.organization_id}/edit`}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Edit
        </Link>
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
    
    </div>
  );
}
