/**
 * Enhanced security headers configuration
 */

export interface SecurityHeadersConfig {
  environment: "development" | "staging" | "production";
  supabaseUrl?: string;
  allowedOrigins?: string[];
}

/**
 * Generate Content Security Policy based on environment
 */
export function generateCSP(config: SecurityHeadersConfig): string {
  const { environment, supabaseUrl, allowedOrigins = [] } = config;

  // Extract domain from Supabase URL for connect-src
  const supabaseDomain = supabaseUrl ? new URL(supabaseUrl).hostname : "*.supabase.co";
  
  const policies = [
    "default-src 'self'",
    
    // Script sources - more restrictive in production
    environment === "development"
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com"
      : "script-src 'self' https://challenges.cloudflare.com",
    
    // Style sources
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Image sources
    "img-src 'self' data: https: blob:",
    
    // Font sources
    "font-src 'self' https://fonts.gstatic.com",
    
    // Connection sources - include specific Supabase domain
    `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain} https://challenges.cloudflare.com ${allowedOrigins.join(" ")}`,
    
    // Frame sources
    "frame-src 'self' https://challenges.cloudflare.com",
    
    // Strict policies
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    
    // Report URI
    "report-uri /api/csp-report",
  ];

  return policies.join("; ");
}

/**
 * Get all security headers for the application
 */
export function getSecurityHeaders(config: SecurityHeadersConfig): Record<string, string> {
  return {
    // Content Security Policy
    "Content-Security-Policy": generateCSP(config),
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Prevent clickjacking
    "X-Frame-Options": "DENY",
    
    // XSS Protection (legacy but still useful)
    "X-XSS-Protection": "1; mode=block",
    
    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Strict Transport Security (HTTPS only)
    ...(config.environment === "production" && {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    }),
    
    // Permissions Policy
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
    ].join(", "),
    
    // Cross-Origin policies
    "Cross-Origin-Embedder-Policy": "unsafe-none",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };
}
