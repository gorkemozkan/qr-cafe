import { MetadataRoute } from "next";
import { nextPublicBaseUrl } from "@/lib/env";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = nextPublicBaseUrl as string;

  let menuSlugs: string[] = [];
  try {
    menuSlugs = await publicMenuRepository.getAllMenuSlugs();
  } catch (_error) {
    // console.error("Error fetching menu slugs:", _error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...(menuSlugs.length > 0
      ? menuSlugs.map((slug) => ({
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      : []),
  ] as const as MetadataRoute.Sitemap;
}
