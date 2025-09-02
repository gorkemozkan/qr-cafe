import { signupSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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
      console.error("Signup error:", error);
      return NextResponse.json({ error: error.message, success: false }, { status: 400 });
    }

    if (data.user) {
      revalidatePath("/", "layout");

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
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
