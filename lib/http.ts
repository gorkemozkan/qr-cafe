import { isDevelopment } from "@/lib/env";

export const http = {
  INVALID_REQUEST_ORIGIN: {
    message: "Request origin validation failed. Please ensure you're accessing from an authorized domain.",
    status: 403,
  },
  UNAUTHORIZED: {
    message: "Authentication required. Please log in to continue.",
    status: 401,
  },
  FORBIDDEN: {
    message: "Access denied. You don't have permission to perform this action.",
    status: 403,
  },
  NOT_FOUND: {
    message: "The requested resource was not found.",
    status: 404,
  },
  BAD_REQUEST: {
    message: "Invalid request data provided.",
    status: 400,
  },
  INTERNAL_SERVER_ERROR: {
    message: "An unexpected error occurred. Please try again later.",
    status: 500,
  },
  TOO_MANY_REQUESTS: {
    message: "Too many requests. Please wait a moment before trying again.",
    status: 429,
  },
  UNPROCESSABLE_ENTITY: {
    message: "The provided data could not be processed.",
    status: 422,
  },
  SUCCESS: {
    message: "Success",
    status: 200,
  },
  CONFLICT: {
    message: "A conflict occurred with the current state of the resource.",
    status: 409,
  },
  TOO_MANY_REQUESTS_MESSAGE: {
    message: "Too Many Requests",
    status: 429,
  },
  PAYLOAD_TOO_LARGE: {
    message: "Payload too large",
    status: 413,
  },
};

export const errorMessages = {
  INVALID_CREDENTIALS: "The provided email or password is incorrect.",
  ACCOUNT_LOCKED: "Your account has been temporarily locked due to multiple failed login attempts.",
  EMAIL_NOT_VERIFIED: "Please verify your email address before logging in.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",

  INVALID_EMAIL: "Please provide a valid email address.",
  INVALID_PASSWORD: "Password must be at least 6 characters long and contain uppercase, lowercase, number, and special character.",
  PASSWORD_TOO_WEAK: "Password is too weak. Please choose a stronger password.",
  REQUIRED_FIELD: (field: string) => `${field} is required.`,
  INVALID_FORMAT: (field: string) => `${field} has an invalid format.`,
  VALUE_TOO_LONG: (field: string, max: number) => `${field} cannot exceed ${max} characters.`,
  VALUE_TOO_SHORT: (field: string, min: number) => `${field} must be at least ${min} characters.`,

  FILE_TOO_LARGE: (maxSize: string) => `File size exceeds the maximum limit of ${maxSize}.`,
  INVALID_FILE_TYPE: (allowedTypes: string[]) => `File type not allowed. Supported types: ${allowedTypes.join(", ")}.`,
  FILE_CORRUPTED: "The uploaded file appears to be corrupted or invalid.",

  RESOURCE_NOT_FOUND: (resource: string) => `The requested ${resource} could not be found.`,
  RESOURCE_ACCESS_DENIED: (resource: string) => `You don't have permission to access this ${resource}.`,
  RESOURCE_ALREADY_EXISTS: (resource: string) => `A ${resource} with these details already exists.`,
  RESOURCE_INACTIVE: (resource: string) => `The ${resource} is currently inactive.`,

  RATE_LIMIT_EXCEEDED: (resetTime: number) => {
    const minutes = Math.ceil((resetTime - Date.now()) / 60000);
    return `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`;
  },

  DATABASE_ERROR: "A database error occurred. Please try again.",
  STORAGE_ERROR: "File storage operation failed. Please try again.",
  NETWORK_ERROR: "A network error occurred. Please check your connection and try again.",

  PAYLOAD_TOO_LARGE: (maxSize: string, contentType?: string) => {
    const typeMsg = contentType ? ` for ${contentType} content` : "";
    return `Request payload exceeds the maximum size limit of ${maxSize}${typeMsg}.`;
  },
};

export function createSafeErrorResponse(error: unknown): { message: string; code?: string } {
  if (error instanceof Error) {
    return {
      message: isDevelopment ? error.message : "An unexpected error occurred. Please try again.",
      code: isDevelopment ? error.name : undefined,
    };
  }

  return {
    message: "An unexpected error occurred. Please try again.",
  };
}
