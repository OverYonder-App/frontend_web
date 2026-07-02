// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getCookieConsent,
  setCookieConsent,
  hasAnalyticsConsent,
  COOKIE_CONSENT_KEY,
} from "@/lib/cookieConsent";

function clearConsent() {
  document.cookie = `${COOKIE_CONSENT_KEY}=; path=/; max-age=0`;
}

describe("cookieConsent", () => {
  beforeEach(clearConsent);

  it("returns null and withholds analytics before any choice", () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("persists an 'accepted' choice and grants analytics", () => {
    setCookieConsent("accepted");
    expect(getCookieConsent()).toBe("accepted");
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("persists a 'rejected' choice without granting analytics", () => {
    setCookieConsent("rejected");
    expect(getCookieConsent()).toBe("rejected");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("treats an unrecognized cookie value as no consent", () => {
    document.cookie = `${COOKIE_CONSENT_KEY}=maybe; path=/`;
    expect(getCookieConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });
});
