import { MetadataRoute } from "next";
import { nextPublicBaseUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/app/", "/api/"],
    },
    sitemap: `${nextPublicBaseUrl}/sitemap.xml`,
  };
}
