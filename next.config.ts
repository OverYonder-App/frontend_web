import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
     {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pxrpvalhhtbudwrvuglt.supabase.co",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
