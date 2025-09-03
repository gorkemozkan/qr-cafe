import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/schema";

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
    const { cafe_id, ...productData } = body;

    if (!cafe_id) {
      return NextResponse.json({ error: "Cafe ID is required" }, { status: 400 });
    }

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("id", cafe_id).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    const validationResult = productSchema.safeParse(productData);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid product data", details: validationResult.error.issues }, { status: 400 });
    }

    const validatedData = validationResult.data;

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        ...validatedData,
        cafe_id,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    return NextResponse.json(product);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
