import { http } from "@/lib/http";
import { getCacheKeys, redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { publicRateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";
import { isDevelopment } from "@/lib/env";

export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = publicRateLimiter.check(request);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: http.TOO_MANY_REQUESTS.message,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: http.TOO_MANY_REQUESTS.status,
        },
      );
    }

    const supabase = await createClient();

    const cacheKey = getCacheKeys.publicCafeSlugs();

    try {
      const cachedData = await redis.get(cacheKey);

      if (cachedData && typeof cachedData === "string") {
        return NextResponse.json(JSON.parse(cachedData));
      }
    } catch (_error) {}

    const { data: cafes, error } = await supabase
      .from("cafes")
      .select("slug")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          error: "Unable to fetch cafe list",
          ...(isDevelopment && { details: error.message }),
        },
        { status: 500 },
      );
    }

    const slugs = (cafes || []).map((cafe) => cafe.slug);

    try {
      await redis.setex(cacheKey, 900, JSON.stringify(slugs));
    } catch (_error) {}

    return NextResponse.json(slugs);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("NEXT_PUBLIC") ||
        error.message.includes("Supabase") ||
        error.message.includes("Redis")
      ) {
        return NextResponse.json(
          {
            error: "Configuration error",
            ...(isDevelopment && { details: "Environment variables not properly configured" }),
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        ...(isDevelopment && { details: error instanceof Error ? error.message : "Unknown error occurred" }),
      },
      { status: 500 },
    );
  }
}
