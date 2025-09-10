import { NextRequest } from "next/server";
import { errorMessages } from "@/lib/http";

export interface PayloadLimit {
  maxSize: number;
  message: string;
}

export interface ContentTypeLimits {
  [contentType: string]: PayloadLimit;
}

interface ValidatePayloadSizeResult {
  isValid: boolean;
  error?: string;
  limit?: PayloadLimit;
}

export const PAYLOAD_LIMITS: ContentTypeLimits = {
  "application/json": {
    maxSize: 1 * 1024 * 1024, // 1MB for JSON data
    message: errorMessages.PAYLOAD_TOO_LARGE("1MB", "JSON"),
  },

  "multipart/form-data": {
    maxSize: 5 * 1024 * 1024, // 5MB for form data
    message: errorMessages.PAYLOAD_TOO_LARGE("5MB", "form data"),
  },

  "application/x-www-form-urlencoded": {
    maxSize: 512 * 1024, // 512KB for URL-encoded data
    message: errorMessages.PAYLOAD_TOO_LARGE("512KB", "form data"),
  },

  "text/plain": {
    maxSize: 256 * 1024, // 256KB for plain text
    message: errorMessages.PAYLOAD_TOO_LARGE("256KB", "text"),
  },

  "application/xml": {
    maxSize: 2 * 1024 * 1024, // 2MB for XML
    message: errorMessages.PAYLOAD_TOO_LARGE("2MB", "XML"),
  },
  "text/xml": {
    maxSize: 2 * 1024 * 1024, // 2MB for XML
    message: errorMessages.PAYLOAD_TOO_LARGE("2MB", "XML"),
  },

  default: {
    maxSize: 256 * 1024, // 256KB default
    message: errorMessages.PAYLOAD_TOO_LARGE("256KB"),
  },
};

export const validatePayloadSize = (request: NextRequest, customLimits?: Partial<ContentTypeLimits>): ValidatePayloadSizeResult => {
  const contentLength = request.headers.get("content-length");

  const contentType = request.headers.get("content-type")?.split(";")[0]?.toLowerCase();

  if (!contentLength) {
    return { isValid: true };
  }

  const payloadSize = Number.parseInt(contentLength, 10);

  if (Number.isNaN(payloadSize) || payloadSize < 0) {
    return {
      isValid: false,
      error: "Invalid content-length header",
    };
  }

  const limits = { ...PAYLOAD_LIMITS, ...customLimits };

  const limit = contentType && limits[contentType] ? limits[contentType] : PAYLOAD_LIMITS.default;

  if (payloadSize > limit?.maxSize) {
    return {
      isValid: false,
      error: limit?.message,
      limit,
    };
  }

  return { isValid: true, limit };
};
