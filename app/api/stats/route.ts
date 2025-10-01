import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: http.UNAUTHORIZED.status });
    }

    const [{ count: totalCafes }, { count: totalCategories }, { count: totalProducts }, { count: activeProducts }] =
      await Promise.all([
        supabase.from("cafes").select("*", { count: "exact", head: true }).eq("user_id", user.id),

        supabase.from("categories").select("*", { count: "exact", head: true }).eq("user_id", user.id),

        supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_available", true),
      ]);

    const stats = {
      totalCafes: totalCafes || 0,
      totalCategories: totalCategories || 0,
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
    };

    return NextResponse.json(stats);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
