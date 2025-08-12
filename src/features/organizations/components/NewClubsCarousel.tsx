"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ClubsSkeleton from "@/components/ClubsSkeleton";

interface Club {
  organization_id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  created_at?: string | null;
}

export default function NewClubsCarousel() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          organization_type: "club",
          sort: "created_at",
          order: "desc",
          limit: "10",
        });
        const res = await fetch(`/api/organizations?${params.toString()}`, {
          credentials: "include",
        });
        const json = await res.json();
        const data: Club[] = json.organizations || [];
        setClubs(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <ClubsSkeleton />;
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">No clubs yet...</div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {clubs.map((club) => (
        <div
          key={club.organization_id}
          className="min-w-[200px] bg-white rounded-lg shadow p-4"
        >
          {club.logo_url && (
            <div className="relative h-32 w-full">
              <Image
                src={club.logo_url}
                alt={club.name}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <h3 className="mt-2 font-semibold text-sm">{club.name}</h3>
          {club.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {club.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

