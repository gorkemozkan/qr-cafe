import type { NextConfig } from "next";

import { createCSP, commonHeaders, productionOnlyHeaders } from "./lib/security";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "hqsozlasqpltfzxwufdc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lxeyungcdkbrldpbxtbc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    const customEnvironment = (process.env.NEXT_PUBLIC_ENV || "development") as "development" | "staging" | "production";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001"];

    const isProduction = customEnvironment === "production";

    const isDevelopment = customEnvironment === "development";

    if (isDevelopment) {
      return [
        {
          source: "/api/(.*)",
          headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
        },
      ];
    }

    const csp = createCSP(customEnvironment, supabaseUrl, allowedOrigins);

    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }, ...commonHeaders, ...(isProduction ? productionOnlyHeaders : [])],
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
