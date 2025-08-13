"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchClubs,
  type Organization,
  type FetchClubsOptions,
} from "../api";

export function useClubs(
  opts?: FetchClubsOptions,
  refetchInterval = 30000
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clubs", opts],
    queryFn: () => fetchClubs(opts),
    refetchInterval,
  });

  return {
    clubs: (data?.clubs as Organization[]) ?? [],
    count: data?.count ?? 0,
    loading: isLoading,
    error: error as Error | null,
  };
}

