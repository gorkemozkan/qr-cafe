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

    const cafeId = parseInt(params.id, 10);
    if (isNaN(cafeId)) {
      return NextResponse.json({ error: "Invalid cafe ID" }, { status: 400 });
    }

    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("cafe_id", cafeId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching products by cafe:", fetchError);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Error in products by cafe route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
