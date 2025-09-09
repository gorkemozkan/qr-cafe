import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/format";
import { http } from "@/lib/http";
import { cafeSchema } from "@/lib/schema";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/types/db";

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

    const validationResult = cafeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: http.BAD_REQUEST.status },
      );
    }

    const slug = slugify(validationResult.data.name, { maxLength: 50 });

    const { data: existingCafe } = await supabase.from("cafes").select("id").eq("slug", slug).single();

    if (existingCafe) {
      return NextResponse.json({ error: "A cafe with this name already exists" }, { status: http.CONFLICT.status });
    }

    const cafeData: TablesInsert<"cafes"> = {
      name: validationResult.data.name,
      user_id: user.id,
      description: validationResult.data.description || null,
      logo_url: validationResult.data.logo_url || null,
      currency: validationResult.data.currency,
      is_active: validationResult.data.is_active,
      slug: slug,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("cafes").insert([cafeData]).select().single();

    if (error) {
      return NextResponse.json({ error: "Failed to create cafe" }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: http.INTERNAL_SERVER_ERROR.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
