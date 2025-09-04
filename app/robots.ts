import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/app/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
