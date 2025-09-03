import { loginSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.issues }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 401 });
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
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Authentication failed", success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error", success: false }, { status: 500 });
  }
}
