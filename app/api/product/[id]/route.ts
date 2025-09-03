import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { data: product, error: fetchError } = await supabase.from("products").select("*").eq("id", id).eq("user_id", user.id).single();

    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in product get route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { error: deleteError } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in product delete route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
