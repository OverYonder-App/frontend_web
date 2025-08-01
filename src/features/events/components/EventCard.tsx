"use client";
import { CalendarClock, MapPin, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "../types";
import Image from "next/image";

export interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-200 shadow hover:shadow-md transition">
      <Image
        width={"800"}
        height={"500"}
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-[#745296]">{event.title}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <CalendarClock size={14} /> {event.date}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin size={14} /> {event.location}
        </p>
        <p className="text-xs text-gray-400">Hosted by {event.host}</p>
        <div className="flex justify-between items-center pt-2">
          <Button size="sm" className="text-sm bg-[#745296] hover:bg-[#845296]">
            <Calendar /> RSVP
          </Button>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={14} /> {event.attendees.length} going
          </div>
        </div>
      </div>
    </Card>
  );
}
