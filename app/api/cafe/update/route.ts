import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/format";
import { http } from "@/lib/http";
import { cafeSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { invalidateUserCafesCache, invalidatePublicCafeCache } from "@/lib/redis";

export async function PUT(request: NextRequest) {
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

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: http.BAD_REQUEST.message }, { status: http.BAD_REQUEST.status });
    }

    const validationResult = cafeSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: http.BAD_REQUEST.status },
      );
    }

    const { data: existingCafe, error: fetchError } = await supabase.from("cafes").select("id, user_id, slug, name").eq("id", id).single();

    if (fetchError || !existingCafe) {
      return NextResponse.json({ error: "Cafe not found" }, { status: http.NOT_FOUND.status });
    }

    if (existingCafe.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this cafe" }, { status: http.FORBIDDEN.status });
    }

    let finalSlug = existingCafe.slug;
    if (validationResult.data.name && validationResult.data.name !== existingCafe.name) {
      finalSlug = slugify(validationResult.data.name, { maxLength: 50 });

      const { data: slugExists } = await supabase.from("cafes").select("id").eq("slug", finalSlug).neq("id", id).single();

      if (slugExists) {
        return NextResponse.json({ error: "A cafe with this name already exists" }, { status: http.CONFLICT.status });
      }
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
      return NextResponse.json({ error: "Failed to update cafe" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    invalidateUserCafesCache(user.id);

    // Invalidate public cafe cache for both old and new slugs
    if (existingCafe.slug !== finalSlug) {
      invalidatePublicCafeCache(existingCafe.slug);
    }
    invalidatePublicCafeCache(finalSlug);

    return NextResponse.json(data, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
