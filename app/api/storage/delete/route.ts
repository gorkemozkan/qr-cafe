import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/security";

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
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

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
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
