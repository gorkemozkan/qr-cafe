import { NextRequest } from "next/server";

// Re-export from the new rate limiter module for backward compatibility
export { authRateLimit, uploadRateLimit } from "@/lib/rate-limiter";

// CSRF protection
export function verifyCsrfToken(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  const allowedOrigins = [`https://${host}`, `http://${host}`, ...(process.env.ALLOWED_ORIGINS?.split(",") || [])];

  return allowedOrigins.includes(origin);
}

// File validation helpers
export function validateFileType(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ["png", "jpeg", "jpg", "gif", "webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check file extension
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  if (!fileExt || !allowedTypes.includes(fileExt)) {
    return { isValid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` };
  }

  // Check MIME type matches extension
  const expectedMimeTypes: Record<string, string[]> = {
    png: ["image/png"],
    jpeg: ["image/jpeg"],
    jpg: ["image/jpeg"],
    gif: ["image/gif"],
    webp: ["image/webp"],
  };

  const expectedMimes = expectedMimeTypes[fileExt] || [];
  if (!expectedMimes.includes(file.type)) {
    return { isValid: false, error: "File type and MIME type mismatch" };
  }

  // Check file size
  if (file.size > maxSize) {
    return { isValid: false, error: "File too large. Maximum size is 5MB" };
  }

  // Basic file name validation
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
    return { isValid: false, error: "Invalid file name. Use only letters, numbers, dots, dashes, and underscores" };
  }

  return { isValid: true };
}

// Sanitize bucket name
export function validateBucketName(bucketName: string): boolean {
  const allowedBuckets = ["cafe-images", "product-images", "category-images"];
  return allowedBuckets.includes(bucketName);
}
