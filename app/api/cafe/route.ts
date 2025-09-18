import { NextRequest, NextResponse } from "next/server";
import { isNextDevelopment } from "@/lib/env";
import { http } from "@/lib/http";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { getCacheKeys, redis } from "@/lib/redis";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

const CACHE_EXPIRATION = 300;

export async function GET(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    if (!apiRateLimiter.check(request).allowed) {
      return NextResponse.json({ error: "Too many cafes requests. Please try again later." }, { status: http.TOO_MANY_REQUESTS.status });
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

    const { data: cafes, error } = await supabase.from("cafes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch cafes" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    const cafesData = cafes || [];

    if (!isNextDevelopment) {
      try {
        await redis.setex(cacheKey, CACHE_EXPIRATION, cafesData);
      } catch (_error) {}
    }

    return NextResponse.json(cafesData);
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
