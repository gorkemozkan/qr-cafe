import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const cafeId = parseInt(id, 10);

    if (Number.isNaN(cafeId)) {
      return NextResponse.json({ error: "Invalid cafe ID" }, { status: 400 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: cafe, error: fetchError } = await supabase.from("cafes").select("*").eq("id", cafeId).eq("user_id", user.id).single();

    if (fetchError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(cafe);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const cafeId = parseInt(id, 10);

    if (Number.isNaN(cafeId)) {
      return NextResponse.json({ error: "Invalid cafe ID" }, { status: 400 });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, slug, user_id").eq("id", cafeId).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only delete your own cafes" }, { status: 403 });
    }

    const { data: relatedCategories, error: categoriesError } = await supabase.from("categories").select("id").eq("cafe_id", cafeId).limit(1);

    if (categoriesError) {
      return NextResponse.json({ error: "Failed to check related data" }, { status: 500 });
    }

    const { data: relatedProducts, error: productsError } = await supabase.from("products").select("id").eq("cafe_id", cafeId).limit(1);

    if (productsError) {
      return NextResponse.json({ error: "Failed to check related data" }, { status: 500 });
    }

    if (relatedCategories && relatedCategories.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete cafe: It has related categories. Please delete all categories first.",
        },
        { status: 400 },
      );
    }

    if (relatedProducts && relatedProducts.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete cafe: It has related products. Please delete all products first.",
        },
        { status: 400 },
      );
    }

    const { error: deleteError } = await supabase.from("cafes").delete().eq("id", cafeId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete cafe" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Cafe deleted successfully" });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
