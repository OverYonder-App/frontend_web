"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ClubsSkeleton from "@/components/ClubsSkeleton";

interface Club {
  organization_id: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  created_at?: string | null;
}

export default function AllClubsCarousel() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((p) => p + 1);
      }
    });
    const current = loadMoreRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  async function load(p: number) {
    setLoading(true);
    const currentLength = clubs.length;
    try {
      const params = new URLSearchParams({
        type: "club",
        page: String(p),
        sort: "created_at",
        order: "desc",
      });
      const res = await fetch(`/api/organizations?${params.toString()}`, {
        credentials: "include",
      });
      const json = await res.json();
      const data: Club[] = json.organizations || [];
      setClubs((prev) => [...prev, ...data]);
      const total = json.count ?? 0;
      setHasMore(currentLength + data.length < total);
    } finally {
      setLoading(false);
    }
  }

  if (loading && clubs.length === 0) {
    return <ClubsSkeleton />;
  }

  if (!loading && clubs.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">No clubs yet...</div>
    );
  }

  return (
    <div>
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
        {loading && clubs.length > 0 && (
          <div className="min-w-[200px] h-48 bg-gray-200 rounded animate-pulse" />
        )}
        <div ref={loadMoreRef} />
      </div>
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            className="text-sm text-primary underline"
            onClick={() => setPage((p) => p + 1)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

