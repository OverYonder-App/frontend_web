"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getCookieConsent,
  setCookieConsent,
  type ConsentValue,
} from "@/lib/cookieConsent";
import { initAnalytics } from "@/lib/analytics";

// Bottom cookie-consent banner. Renders nothing on the server and on the first
// client render (so there's no hydration mismatch), then appears after mount if
// the user hasn't chosen yet. The choice persists in a cookie, so it won't nag
// again on future visits.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value: ConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
    // Start analytics immediately on accept (no reload needed). initAnalytics
    // is a no-op without consent, so reject simply leaves PostHog uninitialized.
    if (value === "accepted") initAnalytics();
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          We use cookies to keep you signed in and improve your experience. Read
          our{" "}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => choose("rejected")}
          >
            Reject
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
