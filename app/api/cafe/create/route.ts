import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cafeSchema } from "@/lib/schema";
import { TablesInsert } from "@/types/db";
import { slugify } from "@/lib/utils";
import { verifyCsrfToken } from "@/lib/security";

export async function POST(request: NextRequest) {
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

    const validationResult = cafeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const slug = slugify(validationResult.data.name, { maxLength: 50 });

    const { data: existingCafe } = await supabase.from("cafes").select("id").eq("slug", slug).single();

    if (existingCafe) {
      return NextResponse.json({ error: "A cafe with this name already exists" }, { status: 409 });
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
      return NextResponse.json({ error: "Failed to create cafe" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
