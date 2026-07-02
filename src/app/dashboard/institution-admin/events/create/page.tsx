"use client";

import dynamic from "next/dynamic";

// dynamically import so browser-only pieces (Leaflet map, object URLs) never run on the server
const CreateEventForm = dynamic(
  () => import("@/features/events/components/CreateEventForm"),
  { ssr: false }
);

export default function Page() {
  return <CreateEventForm />;
}
