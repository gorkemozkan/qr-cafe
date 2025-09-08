import { http } from "@/lib/http";
import { loginSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { authRateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message, success: false },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    if (!authRateLimiter.check(request).allowed) {
      return NextResponse.json(
        { error: http.TOO_MANY_REQUESTS.message, success: false },
        { status: http.TOO_MANY_REQUESTS.status },
      );
    }

    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: http.BAD_REQUEST.message, details: validationResult.error.issues },
        { status: http.BAD_REQUEST.status },
      );
    }

    const { email, password } = validationResult.data;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json(
        { error: "Invalid email or password", success: false },
        { status: http.UNAUTHORIZED.status },
      );
    }

    if (data.user) {
      return NextResponse.json(
        {
          success: true,
          data: {
            id: data.user.id,
            email: data.user.email,
          },
        },
        { status: http.SUCCESS.status },
      );
    }

    return NextResponse.json(
      { error: http.UNAUTHORIZED.message, success: false },
      { status: http.UNAUTHORIZED.status },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: http.INTERNAL_SERVER_ERROR.message, success: false },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
