import { describe, it, expect, vi, afterEach } from "vitest";
import { cn, getBaseUrl, parseDateTime } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe(
      "text-sm font-bold"
    );
  });
});

describe("getBaseUrl (server runtime)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("prefers NEXT_PUBLIC_APP_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com");
    expect(getBaseUrl()).toBe("https://app.example.com");
  });

  it("falls back to VERCEL_URL over https", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_URL", "my-app.vercel.app");
    expect(getBaseUrl()).toBe("https://my-app.vercel.app");
  });

  it("defaults to localhost when nothing is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });
});

describe("parseDateTime", () => {
  it("parses ISO strings", () => {
    expect(isNaN(parseDateTime("2026-06-28T18:00:00Z").getTime())).toBe(false);
  });

  it("parses the US M/d/yyyy h:mm a fallback format", () => {
    const d = parseDateTime("6/28/2026 6:00 PM");
    expect(isNaN(d.getTime())).toBe(false);
    expect(d.getFullYear()).toBe(2026);
  });
});
