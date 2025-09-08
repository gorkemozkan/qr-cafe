import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/security";
import { uploadRateLimiter } from "@/lib/rate-limiter";
import { http } from "@/lib/http";

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: http.INVALID_REQUEST_ORIGIN.status });
    }

    if (!uploadRateLimiter.check(request).allowed) {
      return NextResponse.json(
        { error: "Too many delete attempts. Please try again later." },
        { status: http.TOO_MANY_REQUESTS.status },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Please log in to delete files" }, { status: http.UNAUTHORIZED.status });
    }

    const { filePath, bucketName } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: http.BAD_REQUEST.status });
    }

    if (!filePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: "Unauthorized to delete this file" }, { status: http.UNAUTHORIZED.status });
    }

    const { error } = await supabase.storage.from(bucketName).remove([filePath]);

    if (error) {
      return NextResponse.json(
        {
          error: "Delete failed",
        },
        { status: http.INTERNAL_SERVER_ERROR.status },
      );
    }

    return NextResponse.json(null);
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Delete failed",
      },
      { status: http.INTERNAL_SERVER_ERROR.status },
    );
  }
}
