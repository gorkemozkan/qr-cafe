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
    // Environment detection from environment variables
    const environment = (process.env.NEXT_PUBLIC_ENV || "development") as "development" | "staging" | "production";

    // Supabase configuration for database connections
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;

    // Additional origins allowed for CORS (development defaults included)
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001"];

    const isProduction = environment === "production";

    const isDevelopment = environment === "development";

    // DEVELOPMENT: Minimal headers to avoid conflicts with Next.js dev server
    if (isDevelopment) {
      return [
        {
          // API routes: Prevent caching of API responses in development
          source: "/api/(.*)",
          headers: [{ key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }],
        },
      ];
    }

    // PRODUCTION/STAGING: Full security headers
    const csp = createCSP(environment, supabaseUrl, allowedOrigins);

    return [
      {
        // All routes: Apply CSP and common security headers
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }, ...commonHeaders, ...(isProduction ? productionOnlyHeaders : [])],
      },
      {
        // API routes: Additional security headers for API endpoints
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }, // Prevent API response caching
          { key: "X-Content-Type-Options", value: "nosniff" }, // Prevent MIME sniffing
          { key: "X-Frame-Options", value: "DENY" }, // Prevent embedding in frames
        ],
      },
    ];
  },
};

export default nextConfig;
