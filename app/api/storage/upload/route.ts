import { NextRequest, NextResponse } from "next/server";
import { http } from "@/lib/http";
import { uploadRateLimiter } from "@/lib/rate-limiter";
import { validateBucketName, validateFileType, verifyCsrfToken } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    if (!uploadRateLimiter.check(request).allowed) {
      return NextResponse.json({ error: "Too many upload attempts. Please try again later." }, { status: http.TOO_MANY_REQUESTS.status });
    }

    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Please log in to upload files" }, { status: http.UNAUTHORIZED.status });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cafeSlug = formData.get("cafeSlug") as string;
    const bucketName = formData.get("bucketName") as string;
    const skipOwnershipCheck = formData.get("skipOwnershipCheck") === "true";

    if (!file || !cafeSlug || !bucketName) {
      return NextResponse.json({ error: "File, cafe slug, and bucket name are required" }, { status: http.BAD_REQUEST.status });
    }

    // Validate bucket name
    if (!validateBucketName(bucketName)) {
      return NextResponse.json({ error: "Invalid bucket name" }, { status: http.BAD_REQUEST.status });
    }

    // Validate file type and security
    const fileValidation = validateFileType(file);
    if (!fileValidation.isValid) {
      return NextResponse.json({ error: fileValidation.error }, { status: http.BAD_REQUEST.status });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: http.BAD_REQUEST.status });
    }

    // Only check ownership if not explicitly skipped (for new cafe creation)
    if (!skipOwnershipCheck) {
      const { data: cafe, error: cafeError } = await supabase.from("cafes").select("id").eq("slug", cafeSlug).eq("user_id", user.id).single();

      if (cafeError || !cafe) {
        return NextResponse.json({ error: "Cafe not found or access denied" }, { status: http.NOT_FOUND.status });
      }
    }

    const sanitizedName = fileValidation.sanitizedName || file.name;

    const fileExt = sanitizedName.split(".").pop()?.toLowerCase();

    const fileName = `${cafeSlug}-${Date.now()}.${fileExt}`;

    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Upload failed: ${uploadError.message}`,
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
