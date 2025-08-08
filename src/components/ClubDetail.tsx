"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Organization, OrgMember } from "@/features/organizations/api";
import {
  fetchClub,
  approveClub,
  rejectClub,
  deleteClub,
  fetchClubMembers,
} from "@/features/organizations/api";

export default function ClubDetail({ clubId }: { clubId: string }) {
  const [club, setClub] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetchClub(clubId).then((data) => {
      setClub(data.club);
    });
    fetchClubMembers(clubId).then((data) => {
      setMembers(data);
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

  const formatName = (m: OrgMember) => {
    const u = m.users;
    if (!u) return m.user_id;
    const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
    return full || u.username;
  };

  const executives = members.filter((m) => m.is_executive);
  const regularMembers = members.filter((m) => !m.is_executive);

  return (
    <div className="space-y-4">
      {club.logo_url && (
        <Image
          src={club.logo_url}
          alt={`${club.name} logo`}
          width={128}
          height={128}
          className="h-32 w-32 rounded object-cover"
        />
      )}
      <h1 className="flex items-center text-2xl font-semibold">
        {club.name}
        {club.status === "approved" && (
          <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
            Approved
          </span>
        )}
      </h1>
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

      <div>
        <h2 className="text-xl font-semibold">Executives</h2>
        <ul className="list-disc pl-5">
          {executives.map((m) => (
            <li key={m.user_id}>{formatName(m)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Members</h2>
        <ul className="list-disc pl-5">
          {regularMembers.map((m) => (
            <li key={m.user_id}>{formatName(m)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
