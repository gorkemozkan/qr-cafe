import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { http } from "@/lib/http";

export async function POST(request: NextRequest) {
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

    const { cafe_id, ...categoryData } = body;

    if (!cafe_id) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const validationResult = categorySchema.safeParse(categoryData);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.issues },
        { status: http.BAD_REQUEST.status },
      );
    }

    // Process the validated data to ensure proper types
    const processedData = {
      ...validationResult.data,
      sort_order:
        validationResult.data.sort_order === "" || validationResult.data.sort_order === undefined
          ? null
          : typeof validationResult.data.sort_order === "string"
            ? Number(validationResult.data.sort_order)
            : validationResult.data.sort_order,
    };

    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id")
      .eq("id", cafe_id)
      .eq("user_id", user.id)
      .single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { data: category, error: insertError } = await supabase
      .from("categories")
      .insert({
        ...processedData,
        cafe_id,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Failed to create category" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json(
      { error: http.INTERNAL_SERVER_ERROR.message },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
