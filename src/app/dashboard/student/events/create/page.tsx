"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import StudentLayout from "@/app/dashboard/StudentLayout";

// Browser-only (Leaflet map / object URLs) — never render on the server.
const CreateEventForm = dynamic(
  () => import("@/features/events/components/CreateEventForm"),
  { ssr: false }
);

export default function StudentCreateEventPage() {
  const router = useRouter();
  return (
    <StudentLayout>
      <div className="mx-auto max-w-2xl">
        <CreateEventForm
          onCreated={() => router.push("/dashboard/student/events")}
        />
      </div>
    </StudentLayout>
  );
}
