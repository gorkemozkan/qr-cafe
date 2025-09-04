import { loginSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { authRateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!authRateLimiter.check(request)) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later.", success: false }, { status: 429 });
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin", success: false }, { status: 403 });
    }

    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: "Invalid email or password", success: false }, { status: 401 });
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
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Authentication failed", success: false }, { status: 401 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
