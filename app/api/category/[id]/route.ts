import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("Category GET request started");
    const { id } = await params;
    console.log("Category ID from params:", id);

    const supabase = await createClient();
    console.log("Supabase client created");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("Auth result:", { user: !!user, error: authError });

    if (authError || !user) {
      console.log("Auth failed, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categoryId = parseInt(id, 10);
    console.log("Parsed category ID:", categoryId);

    if (isNaN(categoryId)) {
      console.log("Invalid category ID, returning 400");
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    console.log("Querying Supabase for category:", categoryId);
    const { data: category, error: fetchError } = await supabase.from("categories").select("*").eq("id", categoryId).eq("user_id", user.id).single();

    console.log("Supabase query result:", { category: !!category, error: fetchError });

    if (fetchError) {
      console.error("Error fetching category:", fetchError);
      if (fetchError.code === "PGRST116") {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }

    if (!category) {
      console.log("No category found, returning 404");
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    console.log("Returning category data:", category);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error in category get route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const { data: existingCategory, error: fetchError } = await supabase.from("categories").select("id").eq("id", categoryId).eq("user_id", user.id).single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", categoryId).eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting category:", deleteError);
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in category delete route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
