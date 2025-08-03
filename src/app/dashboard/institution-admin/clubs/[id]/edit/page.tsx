"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchClub, type Organization } from "@/features/organizations/api";

const EditClubForm = dynamic(
  () => import("@/features/organizations/components/EditClubForm"),
  { ssr: false }
);

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Organization | null>(null);

  useEffect(() => {
    async function load() {
      const { club } = await fetchClub(id);
      setClub(club);
    }
    load();
  }, [id]);

  if (!club) {
    return <p>Loading...</p>;
  }

  return <EditClubForm club={club} />;
}

