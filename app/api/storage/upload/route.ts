import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadRateLimit, validateFileType, validateBucketName, verifyCsrfToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (!uploadRateLimit(request)) {
      return NextResponse.json({ error: "Too many upload attempts. Please try again later." }, { status: 429 });
    }
    
    // CSRF protection
    if (!verifyCsrfToken(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

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

    if (!file || !cafeSlug || !bucketName) {
      return NextResponse.json({ error: "File, cafe slug, and bucket name are required" }, { status: 400 });
    }

    // Validate bucket name
    if (!validateBucketName(bucketName)) {
      return NextResponse.json({ error: "Invalid bucket name" }, { status: 400 });
    }

    // Validate file type and security
    const fileValidation = validateFileType(file);
    if (!fileValidation.isValid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Verify user owns the cafe slug
    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id")
      .eq("slug", cafeSlug)
      .eq("user_id", user.id)
      .single();

    if (cafeError || !cafe) {
      return NextResponse.json({ error: "Cafe not found or access denied" }, { status: 404 });
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
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
