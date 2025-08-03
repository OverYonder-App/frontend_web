"use client";

import { useEffect, useState } from "react";
import {
  fetchClubs,
  type Organization,
  type FetchClubsOptions,
} from "../api";

export function useClubs(opts?: FetchClubsOptions) {
  const [clubs, setClubs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const { clubs } = await fetchClubs(opts);
        setClubs(clubs);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [opts]);

  return { clubs, loading, error };
}

