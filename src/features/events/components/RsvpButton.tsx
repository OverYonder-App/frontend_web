"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttending, toggleRsvp } from "@/lib/rsvpStore";
import { adjustEventCount } from "@/lib/eventCounts";

interface RsvpButtonProps {
  eventId: string;
  size?: "sm" | "default" | "lg";
  /** Refresh the route after toggling — use on pages with server-rendered
   *  attendee lists/counts. Avoid on dashboard cards. */
  refreshOnToggle?: boolean;
  className?: string;
}

export default function RsvpButton({
  eventId,
  size = "default",
  refreshOnToggle = false,
  className,
}: RsvpButtonProps) {
  const attending = useAttending();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const loading = attending === null;
  const going = !!attending?.has(eventId);

  const handleClick = async (e: React.MouseEvent) => {
    // Cards wrap the button in a <Link>; don't navigate or bubble.
    e.preventDefault();
    e.stopPropagation();
    if (pending || loading) return;
    setPending(true);
    const next = !going;
    adjustEventCount(eventId, next ? 1 : -1);
    try {
      await toggleRsvp(eventId, next);
      if (refreshOnToggle) router.refresh();
    } catch {
      // RSVP failed: store reverted itself; undo the optimistic count too.
      adjustEventCount(eventId, next ? -1 : 1);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      onClick={handleClick}
      disabled={loading || pending}
      aria-pressed={going}
      className={
        (going
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-primary hover:bg-[#845296] text-primary-foreground") +
        (className ? ` ${className}` : "")
      }
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : going ? (
        <Check />
      ) : (
        <Calendar />
      )}
      {going ? "Going" : "RSVP"}
    </Button>
  );
}
