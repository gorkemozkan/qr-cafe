import { NextResponse } from "next/server";
import { parseNumericId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

interface Params {
  id: string;
}

export async function GET(_request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;

    const cafeId = parseNumericId(id, "cafe ID");

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: cafe, error: fetchError } = await supabase.from("cafes").select("*").eq("id", cafeId).eq("user_id", user.id).single();

    if (fetchError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(cafe);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;

    const cafeId = parseNumericId(id, "cafe ID");

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, slug, user_id").eq("id", cafeId).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only delete your own cafes" }, { status: 403 });
    }

    const { error: deleteProductsError } = await supabase.from("products").delete().eq("cafe_id", cafeId);

    if (deleteProductsError) {
      return NextResponse.json({ error: "Failed to delete related products" }, { status: 500 });
    }

    const { error: deleteCategoriesError } = await supabase.from("categories").delete().eq("cafe_id", cafeId);

    if (deleteCategoriesError) {
      return NextResponse.json({ error: "Failed to delete related categories" }, { status: 500 });
    }

    const { error: deleteError } = await supabase.from("cafes").delete().eq("id", cafeId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete cafe" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Cafe deleted successfully" });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
