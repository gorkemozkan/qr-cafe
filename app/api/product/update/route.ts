import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/schema";

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
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const validationResult = productSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid data", details: validationResult.error.format() }, { status: 400 });
    }

    const { data: existingProduct, error: fetchError } = await supabase.from("products").select("id, cafe_id").eq("id", id).eq("user_id", user.id).single();

    if (fetchError || !existingProduct) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    }

    const { data: product, error: updateError } = await supabase.from("products").update(validationResult.data).eq("id", id).eq("user_id", user.id).select().single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json(product);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
