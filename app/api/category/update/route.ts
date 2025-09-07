import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";

export async function PUT(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

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

    const validationResult = categorySchema.partial().safeParse(updateData);
    if (!validationResult.success) {
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

    const { data: existingCategory, error: fetchError } = await supabase
      .from("categories")
      .select("id, cafe_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: "Category not found or access denied" }, { status: 404 });
    }

    const { data: category, error: updateError } = await supabase
      .from("categories")
      .update(processedData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
