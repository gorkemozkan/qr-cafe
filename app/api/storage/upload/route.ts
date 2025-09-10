import { NextRequest, NextResponse } from "next/server";
import { createSafeErrorResponse, errorMessages, http } from "@/lib/http";
import { validatePayloadSize } from "@/lib/payload-validation";
import { uploadRateLimiter } from "@/lib/rate-limiter";
import { validateBucketName, validateFileType, verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const payloadValidation = validatePayloadSize(request);

    if (!payloadValidation.isValid) {
      return NextResponse.json({ error: payloadValidation.error }, { status: http.PAYLOAD_TOO_LARGE.status });
    }

    if (!uploadRateLimiter.check(request).allowed) {
      return NextResponse.json({ error: errorMessages.RATE_LIMIT_EXCEEDED(Date.now() + 60000) }, { status: http.TOO_MANY_REQUESTS.status });
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: http.INVALID_REQUEST_ORIGIN.message }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: http.UNAUTHORIZED.message }, { status: http.UNAUTHORIZED.status });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (_error) {
      return NextResponse.json({ error: errorMessages.INVALID_FORMAT("form data") }, { status: http.BAD_REQUEST.status });
    }

    const file = formData.get("file") as File;
    const cafeSlug = formData.get("cafeSlug") as string;
    const bucketName = formData.get("bucketName") as string;
    const skipOwnershipCheck = formData.get("skipOwnershipCheck") === "true";

    if (!file || !cafeSlug || !bucketName) {
      return NextResponse.json({ error: errorMessages.REQUIRED_FIELD("file, cafe slug, and bucket name") }, { status: http.BAD_REQUEST.status });
    }

    // Validate bucket name
    if (!validateBucketName(bucketName)) {
      return NextResponse.json({ error: errorMessages.INVALID_FORMAT("bucket name") }, { status: http.BAD_REQUEST.status });
    }

    // Validate file type and security
    const fileValidation = validateFileType(file);
    if (!fileValidation.isValid) {
      return NextResponse.json({ error: fileValidation.error }, { status: http.BAD_REQUEST.status });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: errorMessages.FILE_TOO_LARGE("5MB") }, { status: http.BAD_REQUEST.status });
    }

    // Only check ownership if not explicitly skipped (for new cafe creation)
    if (!skipOwnershipCheck) {
      const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("slug", cafeSlug).eq("user_id", user.id).single();

      if (cafeError || !cafe) {
        return NextResponse.json({ error: errorMessages.RESOURCE_ACCESS_DENIED("cafe") }, { status: http.FORBIDDEN.status });
      }
    }

    const sanitizedName = fileValidation.sanitizedName || file.name;

    const fileExt = sanitizedName.split(".").pop()?.toLowerCase();

    const fileName = `${cafeSlug}-${Date.now()}.${fileExt}`;

    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: errorMessages.STORAGE_ERROR }, { status: http.INTERNAL_SERVER_ERROR.status });
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    const safeError = createSafeErrorResponse(error);
    return NextResponse.json({ error: safeError.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
