import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

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

    const { data: cafes, error } = await supabase.from("cafes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch cafes" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(cafes || []);
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
