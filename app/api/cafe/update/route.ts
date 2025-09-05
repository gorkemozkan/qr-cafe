import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cafeSchema } from "@/lib/schema";
import { slugify } from "@/lib/utils";

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

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, user_id, slug, name").eq("id", id).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: 404 });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this cafe" }, { status: 403 });
    }

    // Generate new slug if name has changed
    let finalSlug = existingCafe.slug;
    if (validationResult.data.name && validationResult.data.name !== existingCafe.name) {
      const baseSlug = slugify(validationResult.data.name, { maxLength: 50 });
      let newSlug = baseSlug;
      let counter = 1;

      // Check for existing slugs and make it unique if needed
      while (true) {
        const { data: slugExists } = await supabase.from("cafes").select("id").eq("slug", newSlug).neq("id", id).single();

        if (!slugExists) break;

        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      finalSlug = newSlug;
    }

    const { data, error } = await supabase
      .from("cafes")
      .update({
        name: validationResult.data.name,
        slug: finalSlug,
        description: validationResult.data.description || null,
        logo_url: validationResult.data.logo_url || null,
        currency: validationResult.data.currency,
        is_active: validationResult.data.is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update cafe" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
