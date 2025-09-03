import { storageRepository, type UploadResult, type StorageError } from "@/lib/repositories/storage-repository";

export const CAFE_LOGOS_BUCKET_NAME = "cafe-logos";

export type { UploadResult, StorageError };

type Result<T> = { success: true; data: T } | { success: false; error: StorageError };

export async function uploadCafeLogo(file: File, cafeSlug: string): Promise<Result<UploadResult>> {
  return await storageRepository.uploadFile(file, cafeSlug, CAFE_LOGOS_BUCKET_NAME);
}

export async function deleteCafeLogo(filePath: string): Promise<Result<void>> {
  return await storageRepository.deleteFile(filePath, CAFE_LOGOS_BUCKET_NAME);
}
