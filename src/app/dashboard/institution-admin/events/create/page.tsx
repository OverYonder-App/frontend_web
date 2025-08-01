"use client";

import dynamic from "next/dynamic";

// dynamically import so that @react-google-maps/api (which relies on window) never runs on the server
const CreateEventForm = dynamic(
  () => import("@/features/events/components/CreateEventForm"),
  { ssr: false }
);

export default function Page() {
  return <CreateEventForm />;
}
