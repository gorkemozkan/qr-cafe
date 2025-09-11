import type { NextConfig } from "next";
import { isNextDevelopment, isNextProduction, nextEnvironment, supabaseConfig } from "./lib/env";
import { commonHeaders, createCSP, productionOnlyHeaders } from "./lib/security";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/storage/v1/object/public/**",
        hostname: supabaseConfig.supabaseUrl.replace(/^https?:\/\//, ""),
      },
      {
        protocol: "http",
        port: "54321",
        hostname: "127.0.0.1",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        port: "54321",
        hostname: "127.0.0.1",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    if (isNextDevelopment) {
      return [
        {
          source: "/api/(.*)",
          headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
        },
      ];
    }

    const csp = createCSP(nextEnvironment, supabaseConfig.supabaseUrl, process.env.ALLOWED_ORIGINS?.split(","));

    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }, ...commonHeaders, ...(isNextProduction ? productionOnlyHeaders : [])],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
