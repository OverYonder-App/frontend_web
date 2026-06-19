import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { fetchEvent, fetchEventAttendees } from "@/features/events/api.server";
import CommentsSection from "@/features/events/components/CommentsSection";
import AttendeeList from "@/features/events/components/AttendeeList";
import EventLocationMap from "@/components/map/EventLocationMap";
import EventActions from "./EventActions";
import { Metadata } from "next";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
  title: "Event - Institution Admin",
  description: "The number #1 campus engagement platform",
};


export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ event }, attendees] = await Promise.all([
    fetchEvent(id),
    fetchEventAttendees(id),
  ]);
  if (!event) {
    notFound();
  }

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
      <div className="mb-4 space-y-2">
        <p className="text-sm">Status: {event.status}</p>
        <div className="flex items-center gap-1 text-sm">
          <MapPin size={16} />
          {event.address}
          {event.latitude && event.longitude && (
            <Link
              href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=17/${event.latitude}/${event.longitude}`}
              className="text-primary underline ml-2"
              target="_blank"
            >
              Open in OpenStreetMap
            </Link>
          )}
        </div>
        {event.latitude && event.longitude && (
          <EventLocationMap
            lat={event.latitude}
            lng={event.longitude}
            label={event.address || event.title}
          />
        )}
      </div>
      <AttendeeList attendees={attendees} />
      <EventActions creatorId={event.created_by} eventId={event.event_id} />

      <CommentsSection eventId={event.event_id} />
    </div>
  );
}

