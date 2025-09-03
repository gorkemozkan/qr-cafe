import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/schema";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
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
      return NextResponse.json(
        { error: "Invalid product data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const { data: product, error: updateError } = await supabase
      .from("products")
      .update({
        ...validatedData,
        user_id: user.id,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating product:", updateError);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in product update route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
