import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/security";

export async function PUT(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Ensure we include user_id in the update to satisfy RLS policy
    const updateDataWithUserId = {
      ...updateData,
      user_id: user.id,
    };

    const { data: product, error: updateError } = await supabase
      .from("products")
      .update(updateDataWithUserId)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    return NextResponse.json(product);
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
