import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cafeId = parseInt(id, 10);
    if (Number.isNaN(cafeId)) {
      return NextResponse.json({ error: "Invalid cafe ID" }, { status: 400 });
    }

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("id", cafeId).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    console.log(cafe);

    const { data: categories, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

    return NextResponse.json(categories || []);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
