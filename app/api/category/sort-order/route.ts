import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cafe_id, category_ids } = body;

    if (!cafe_id || !Array.isArray(category_ids)) {
      return NextResponse.json({ error: "Cafe ID and category IDs array are required" }, { status: 400 });
    }

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("id", cafe_id).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    const { data: existingCategories, error: fetchError } = await supabase.from("categories").select("id").eq("cafe_id", cafe_id).eq("user_id", user.id).in("id", category_ids);

    if (fetchError) {
      console.error("Error fetching categories:", fetchError);
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    if (existingCategories.length !== category_ids.length) {
      return NextResponse.json({ error: "Some categories not found or access denied" }, { status: 404 });
    }

    const updates = category_ids.map((categoryId: number, index: number) => ({
      id: categoryId,
      sort_order: index + 1,
    }));

    for (const update of updates) {
      const { error: updateError } = await supabase.from("categories").update({ sort_order: update.sort_order }).eq("id", update.id).eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating sort order:", updateError);
        return NextResponse.json({ error: "Failed to update sort order" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in category sort order route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
