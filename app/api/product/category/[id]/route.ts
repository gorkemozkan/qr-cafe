import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { parseNumericId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const { id } = await params;

    let categoryId: number;
    try {
      categoryId = parseNumericId(id);
    } catch (_error) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("cafe_id")
      .eq("id", categoryId)
      .eq("user_id", user.id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("cafe_id", category.cafe_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(products || []);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
