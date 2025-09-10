import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { invalidatePublicCafeCache } from "@/lib/redis";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: product, error: fetchError } = await supabase.from("products").select("*").eq("id", productId).eq("user_id", user.id).single();

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch product" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    return NextResponse.json(product);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, cafes!inner(slug)")
      .eq("id", productId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: http.NOT_FOUND.status });
    }

    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId).eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    invalidatePublicCafeCache(product.cafes.slug);

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
