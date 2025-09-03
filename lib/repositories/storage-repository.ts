import { BaseRepository } from "@/lib/repositories/base-repository";

export interface UploadResult {
  url: string;
  path: string;
}

export interface StorageError {
  message: string;
  details?: string;
}

export interface BucketStatus {
  exists: boolean;
  accessible: boolean;
}

export class StorageRepository extends BaseRepository {
  protected readonly baseUrl = "/api/storage";

  async uploadFile(file: File, cafeSlug: string, bucketName: string): Promise<{ success: true; data: UploadResult } | { success: false; error: StorageError }> {
    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append("cafeSlug", cafeSlug);

      formData.append("bucketName", bucketName);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: result.error || "Upload failed",
            details: result.details,
          },
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Upload failed",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  async deleteFile(filePath: string, bucketName: string): Promise<{ success: true; data: void } | { success: false; error: StorageError }> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, bucketName }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: result.error || "Delete failed",
            details: result.details,
          },
        };
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Delete failed",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}

export const storageRepository = new StorageRepository();
