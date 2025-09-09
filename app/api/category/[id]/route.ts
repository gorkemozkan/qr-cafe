import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const categoryId = parseInt(id, 10);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: category, error: fetchError } = await supabase.from("categories").select("*").eq("id", categoryId).eq("user_id", user.id).single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Category not found" }, { status: http.NOT_FOUND.status });
      }
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: http.NOT_FOUND.status });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", categoryId).eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
