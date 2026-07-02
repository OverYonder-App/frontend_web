"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Catches React rendering errors at the root and reports them to Sentry.
// Sentry.captureException is a no-op when no DSN is configured.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            fontFamily: "system-ui, sans-serif",
            color: "#374151",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#745296" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.875rem" }}>
            An unexpected error occurred. Please try again.
          </p>
          {/* Hard navigation on purpose: this is the root crash boundary, where
              next/link's router may not be functional. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#745296", textDecoration: "underline" }}>
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
