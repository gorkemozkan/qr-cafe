import { createClient } from "@/lib/supabase/server";
import { uploadRateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";
import { validatePayloadSize } from "@/lib/payload-validation";
import { createSafeErrorResponse, errorMessages, http } from "@/lib/http";
import { validateBucketName, validateFileType, verifyCsrfToken } from "@/lib/security";
import { MAX_FILE_SIZE_FOR_STORAGE } from "@/components/common/DataTable/constants";

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

    if (!file || !cafeSlug || !bucketName) {
      return NextResponse.json({ error: errorMessages.REQUIRED_FIELD("file, cafe slug, and bucket name") }, { status: http.BAD_REQUEST.status });
    }

    if (!validateBucketName(bucketName)) {
      return NextResponse.json({ error: errorMessages.INVALID_FORMAT("bucket name") }, { status: http.BAD_REQUEST.status });
    }

    const fileValidation = validateFileType(file);
    if (!fileValidation.isValid) {
      return NextResponse.json({ error: fileValidation.error }, { status: http.BAD_REQUEST.status });
    }

    if (file.size > MAX_FILE_SIZE_FOR_STORAGE) {
      return NextResponse.json({ error: errorMessages.FILE_TOO_LARGE("5MB") }, { status: http.BAD_REQUEST.status });
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
