import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { createCSP, commonHeaders, productionOnlyHeaders } from "./lib/security";
import { RemotePattern } from "next/dist/shared/lib/image-config";
import { isDevelopment } from "./lib/utils";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const getRemotePatterns = (): RemotePattern[] => {
  const patterns: RemotePattern[] = [];

  if (isDevelopment) {
    patterns.push(
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
    );
  } else {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING) {
      const stagingHostname = process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING.split("//")[1];
      if (stagingHostname) {
        patterns.push({
          protocol: "https",
          hostname: stagingHostname,
          pathname: "/storage/v1/object/public/**",
        });
      }
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL_PROD) {
      const prodHostname = process.env.NEXT_PUBLIC_SUPABASE_URL_PROD.split("//")[1];
      if (prodHostname) {
        patterns.push({
          protocol: "https",
          hostname: prodHostname,
          pathname: "/storage/v1/object/public/**",
        });
      }
    }
  }

  return patterns;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
  },

  async headers() {
    const customEnvironment = (process.env.NEXT_PUBLIC_ENV || "development") as
      | "development"
      | "staging"
      | "production";

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING ||
      process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3001",
    ];

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
        headers: [
          { key: "Content-Security-Policy", value: csp },
          ...commonHeaders,
          ...(isProduction ? productionOnlyHeaders : []),
        ],
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

export default withNextIntl(nextConfig);
