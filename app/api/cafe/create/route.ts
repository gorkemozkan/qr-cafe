import { slugify } from "@/lib/format";
import { cafeSchema } from "@/lib/schema";
import { TablesInsert } from "@/types/db";
import { verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";
import { invalidateUserCafesCache } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";
import { validatePayloadSize } from "@/lib/payload-validation";
import { createSafeErrorResponse, errorMessages, http } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const payloadValidation = validatePayloadSize(request);

    if (!payloadValidation.isValid) {
      return NextResponse.json({ error: payloadValidation.error }, { status: http.PAYLOAD_TOO_LARGE.status });
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: http.INVALID_REQUEST_ORIGIN.message },
        { status: http.INVALID_REQUEST_ORIGIN.status },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch (_error) {
      return NextResponse.json(
        { error: errorMessages.INVALID_FORMAT("request body") },
        { status: http.BAD_REQUEST.status },
      );
    }

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
      return NextResponse.json(
        { error: errorMessages.RESOURCE_ALREADY_EXISTS("cafe") },
        { status: http.CONFLICT.status },
      );
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
      const safeError = createSafeErrorResponse(error);
      return NextResponse.json({ error: safeError.message }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    invalidateUserCafesCache(user.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const safeError = createSafeErrorResponse(error);
    return NextResponse.json({ error: safeError.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
