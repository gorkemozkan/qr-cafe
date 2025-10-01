import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { NextRequest } from "next/server";

const getKeyFromRequest = (request: NextRequest, prefix: string): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("remote-addr");

  const ip = forwarded?.split(",")[0]?.trim() || realIp || remoteAddr || "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const userAgentHash = userAgent.length > 0 ? userAgent.slice(0, 50) : "no-ua";

  return `${prefix}:${ip}:${userAgentHash}`;
};

export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

export const uploadRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "ratelimit:upload",
});

export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

export const publicRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "ratelimit:public",
});

export const checkRateLimit = async (
  limiter: Ratelimit,
  request: NextRequest,
  prefix: string,
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
  try {
    const key = getKeyFromRequest(request, prefix);
    const result = await limiter.limit(key);

    return {
      allowed: result.success,
      remaining: result.remaining,
      resetTime: result.reset,
    };
  } catch (error) {
    console.error(`Rate limit check failed for ${prefix}:`, error);

    return {
      allowed: true,
      remaining: 0,
      resetTime: Date.now() + 60000, // 1 minute from now
    };
  }
};

export const checkAuthRateLimit = (request: NextRequest) => checkRateLimit(authRateLimiter, request, "auth");

export const checkUploadRateLimit = (request: NextRequest) => checkRateLimit(uploadRateLimiter, request, "upload");

export const checkApiRateLimit = (request: NextRequest) => checkRateLimit(apiRateLimiter, request, "api");

export const checkPublicRateLimit = (request: NextRequest) => checkRateLimit(publicRateLimiter, request, "public");
