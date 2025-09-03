import { NextRequest } from "next/server";

// Simple in-memory rate limiter for development
// For production, consider Redis-based rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function rateLimit(config: RateLimitConfig) {
  return function checkRateLimit(request: NextRequest): boolean {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();

    // Clean expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }

    const current = rateLimitMap.get(ip) || { count: 0, resetTime: now + config.windowMs };

    if (current.resetTime < now) {
      current.count = 1;
      current.resetTime = now + config.windowMs;
    } else {
      current.count++;
    }

    rateLimitMap.set(ip, current);
    return current.count <= config.maxRequests;
  };
}

// Rate limiters for different endpoints
export const authRateLimit = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 }); // 5 attempts per 15 minutes
export const uploadRateLimit = rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }); // 10 uploads per minute

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
