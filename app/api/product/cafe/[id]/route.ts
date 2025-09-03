import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const cafeId = parseInt(id, 10);
    if (Number.isNaN(cafeId)) {
      return NextResponse.json({ error: "Invalid cafe ID" }, { status: 400 });
    }

    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("cafe_id", cafeId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    return NextResponse.json(products || []);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
