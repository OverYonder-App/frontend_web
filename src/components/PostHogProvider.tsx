"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, capturePageview } from "@/lib/analytics";

// Initializes PostHog (if consented) and sends a pageview on each route change.
// Renders nothing. Deliberately uses only usePathname (not useSearchParams) so
// it doesn't force every page into dynamic rendering.
export default function PostHogProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) capturePageview(pathname);
  }, [pathname]);

  return null;
}
