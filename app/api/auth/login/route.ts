import { loginSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { checkAuthRateLimit } from "@/lib/rate-limiter-redis";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { validatePayloadSize } from "@/lib/payload-validation";
import { createSafeErrorResponse, errorMessages, http } from "@/lib/http";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payloadValidation = validatePayloadSize(request);

    if (!payloadValidation.isValid) {
      return NextResponse.json(
        { error: payloadValidation.error, success: false },
        { status: http.PAYLOAD_TOO_LARGE.status },
      );
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message, success: false },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    const rateLimitResult = await checkAuthRateLimit(request);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: http.TOO_MANY_REQUESTS.message, success: false },
        { status: http.TOO_MANY_REQUESTS.status },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch (_error) {
      return NextResponse.json(
        { error: errorMessages.INVALID_FORMAT("request body"), success: false },
        { status: http.BAD_REQUEST.status },
      );
    }

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
        { error: errorMessages.INVALID_CREDENTIALS, success: false },
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
  } catch (error) {
    const safeError = createSafeErrorResponse(error);
    return NextResponse.json(
      { error: safeError.message, success: false },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
