import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/schema";

export async function POST(request: NextRequest) {
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

    const { cafe_id, ...categoryData } = body;

    if (!cafe_id) {
      return NextResponse.json({ error: "Cafe ID is required" }, { status: 400 });
    }

    const validationResult = categorySchema.safeParse(categoryData);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid data", details: validationResult.error.issues }, { status: 400 });
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

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("id", cafe_id).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
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
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }

    return NextResponse.json(category);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
