import { http } from "@/lib/http";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { invalidatePublicCafeCache } from "@/lib/redis";

export async function PUT(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const body = await request.json();

    const { cafe_id, category_ids } = body;

    if (!cafe_id || !Array.isArray(category_ids)) {
      return NextResponse.json({ error: "Cafe ID and category IDs array are required" }, { status: http.BAD_REQUEST.status });
    }

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id, slug").eq("id", cafe_id).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { data: existingCategories, error: fetchError } = await supabase
      .from("categories")
      .select("id")
      .eq("cafe_id", cafe_id)
      .eq("user_id", user.id)
      .in("id", category_ids);

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    if (existingCategories.length !== category_ids.length) {
      return NextResponse.json({ error: "Some categories not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const updates = category_ids.map((categoryId: number, index: number) => ({
      id: categoryId,
      sort_order: index + 1,
    }));

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("categories")
        .update({ sort_order: update.sort_order })
        .eq("id", update.id)
        .eq("user_id", user.id);

      if (updateError) {
        return NextResponse.json({ error: "Failed to update sort order" }, { status: http.INTERNAL_SERVER_ERROR.status });
      }
    }

    invalidatePublicCafeCache(cafe.slug);

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
