"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { UserRole } from "@/constants/roles";
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
      {canRSVP && (
        <Button className="bg-[#745296] hover:bg-[#845296]">RSVP</Button>
      )}
      {canEdit && (
        <Link
          href={
            role === UserRole.INSTITUTION_ADMIN
              ? `/dashboard/institution-admin/events/${eventId}/edit`
              : `/event/${eventId}/edit`
          }
          className="bg-[#fefefe] border text-[#745296] hover:text-[#845296] flex items-center px-3 rounded"
        >
          Edit Event &nbsp;
          <PenIcon size={15} />
        </Link>
      )}
    </div>
  );
}

