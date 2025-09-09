import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { productSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { invalidatePublicCafeCache } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const body = await request.json();
    const { cafe_id, ...productData } = body;

    if (!cafe_id) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id, slug").eq("id", cafe_id).eq("user_id", user.id).single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const validationResult = productSchema.safeParse(productData);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid product data", details: validationResult.error.issues }, { status: http.BAD_REQUEST.status });
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
      return NextResponse.json({ error: "Failed to create product" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    invalidatePublicCafeCache(cafe.slug);

    return NextResponse.json(product);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
