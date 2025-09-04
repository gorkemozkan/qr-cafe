import { NextRequest } from "next/server";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class RateLimiter {
  private cache = new Map<string, RateLimitEntry>();

  private cleanupInterval: NodeJS.Timeout;

  private readonly config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: this.defaultKeyGenerator,
      skipSuccessfulRequests: false,
      ...config,
    };

    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000, // 5 minutes
    );
  }

  private defaultKeyGenerator(request: NextRequest): string {
    // Use multiple headers to create a more robust identifier
    const forwarded = request.headers.get("x-forwarded-for");

    const realIp = request.headers.get("x-real-ip");

    const remoteAddr = request.headers.get("remote-addr");

    const ip = forwarded?.split(",")[0]?.trim() || realIp || remoteAddr || "unknown";

    const userAgent = request.headers.get("user-agent") || "";

    const userAgentHash = userAgent.length > 0 ? userAgent.slice(0, 50) : "no-ua";

    return `${ip}:${userAgentHash}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.resetTime < now) {
        this.cache.delete(key);
      }
    }
  }

  check(request: NextRequest): { allowed: boolean; remainingRequests: number; resetTime: number } {
    const key = this.config.keyGenerator(request);

    const now = Date.now();

    // Get or create entry
    let entry = this.cache.get(key);

    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        blocked: false,
      };
    }

    if (entry.blocked && entry.resetTime > now) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: entry.resetTime,
      };
    }

    if (entry.resetTime < now) {
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
        blocked: false,
      };
    } else {
      entry.count++;
    }

    if (entry.count > this.config.maxRequests) {
      entry.blocked = true;
    }

    this.cache.set(key, entry);

    return {
      allowed: entry.count <= this.config.maxRequests,
      remainingRequests: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const uploadRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
});

export function uploadRateLimit(request: NextRequest): boolean {
  return uploadRateLimiter.check(request).allowed;
}
