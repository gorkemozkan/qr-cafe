import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/security";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = parseInt(id, 10);

    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
