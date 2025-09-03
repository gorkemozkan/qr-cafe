import { signupSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { authRateLimit, verifyCsrfToken } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!authRateLimit(request)) {
      return NextResponse.json({ error: "Too many signup attempts. Please try again later.", success: false }, { status: 429 });
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin", success: false }, { status: 403 });
    }

    const body = await request.json();

    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/admin/auth/login`,
      },
    });

    if (error) {
      return NextResponse.json({ error: "Failed to create account", success: false }, { status: 400 });
    }

    if (data.user) {
      return NextResponse.json(
        {
          success: true,
          data: {
            id: data.user.id,
            email: data.user.email,
          },
          message: "Account created successfully! Please check your email to verify your account.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Account creation failed", success: false }, { status: 400 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
