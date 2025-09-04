import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ count: totalCafes }, { count: totalCategories }, { count: totalProducts }, { count: activeProducts }] = await Promise.all([
      supabase.from("cafes").select("*", { count: "exact", head: true }).eq("user_id", user.id),

      supabase.from("categories").select("*", { count: "exact", head: true }).eq("user_id", user.id),

      supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id),

      supabase.from("products").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_available", true),
    ]);

    const stats = {
      totalCafes: totalCafes || 0,
      totalCategories: totalCategories || 0,
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
    };

    return NextResponse.json(stats);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
