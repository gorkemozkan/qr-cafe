import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateBucketName, verifyCsrfToken } from "@/lib/security";
import { uploadRateLimiter } from "@/lib/rate-limiter";

export async function DELETE(request: NextRequest) {
  try {
    // CSRF protection
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    // Rate limiting
    if (!uploadRateLimiter.check(request).allowed) {
      return NextResponse.json({ error: "Too many delete attempts. Please try again later." }, { status: 429 });
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Please log in to delete files" }, { status: 401 });
    }

    const { filePath, bucketName } = await request.json();

    if (!filePath || !bucketName) {
      return NextResponse.json({ error: "File path and bucket name are required" }, { status: 400 });
    }

    // Validate bucket name
    if (!validateBucketName(bucketName)) {
      return NextResponse.json({ error: "Invalid bucket name" }, { status: 400 });
    }

    if (!filePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Unauthorized to delete this file" }, { status: 403 });
    }

    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      return NextResponse.json(
        {
          error: "Delete failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(null);
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Delete failed",
      },
      { status: 500 },
    );
  }
}
