import { http } from "@/lib/http";
import { parseNumericId } from "@/lib/utils";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { invalidateUserCafesCache } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const { id } = await params;

    const cafeId = parseNumericId(id);

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const { data: cafe, error: fetchError } = await supabase.from("cafes").select("*").eq("id", cafeId).eq("user_id", user.id).single();

    if (fetchError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    return NextResponse.json(cafe);
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const { id } = await params;

    const cafeId = parseNumericId(id);

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, slug, user_id").eq("id", cafeId).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: http.NOT_FOUND.status });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only delete your own cafes" }, { status: http.FORBIDDEN.status });
    }

    const { error: deleteProductsError } = await supabase.from("products").delete().eq("cafe_id", cafeId);

    if (deleteProductsError) {
      return NextResponse.json({ error: "Failed to delete related products" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    const { error: deleteCategoriesError } = await supabase.from("categories").delete().eq("cafe_id", cafeId);

    if (deleteCategoriesError) {
      return NextResponse.json({ error: "Failed to delete related categories" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    const { error: deleteError } = await supabase.from("cafes").delete().eq("id", cafeId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete cafe" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    invalidateUserCafesCache(user.id);

    return NextResponse.json({ success: true, message: "Cafe deleted successfully" }, { status: http.SUCCESS.status });
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
