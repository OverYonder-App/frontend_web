"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchEvent, type EventRecord } from "@/features/events/api";

const EditEventForm = dynamic(
  () => import("@/components/EditEventForm"),
  { ssr: false }
);

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRecord | null>(null);

  useEffect(() => {
    async function load() {
      const { event } = await fetchEvent(id);
      setEvent(event);
    }
    load();
  }, [id]);

  if (!event) {
    return <p>Loading...</p>;
  }

  return <EditEventForm event={event} />;
}

