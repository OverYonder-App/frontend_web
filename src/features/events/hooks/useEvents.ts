"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents, type EventRecord, type FetchEventsOptions } from "../api";

export function useEvents(
  opts?: FetchEventsOptions,
  refetchInterval = 30000
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events", opts],
    queryFn: () => fetchEvents(opts),
    refetchInterval,
  });

  return {
    events: (data?.events as EventRecord[]) ?? [],
    count: data?.count ?? 0,
    loading: isLoading,
    error: error as Error | null,
  };
}
