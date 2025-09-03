import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/schema";

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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    console.log("Update data received:", updateData);

    const validationResult = categorySchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.format());
      return NextResponse.json({ error: "Invalid data", details: validationResult.error.format() }, { status: 400 });
    }

    // Process the validated data to ensure proper types
    const processedData = {
      ...validationResult.data,
      sort_order:
        validationResult.data.sort_order === ""
          ? null
          : typeof validationResult.data.sort_order === "string"
            ? Number(validationResult.data.sort_order)
            : validationResult.data.sort_order,
    };

    console.log("Processed data:", processedData);

    const { data: existingCategory, error: fetchError } = await supabase.from("categories").select("id, cafe_id").eq("id", id).eq("user_id", user.id).single();

    if (fetchError || !existingCategory) {
      console.error("Category fetch error:", fetchError);
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    console.log("Existing category:", existingCategory);

    const { data: category, error: updateError } = await supabase.from("categories").update(processedData).eq("id", id).eq("user_id", user.id).select().single();

    if (updateError) {
      console.error("Error updating category:", updateError);
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }

    console.log("Category updated successfully:", category);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error in category update route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
