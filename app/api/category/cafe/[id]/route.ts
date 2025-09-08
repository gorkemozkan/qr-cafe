import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { http } from "@/lib/http";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!apiRateLimiter.check(request).allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: http.TOO_MANY_REQUESTS.status },
      );
    }

    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const cafeId = parseInt(id, 10);
    if (Number.isNaN(cafeId)) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id")
      .eq("id", cafeId)
      .eq("user_id", user.id)
      .single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { data: categories, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(categories || []);
  } catch (_error) {
    return NextResponse.json(
      { error: http.INTERNAL_SERVER_ERROR.message },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
