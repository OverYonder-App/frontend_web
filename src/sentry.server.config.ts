// Sentry server-side init. No-op unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Privacy-conscious: don't auto-attach IP/headers/cookies. Error tracking is
  // operational, so it runs regardless of the cookie-consent choice.
  sendDefaultPii: false,
});
