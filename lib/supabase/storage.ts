import { BUCKET_NAMES } from "@/config";
import { storageRepository } from "@/lib/repositories/storage-repository";

export async function uploadCafeLogo(file: File, cafeSlug: string) {
  return await storageRepository.uploadFile(file, cafeSlug, BUCKET_NAMES.CAFE_LOGOS);
}

export async function deleteCafeLogo(filePath: string) {
  return await storageRepository.deleteFile(filePath, BUCKET_NAMES.CAFE_LOGOS);
}
