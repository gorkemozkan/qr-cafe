import { signupSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/captcha";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 });
    }

    const { email, password, captchaToken } = validationResult.data;

    const remoteip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown";

    const isCaptchaValid = await verifyTurnstileToken(captchaToken, remoteip);
    if (!isCaptchaValid) {
      return NextResponse.json({ error: "CAPTCHA verification failed. Please try again.", success: false }, { status: 400 });
    }

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
