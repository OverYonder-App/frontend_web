import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { fetchEvent } from "@/features/events/api";
import CommentsSection from "@/features/events/components/CommentsSection";
import EventActions from "./EventActions";

interface Attendee {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { event } = await fetchEvent(id);
  const attendees:
    | Attendee[]
    | undefined = (event as { attendees?: Attendee[] }).attendees;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-4">
        <Image
          src={event.image_url}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded"
        />
      </div>
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="mb-4 space-y-1">
        <p className="text-sm">Status: {event.status}</p>
        <div className="flex items-center gap-1 text-sm">
          <MapPin size={16} />
          {event.address}
          {event.latitude && event.longitude && (
            <Link
              href={`https://maps.google.com/?q=${event.latitude},${event.longitude}`}
              className="text-blue-500 underline ml-2"
              target="_blank"
            >
              View Map
            </Link>
          )}
        </div>
      </div>
      <AttendeeList attendees={attendees || []} />
      <EventActions />
      <CommentsSection eventId={event.event_id} />
    </div>
  );
}

function AttendeeList({ attendees }: { attendees: Attendee[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Attendees</h2>
      {attendees.length === 0 ? (
        <p className="text-sm text-gray-500">No attendees yet.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {attendees.map((a, idx) => (
            <li key={a.id || idx}>{a.name || a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

