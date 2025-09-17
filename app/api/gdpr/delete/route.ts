import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { authRateLimiter } from "@/lib/rate-limiter";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message, success: false }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    if (!authRateLimiter.check(request).allowed) {
      return NextResponse.json({ error: http.TOO_MANY_REQUESTS.message, success: false }, { status: http.TOO_MANY_REQUESTS.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message, success: false }, { status: http.UNAUTHORIZED.status });
    }

    const body = await request.json();
    const { confirm_deletion } = body;

    if (!confirm_deletion || confirm_deletion !== true) {
      return NextResponse.json({ error: "Deletion must be explicitly confirmed", success: false }, { status: http.BAD_REQUEST.status });
    }

    try {
      const { error: productsError } = await supabase.from("products").delete().eq("user_id", user.id);

      if (productsError) {
        throw new Error(`Failed to delete products: ${productsError.message}`);
      }

      const { error: categoriesError } = await supabase.from("categories").delete().eq("user_id", user.id);

      if (categoriesError) {
        throw new Error(`Failed to delete categories: ${categoriesError.message}`);
      }

      const { error: cafesError } = await supabase.from("cafes").delete().eq("user_id", user.id);

      if (cafesError) {
        throw new Error(`Failed to delete cafes: ${cafesError.message}`);
      }

      await supabase.auth.signOut();

      return NextResponse.json(
        {
          success: true,
          message: "All user data has been permanently deleted",
          deleted_at: new Date().toISOString(),
        },
        { status: http.SUCCESS.status },
      );
    } catch (_error) {
      return NextResponse.json({ error: "Failed to delete user data", success: false }, { status: http.INTERNAL_SERVER_ERROR.status });
    }
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message, success: false }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
