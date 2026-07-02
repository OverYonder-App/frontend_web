"use client";

import { useState } from "react";
import { Check, Clock, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  acceptFriendRequest,
  removeFriendship,
  sendFriendRequest,
  useFriendship,
} from "@/lib/friendsStore";

interface FriendActionsProps {
  userId: string;
  /** Render explicit Accept/Decline buttons for an incoming request. */
  showIncoming?: boolean;
  /** Render a Remove button when already friends (for the manage page). */
  allowUnfriend?: boolean;
  className?: string;
}

/**
 * Contextual friend control(s) for a given user, driven by the shared
 * friendsStore. Used on the member directory, profile pages, and the Friends
 * page. Renders nothing for yourself. Stops click propagation so it can sit
 * inside a card <Link> without navigating.
 */
export default function FriendActions({
  userId,
  showIncoming = true,
  allowUnfriend = false,
  className,
}: FriendActionsProps) {
  const status = useFriendship(userId);
  const [pending, setPending] = useState(false);

  const run = async (e: React.MouseEvent, fn: () => Promise<void>) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      await fn();
    } catch {
      // store already reverted the optimistic change
    } finally {
      setPending(false);
    }
  };

  if (status === "self" || status === "blocked") return null;

  if (status === "loading") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className={className}
        aria-label="Loading friend status"
      >
        <span className="opacity-0">Add friend</span>
      </Button>
    );
  }

  if (status === "none") {
    return (
      <Button
        size="sm"
        disabled={pending}
        onClick={(e) => run(e, () => sendFriendRequest(userId))}
        className={className}
      >
        <UserPlus size={16} />
        Add friend
      </Button>
    );
  }

  if (status === "outgoing") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={(e) => run(e, () => removeFriendship(userId))}
        title="Cancel request"
        className={className}
      >
        <Clock size={16} />
        Requested
      </Button>
    );
  }

  if (status === "incoming") {
    if (!showIncoming) {
      return (
        <span className={`text-sm text-muted-foreground ${className ?? ""}`}>
          Wants to be friends
        </span>
      );
    }
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        <Button
          size="sm"
          disabled={pending}
          onClick={(e) => run(e, () => acceptFriendRequest(userId))}
        >
          <Check size={16} />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={(e) => run(e, () => removeFriendship(userId))}
        >
          <X size={16} />
          Decline
        </Button>
      </div>
    );
  }

  // friends
  if (allowUnfriend) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={(e) => run(e, () => removeFriendship(userId))}
        className={className}
      >
        <X size={16} />
        Remove
      </Button>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium text-primary ${
        className ?? ""
      }`}
    >
      <Check size={16} />
      Friends
    </span>
  );
}
