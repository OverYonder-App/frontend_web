import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Allowlist the Supabase storage host for next/image. Derive it from the
// configured Supabase URL so it auto-matches whatever project is deployed
// (local stack on 127.0.0.1:54331, or the hosted prod project), instead of a
// hardcoded — and now dead — project ref.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  const { hostname, port, protocol } = new URL(supabaseUrl);
  remotePatterns.push({
    protocol: protocol === "https:" ? "https" : "http",
    hostname,
    ...(port ? { port } : {}),
    pathname: "/storage/v1/object/**",
  });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

// Wrap with Sentry. Source maps upload only when SENTRY_AUTH_TOKEN/org/project
// are set (i.e. in CI/prod); locally and without them it's a safe no-op build.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "gerald-ux",
  project: process.env.SENTRY_PROJECT || "javascript-nextjs",
  // Source maps upload only when this is set (CI/prod); generate it in Sentry.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
