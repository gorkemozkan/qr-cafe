import { storageRepository, type UploadResult, type StorageError } from "@/lib/repositories/storage-repository";

export const CAFE_LOGOS_BUCKET_NAME = "cafe-logos";

export type { UploadResult, StorageError };

export async function uploadCafeLogo(file: File, cafeSlug: string): Promise<{ success: true; data: UploadResult } | { success: false; error: StorageError }> {
  return await storageRepository.uploadFile(file, cafeSlug, CAFE_LOGOS_BUCKET_NAME);
}

export async function deleteCafeLogo(filePath: string): Promise<{ success: true; data: void } | { success: false; error: StorageError }> {
  return await storageRepository.deleteFile(filePath, CAFE_LOGOS_BUCKET_NAME);
}
