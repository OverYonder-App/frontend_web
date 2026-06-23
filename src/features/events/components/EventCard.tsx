"use client";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import RsvpButton from "./RsvpButton";
import FavoriteButton from "./FavoriteButton";
import { useEventCount } from "@/lib/eventCounts";
import type { Event } from "../types";
import Image from "next/image";
import Link from "next/link";

export interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const placeholder = "https://picsum.photos/seed/picsum/800/500";
  const goingCount = useEventCount(event.id);
  return (
    <Link href={`/event/${event.id}`} className="block">
      <Card className="overflow-hidden rounded-xl border border-gray-200 shadow hover:shadow-md transition">
        <div className="relative">
          <Image
            width={"800"}
            height={"500"}
            src={event.image || placeholder}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
          <FavoriteButton
            eventId={event.id}
            className="absolute top-2 right-2 z-10"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-primary">{event.title}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <CalendarClock size={14} /> {event.date}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin size={14} /> {event.location}
          </p>
          <p className="text-xs text-gray-400">Hosted by {event.host}</p>
          <div className="flex justify-between items-center pt-2">
            <RsvpButton eventId={event.id} size="sm" />
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={14} /> {goingCount < 0 ? 0 : goingCount} going
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
