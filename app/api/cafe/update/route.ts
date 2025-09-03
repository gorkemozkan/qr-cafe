import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cafeSchema } from "@/lib/schema";

export async function PUT(request: NextRequest) {
  try {
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
      return NextResponse.json({ error: "Cafe ID is required" }, { status: 400 });
    }

    const validationResult = cafeSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, user_id, slug").eq("id", id).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this cafe" }, { status: 403 });
    }

    if (updateData.slug && updateData.slug !== existingCafe.slug) {
      const { data: slugExists } = await supabase.from("cafes").select("id").eq("slug", updateData.slug).neq("id", id).single();

      if (slugExists) {
        return NextResponse.json({ error: "A cafe with this slug already exists" }, { status: 409 });
      }
    }

    const { data, error } = await supabase.from("cafes").update(validationResult.data).eq("id", id).select().single();

    if (error) {
      return NextResponse.json({ error: "Failed to update cafe" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
