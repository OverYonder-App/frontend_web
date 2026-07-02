"use client";

import { Clock } from "lucide-react";
import { useUser } from "@/context/UserContext";

// Shown to an Institution Admin whose institution hasn't been approved yet, so
// they understand it isn't live to members while they finish setting it up.
export default function InstitutionPendingBanner() {
  const { user } = useUser();
  if (user?.institution_status !== "pending") return null;

  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <Clock size={16} className="mt-0.5 shrink-0" />
      <span>
        Your institution is <strong>awaiting OverYonder approval</strong>. You
        can set things up now — members will get access once it&apos;s approved.
      </span>
    </div>
  );
}
