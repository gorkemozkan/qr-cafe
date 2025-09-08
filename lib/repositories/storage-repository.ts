export interface UploadResult {
  url: string;
  path: string;
}

export interface StorageError {
  message: string;
  details?: string;
}

export class StorageRepository {
  private baseUrl = "/api/storage";

  async uploadFile(
    file: File,
    cafeSlug: string,
    bucketName: string,
    skipOwnershipCheck = false,
  ): Promise<{ success: true; data: UploadResult } | { success: false; error: StorageError }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("cafeSlug", cafeSlug);
      formData.append("bucketName", bucketName);
      if (skipOwnershipCheck) {
        formData.append("skipOwnershipCheck", "true");
      }

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        return {
          success: false,
          error: {
            message: result.error || "Upload failed",
            details: result.details,
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data as UploadResult,
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

  async deleteFile(
    filePath: string,
    bucketName: string,
  ): Promise<{ success: true; data: undefined } | { success: false; error: StorageError }> {
    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, bucketName }),
      });

      if (!response.ok) {
        const result = await response.json();
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
