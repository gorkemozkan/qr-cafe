import { http } from "@/lib/http";
import { isNextDevelopment } from "@/lib/env";
import { getCacheKeys, redis } from "@/lib/redis";
import { verifyCsrfToken } from "@/lib/security";
import { checkApiRateLimit } from "@/lib/rate-limiter-redis";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const CACHE_TTL = 300; // 300 seconds = 5 minutes

export async function GET(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    const rateLimitResult = await checkApiRateLimit(request);

    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: http.TOO_MANY_REQUESTS.message }, { status: http.TOO_MANY_REQUESTS.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const cacheKey = getCacheKeys.cafes(user.id);

    if (!isNextDevelopment) {
      try {
        const cachedCafes = await redis.get(cacheKey);

        if (cachedCafes) {
          return NextResponse.json(cachedCafes);
        }
      } catch (_error) {}
    }

    const { data: cafes, error } = await supabase
      .from("cafes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: http.INTERNAL_SERVER_ERROR.message },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    const cafesData = cafes || [];

    if (!isNextDevelopment) {
      try {
        await redis.setex(cacheKey, CACHE_TTL, cafesData);
      } catch (_error) {}
    }

    return NextResponse.json(cafesData);
  } catch (_error) {
    return NextResponse.json(
      { error: http.INTERNAL_SERVER_ERROR.message },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
