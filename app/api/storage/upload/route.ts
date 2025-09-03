import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Please log in to upload files" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cafeSlug = formData.get("cafeSlug") as string;
    const bucketName = formData.get("bucketName") as string;

    if (!file || !cafeSlug) {
      return NextResponse.json({ error: "File and cafe slug are required" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes = ["png", "jpeg", "jpg", "gif", "webp"];

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          details: `Allowed: ${allowedTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "File too large",
          details: "Maximum size is 5MB",
        },
        { status: 400 },
      );
    }

    const fileName = `${cafeSlug}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return NextResponse.json(
        {
          error: "Upload failed",
        },
        { status: 500 },
      );
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        error: "Upload failed",
      },
      { status: 500 },
    );
  }
}
