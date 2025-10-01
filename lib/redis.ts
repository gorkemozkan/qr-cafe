import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const getCacheKeys = {
  cafes: (userId: string) => `cafes:user:${userId}`,
  publicCafe: (slug: string) => `public:cafe:${slug}`,
  publicCafeSlugs: () => `public:cafe:slugs`,
};

/**
 * Logs Redis errors with sanitized information
 * Avoids logging sensitive data while providing useful debugging info
 */
function logRedisError(operation: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const timestamp = new Date().toISOString();

  // Log to console with structured format for better monitoring
  console.error(
    JSON.stringify({
      timestamp,
      service: "redis",
      operation,
      error: errorMessage,
      // Add any additional context that would be helpful for monitoring
      // but avoid logging sensitive data
    }),
  );

  // In production, you could also send this to your monitoring service
  // Example: Sentry, DataDog, CloudWatch, etc.
}

export async function invalidateUserCafesCache(userId: string) {
  try {
    const cacheKey = getCacheKeys.cafes(userId);
    await redis.del(cacheKey);
  } catch (error) {
    logRedisError("invalidateUserCafesCache", error);
    // Fail gracefully - cache invalidation failure shouldn't break the app
  }
}

export async function invalidatePublicCafeCache(slug: string) {
  try {
    const cacheKey = getCacheKeys.publicCafe(slug);
    await redis.del(cacheKey);
  } catch (error) {
    logRedisError("invalidatePublicCafeCache", error);
    // Fail gracefully - cache invalidation failure shouldn't break the app
  }
}
