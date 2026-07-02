"use client";

import { useUser } from "@/context/UserContext";
import { UserRole } from "@/constants/roles";
import RsvpButton from "@/features/events/components/RsvpButton";
import Link from "next/link";
import { PenIcon } from "lucide-react";


interface EventActionsProps {
  creatorId: string;
  eventId: string;
}

export default function EventActions({ creatorId, eventId }: EventActionsProps) {
  const { user } = useUser();
  const role = user?.role_type as UserRole | undefined;


  const canRSVP =
    role === UserRole.STUDENT ||
    role === UserRole.FACULTY ||
    role === UserRole.INSTITUTION_ADMIN ||
    role === UserRole.STUDENT_LEADER;


  const canEdit = user?.id === creatorId || role === UserRole.INSTITUTION_ADMIN;


  return (
    <div className="flex gap-2 mb-8">
      {canRSVP && <RsvpButton eventId={eventId} refreshOnToggle />}
      {canEdit && (
        <Link
          href={
            role === UserRole.INSTITUTION_ADMIN
              ? `/dashboard/institution-admin/events/${eventId}/edit`
              : `/event/${eventId}/edit`
          }
          className="bg-[#fefefe] border text-primary hover:text-[#845296] flex items-center px-3 rounded"
        >
          Edit Event &nbsp;
          <PenIcon size={15} />
        </Link>
      )}
    </div>
  );
}

