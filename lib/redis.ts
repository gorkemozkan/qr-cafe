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

export async function invalidateUserCafesCache(userId: string) {
  try {
    const cacheKey = getCacheKeys.cafes(userId);
    await redis.del(cacheKey);
  } catch (error) {
    console.warn("Failed to invalidate cafes cache:", error);
  }
}

export async function invalidatePublicCafeCache(slug: string) {
  try {
    const cacheKey = getCacheKeys.publicCafe(slug);
    await redis.del(cacheKey);
  } catch (error) {
    console.warn("Failed to invalidate public cafe cache:", error);
  }
}
