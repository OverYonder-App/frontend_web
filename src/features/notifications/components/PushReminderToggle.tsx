"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isPushSupported,
  isSubscribed,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push";

// Settings control to opt in/out of browser push reminders for RSVP'd events
// (sent at T-30 / T-15 / T-0). Web Push requires HTTPS (localhost is exempt) and
// the user granting Notification permission.

export default function PushReminderToggle() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false);
      return;
    }
    isSubscribed().then(setEnabled);
  }, []);

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      if (enabled) {
        await unsubscribeFromPush();
        setEnabled(false);
      } else {
        const ok = await subscribeToPush();
        if (ok) setEnabled(true);
        else setError("Notification permission was blocked in your browser.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg space-y-3 rounded-xl bg-white p-6 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            {enabled ? <Bell size={18} /> : <BellOff size={18} />}
            Event reminders
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get a browser notification 30 and 15 minutes before — and right as —
            events you&apos;re attending start.
          </p>
        </div>
        {supported && (
          <Button
            variant={enabled ? "outline" : "default"}
            onClick={toggle}
            disabled={busy}
            className="shrink-0"
          >
            {busy ? "..." : enabled ? "Turn off" : "Enable"}
          </Button>
        )}
      </div>
      {!supported && (
        <p className="text-sm text-amber-600">
          Your browser doesn&apos;t support push notifications.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
