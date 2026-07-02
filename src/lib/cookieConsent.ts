// Cookie-consent preference, stored in a first-party cookie so it's readable on
// both the client and (if ever needed) the server. The app currently sets only
// strictly-necessary cookies (the Supabase auth session), so "accepted" vs
// "rejected" is a recorded preference today — gate any future non-essential
// cookies (e.g. analytics) on hasAnalyticsConsent().

export const COOKIE_CONSENT_KEY = "cookie_consent";
export type ConsentValue = "accepted" | "rejected";

export function getCookieConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // remember for 1 year
  // `secure` only on HTTPS — adding it on http://localhost would silently drop the cookie.
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${COOKIE_CONSENT_KEY}=${value}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
}

/** True once the user has opted into non-essential (e.g. analytics) cookies. */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}
