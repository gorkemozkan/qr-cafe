import { loginSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/captcha";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 });
    }

    const { email, password, captchaToken } = validationResult.data;

    const isCaptchaValid = await verifyTurnstileToken(captchaToken);

    if (!isCaptchaValid) {
      return NextResponse.json({ error: "CAPTCHA verification failed. Please try again.", success: false }, { status: 400 });
    }

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
