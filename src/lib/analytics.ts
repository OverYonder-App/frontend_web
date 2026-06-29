"use client";

// PostHog product analytics, gated on cookie consent. PostHog is only
// initialized when (a) a project key is configured and (b) the user has accepted
// cookies (see cookieConsent.ts). Error/exception tracking is handled by Sentry
// (see sentry.*.config.ts), NOT PostHog, so there's no duplicate error reporting.
import posthog from "posthog-js";
import { hasAnalyticsConsent } from "@/lib/cookieConsent";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

/** Initialize PostHog once — only with a key present AND consent granted. */
export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  if (!KEY || !hasAnalyticsConsent()) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // captured manually on route change
    capture_pageleave: true,
    capture_exceptions: false, // errors are handled by Sentry, not PostHog
    persistence: "localStorage+cookie",
  });
  initialized = true;
}

/** Manually send a pageview (called on App Router path changes). */
export function capturePageview(url: string): void {
  if (initialized) posthog.capture("$pageview", { $current_url: url });
}

/**
 * Capture a product event. No-op until PostHog is initialized (key + consent).
 * Activation funnel: signed_up → onboarding_completed → club_joined → event_rsvp.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (initialized) posthog.capture(event, props);
}

/** Identify the signed-in user (call after auth). */
export function identifyUser(id: string, props?: Record<string, unknown>): void {
  if (initialized) posthog.identify(id, props);
}

/** Clear identity on sign-out. */
export function resetAnalytics(): void {
  if (initialized) posthog.reset();
}

export { posthog };
