import { MetadataRoute } from "next";
import { nextPublicBaseUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!nextPublicBaseUrl) {
    return [];
  }

  return [
    {
      url: nextPublicBaseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${nextPublicBaseUrl}/admin/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${nextPublicBaseUrl}/admin/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${nextPublicBaseUrl}/admin/app/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
