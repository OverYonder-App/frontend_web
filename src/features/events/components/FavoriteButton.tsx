"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useFavorites, toggleFavorite } from "@/lib/favoritesStore";

interface FavoriteButtonProps {
  eventId: string;
  className?: string;
}

export default function FavoriteButton({ eventId, className }: FavoriteButtonProps) {
  const favorites = useFavorites();
  const [pending, setPending] = useState(false);
  const loading = favorites === null;
  const saved = !!favorites?.has(eventId);

  const handleClick = async (e: React.MouseEvent) => {
    // Cards wrap this in a <Link>; don't navigate or bubble.
    e.preventDefault();
    e.stopPropagation();
    if (pending || loading) return;
    setPending(true);
    try {
      await toggleFavorite(eventId, !saved);
    } catch {
      // store already reverted the optimistic change
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save event"}
      className={`flex items-center justify-center rounded-full bg-white/90 p-2 shadow transition hover:bg-white ${
        className ?? ""
      }`}
    >
      <Bookmark
        size={18}
        className={saved ? "fill-primary text-primary" : "text-gray-600"}
      />
    </button>
  );
}
