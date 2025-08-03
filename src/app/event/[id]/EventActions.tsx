"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { UserRole } from "@/constants/roles";

export default function EventActions() {
  const { user } = useUser();
  const role = user?.role_type as UserRole | undefined;
  const canRSVP =
    role === UserRole.STUDENT ||
    role === UserRole.FACULTY ||
    role === UserRole.STUDENT_LEADER;
  const canEdit =
    role === UserRole.FACULTY ||
    role === UserRole.INSTITUTION_ADMIN ||
    role === UserRole.OY_ADMIN;

  return (
    <div className="flex gap-2 mb-8">
      {canRSVP && (
        <Button className="bg-[#745296] hover:bg-[#845296]">RSVP</Button>
      )}
      {canEdit && <Button variant="outline">Edit Event</Button>}
    </div>
  );
}

