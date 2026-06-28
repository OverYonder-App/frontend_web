import type { NextConfig } from "next";

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

export default nextConfig;
