import { NextResponse } from "next/server";

/**
 * Standardized API response utilities for consistent error handling and security
 */

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a success response with consistent structure
 */
export function apiSuccess<T>(data: T, message?: string, status = 200): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Create an error response with consistent structure
 */
export function apiError(message: string, status = 500, code?: string, details?: unknown): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error: message,
  };

  if (code) {
    response.code = code;
  }

  // Only include details in development
  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () => apiError("Unauthorized", 401, "UNAUTHORIZED"),
  forbidden: () => apiError("Forbidden", 403, "FORBIDDEN"),
  notFound: (resource = "Resource") => apiError(`${resource} not found`, 404, "NOT_FOUND"),
  badRequest: (message = "Bad request") => apiError(message, 400, "BAD_REQUEST"),
  tooManyRequests: (message = "Too many requests") => apiError(message, 429, "RATE_LIMIT"),
  validationFailed: (details?: unknown) => apiError("Validation failed", 400, "VALIDATION_ERROR", details),
  internalError: () => apiError("Internal server error", 500, "INTERNAL_ERROR"),
  invalidCaptcha: () => apiError("Invalid CAPTCHA verification", 400, "INVALID_CAPTCHA"),
  invalidCsrf: () => apiError("Invalid request origin", 403, "INVALID_CSRF"),
} as const;

/**
 * Utility to handle async operations with consistent error responses
 */
export async function handleApiRequest<T>(handler: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await handler();
    return apiSuccess(result);
  } catch (error) {
    // Log error for monitoring (in production, this would go to your error tracking service)
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }

    if (error instanceof Error) {
      return apiError(error.message);
    }

    return ApiErrors.internalError();
  }
}

/**
 * Validate and parse numeric ID from parameters
 */
export function parseNumericId(id: string, resourceName = "ID"): number {
  const numericId = parseInt(id, 10);

  if (Number.isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid ${resourceName}`);
  }

  return numericId;
}
