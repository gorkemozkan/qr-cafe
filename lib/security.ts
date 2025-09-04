import { NextRequest } from "next/server";

export function verifyCsrfToken(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  const allowedOrigins = [`https://${host}`, `http://${host}`];

  return allowedOrigins.includes(origin);
}

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

/**
 * Common security headers applied to all routes
 */
export const commonHeaders = [
  // Prevent MIME-type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Prevent page from being embedded in frames (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },

  // Legacy XSS protection (modern browsers rely on CSP)
  { key: "X-XSS-Protection", value: "1; mode=block" },

  // Control referrer information sent in requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Disable browser features that could be privacy/security risks
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/**
 * Production-only security headers
 */
export const productionOnlyHeaders = [
  // Force HTTPS connections and enable HSTS preloading
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
];

/**
 * Content Security Policy (CSP) Configuration
 * CSP helps prevent XSS attacks by controlling which resources the browser is allowed to load
 */
export const createCSP = (environment: string, supabaseUrl?: string, allowedOrigins: string[] = []) => {
  // Configure Supabase connection endpoints for database and real-time features
  const supabaseHosts = supabaseUrl ? `https://${new URL(supabaseUrl).hostname} wss://${new URL(supabaseUrl).hostname}` : "https://*.supabase.co wss://*.supabase.co";

  // Script execution policy: Allow eval in dev for hot reload, restrict in production
  const scriptSrc = environment === "development" ? "'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com" : "'self' https://challenges.cloudflare.com";

  // Development connections: Allow local webpack dev server and hot reload
  const devConnections = environment === "development" ? "ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*" : "";

  // Network connections: API calls, WebSocket, and external services
  const connectSrc = `'self' ${supabaseHosts} https://challenges.cloudflare.com ${devConnections} ${allowedOrigins.join(" ")}`.trim();

  const directives = [
    // DEFAULT-SRC: Fallback for all other directives - only allow same origin
    "default-src 'self'",

    // SCRIPT-SRC: Controls JavaScript execution sources
    // 'self' = same origin, 'unsafe-eval' = allow eval(), 'unsafe-inline' = allow inline scripts
    `script-src ${scriptSrc}`,

    // STYLE-SRC: Controls CSS stylesheets sources
    // 'unsafe-inline' needed for styled-components and CSS-in-JS libraries
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // IMG-SRC: Controls image sources
    // data: = base64 images, https: = any HTTPS image, blob: = dynamically created images
    "img-src 'self' data: https: blob:",

    // FONT-SRC: Controls web font sources
    "font-src 'self' https://fonts.gstatic.com",

    // CONNECT-SRC: Controls fetch, XMLHttpRequest, WebSocket connections
    `connect-src ${connectSrc}`,

    // FRAME-SRC: Controls embedded frames/iframes (for Cloudflare Turnstile)
    "frame-src 'self' https://challenges.cloudflare.com",

    // OBJECT-SRC: Controls <object>, <embed>, <applet> elements - blocked for security
    "object-src 'none'",

    // BASE-URI: Controls <base> element URLs - prevent base tag injection
    "base-uri 'self'",

    // FORM-ACTION: Controls form submission targets
    "form-action 'self'",

    // FRAME-ANCESTORS: Controls pages that can embed this site in frames - prevent clickjacking
    "frame-ancestors 'none'",

    // UPGRADE-INSECURE-REQUESTS: Force HTTPS in production
    ...(environment === "production" ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
};
