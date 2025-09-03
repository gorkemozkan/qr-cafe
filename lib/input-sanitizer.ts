/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// HTML entities that should be escaped
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Sanitize HTML content by escaping dangerous characters
 */
export function escapeHtml(text: string): string {
  if (typeof text !== "string") {
    return "";
  }
  return text.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Sanitize text input by removing dangerous characters
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove control characters except common whitespace
  // Using unicode escape sequences instead of hex for biome compatibility
  return input
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/**
 * Sanitize slug/URL parameters to prevent path traversal
 */
export function sanitizeSlug(slug: string): string {
  if (typeof slug !== "string") {
    return "";
  }

  // Allow only alphanumeric characters, hyphens, and underscores
  return slug
    .replace(/[^a-zA-Z0-9\-_]/g, "")
    .toLowerCase()
    .slice(0, 100); // Limit length
}

/**
 * Sanitize email to prevent injection
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") {
    return "";
  }

  // Basic email sanitization - remove dangerous characters
  return email
    .replace(/[<>'"]/g, "")
    .toLowerCase()
    .trim()
    .slice(0, 254); // RFC email length limit
}

/**
 * Validate and sanitize numeric ID
 */
export function sanitizeId(id: string | number): number | null {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;

  if (Number.isNaN(numId) || numId < 0 || numId > Number.MAX_SAFE_INTEGER) {
    return null;
  }

  return numId;
}

/**
 * Sanitize file names to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== "string") {
    return "";
  }

  // Remove path separators and dangerous characters
  return fileName
    .replace(/[\/\\:*?"<>|]/g, "")
    .replace(/^\.+/, "") // Remove leading dots
    .slice(0, 255); // Limit length
}

/**
 * Comprehensive input sanitization for API requests
 */
export function sanitizeApiInput<T extends Record<string, any>>(input: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = sanitizeText(value) as T[keyof T];
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeApiInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}
