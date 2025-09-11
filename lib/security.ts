import { NextRequest } from "next/server";
import { BUCKET_NAMES } from "../config";
import { isDevelopment } from "./env";

const xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
  /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*<\/img>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:/gi,
  /on\w+\s*=/gi,
  /alert\s*\(/gi,
  /eval\s*\(/gi,
  /document\./gi,
  /window\./gi,
  /location\./gi,
  /cookie/gi,
  /%3C/gi,
  /%3E/gi,
  /<[^>]*>/g,
];

export const verifyCsrfToken = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (isDevelopment) {
    return true;
  }

  if (origin) {
    const allowedOrigins = [`https://${host}`, `http://${host}`];
    return allowedOrigins.includes(origin);
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const allowedOrigins = [`https://${host}`, `http://${host}`];
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return allowedOrigins.includes(refererOrigin);
    } catch {
      return false;
    }
  }

  return false;
};

export const sanitizeFilename = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");

  let name = filename;

  let extension = "";

  if (lastDotIndex > 0) {
    name = filename.substring(0, lastDotIndex);
    extension = filename.substring(lastDotIndex);
  }

  const sanitizedName = name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/^[._-]+|[._-]+$/g, "");

  const finalName = sanitizedName || "file";

  return finalName + extension.toLowerCase();
};

export const validateFileType = (file: File): { isValid: boolean; error?: string; sanitizedName?: string } => {
  const allowedTypes = ["png", "jpeg", "jpg", "gif", "webp"];

  const maxSize = 5 * 1024 * 1024; // 5MB

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  if (!fileExt || !allowedTypes.includes(fileExt)) {
    return { isValid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` };
  }

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

  if (file.size > maxSize) {
    return { isValid: false, error: "File too large. Maximum size is 5MB" };
  }

  // Sanitize the filename
  const sanitizedName = sanitizeFilename(file.name);

  return { isValid: true, sanitizedName };
};

export const validateBucketName = (bucketName: string): boolean => {
  return Object.values(BUCKET_NAMES).includes(bucketName);
};

export const commonHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },

  { key: "X-Frame-Options", value: "DENY" },

  { key: "X-XSS-Protection", value: "1; mode=block" },

  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

export const productionOnlyHeaders = [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }];

export const createCSP = (environment: string, supabaseUrl?: string, allowedOrigins: string[] = []) => {
  const supabaseHosts = supabaseUrl
    ? `https://${new URL(supabaseUrl).hostname} wss://${new URL(supabaseUrl).hostname}`
    : "https://*.supabase.co wss://*.supabase.co";

  const vercelLive = environment === "staging" || environment === "production" ? "https://vercel.live" : "";

  const scriptSrc =
    environment === "development"
      ? "'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com"
      : `'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com ${vercelLive}`.trim();

  const devConnections = environment === "development" ? "ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*" : "";

  const vercelConnections = environment === "staging" || environment === "production" ? "https://vercel.live wss://*.pusher.com" : "";

  const connectSrc =
    `'self' ${supabaseHosts} https://challenges.cloudflare.com https://www.google-analytics.com https://googletagmanager.com ${devConnections} ${vercelConnections} ${allowedOrigins.join(" ")}`.trim();

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src ${connectSrc}`,
    `frame-src 'self' https://challenges.cloudflare.com${vercelLive ? ` ${vercelLive}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(environment === "production" ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
};

export const containsXSS = (value: string): boolean => {
  if (typeof value !== "string") return false;
  return xssPatterns.some((pattern) => pattern.test(value));
};

export const sanitizeXSS = (value: string) => {
  if (typeof value !== "string") return value;

  if (containsXSS(value)) {
    throw new Error("Input contains potentially dangerous content");
  }

  const sanitized = value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();

  return sanitized;
};
