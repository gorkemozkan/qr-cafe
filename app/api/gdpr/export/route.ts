import { NextRequest, NextResponse } from "next/server";
import { createSafeErrorResponse, errorMessages, http } from "@/lib/http";
import { authRateLimiter } from "@/lib/rate-limiter";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message, success: false }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    if (!authRateLimiter.check(request).allowed) {
      return NextResponse.json(
        { error: errorMessages.RATE_LIMIT_EXCEEDED(Date.now() + 900000), success: false },
        { status: http.TOO_MANY_REQUESTS.status },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message, success: false }, { status: http.UNAUTHORIZED.status });
    }

    let cafesData: any[] = [];

    let categoriesData: any[] = [];

    let productsData: any[] = [];

    try {
      const [cafesResult, categoriesResult, productsResult] = await Promise.all([
        supabase.from("cafes").select("*").eq("user_id", user.id),
        supabase.from("categories").select("*").eq("user_id", user.id),
        supabase.from("products").select("*").eq("user_id", user.id),
      ]);

      if (cafesResult.error) throw new Error(`Cafes query failed: ${cafesResult.error.message}`);
      if (categoriesResult.error) throw new Error(`Categories query failed: ${categoriesResult.error.message}`);
      if (productsResult.error) throw new Error(`Products query failed: ${productsResult.error.message}`);

      cafesData = cafesResult.data || [];
      categoriesData = categoriesResult.data || [];
      productsData = productsResult.data || [];
    } catch (_queryError) {
      return NextResponse.json({ error: errorMessages.DATABASE_ERROR, success: false }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      cafes: cafesData,
      categories: categoriesData,
      products: productsData,
      export_date: new Date().toISOString(),
      gdpr_compliant: true,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: http.SUCCESS.status,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="gdpr-data-export-${user.id}-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    const safeError = createSafeErrorResponse(error);
    return NextResponse.json({ error: safeError.message, success: false }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
