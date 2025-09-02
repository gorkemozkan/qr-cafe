import { createClient } from "@/lib/supabase/client";
import { supabaseConfig } from "@/lib/supabase/config";

export const CAFE_LOGOS_BUCKET_NAME = "cafe-logos";

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadCafeLogo(file: File, cafeSlug: string): Promise<UploadResult> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const fileExt = file.name.split(".").pop();

    const fileName = `${cafeSlug}-${Date.now()}.${fileExt}`;

    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage.from(CAFE_LOGOS_BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(CAFE_LOGOS_BUCKET_NAME).getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    return {
      url: "",
      path: "",
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteCafeLogo(filePath: string): Promise<{ error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(CAFE_LOGOS_BUCKET_NAME).remove([filePath]);

    if (error) {
      throw new Error(error.message);
    }

    return {};
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export function getStorageUrl(filePath: string): string {
  if (supabaseConfig.environment === "development") {
    return `http://127.0.0.1:54321/storage/v1/object/public/${CAFE_LOGOS_BUCKET_NAME}/${filePath}`;
  }

  return `${supabaseConfig.supabaseUrl}/storage/v1/object/public/${CAFE_LOGOS_BUCKET_NAME}/${filePath}`;
}

export async function createBucketIfNotExists(bucketName: string): Promise<void> {
  try {
    const supabase = createClient();

    const { data: buckets } = await supabase.storage.listBuckets();

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        fileSizeLimit: 5 * 1024 * 1024,
      });

      if (error) {
        console.error("Failed to create bucket:", error);
      }
    }
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
  }
}
