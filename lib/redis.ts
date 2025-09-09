import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const getCacheKeys = {
  cafes: (userId: string) => `cafes:user:${userId}`,
};

export async function invalidateUserCafesCache(userId: string) {
  try {
    const cacheKey = getCacheKeys.cafes(userId);
    await redis.del(cacheKey);
  } catch (error) {
    console.warn("Failed to invalidate cafes cache:", error);
  }
}
