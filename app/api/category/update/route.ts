import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { http } from "@/lib/http";

export async function PUT(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const validationResult = categorySchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: http.BAD_REQUEST.status },
      );
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
      return NextResponse.json({ error: "Category not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { data: category, error: updateError } = await supabase
      .from("categories")
      .update(processedData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update category" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
