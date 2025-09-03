import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    // First get the category to get the cafe_id
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("cafe_id")
      .eq("id", categoryId)
      .eq("user_id", user.id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    // Then get products by category and cafe
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("cafe_id", category.cafe_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching products by category:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Error in products by category route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
