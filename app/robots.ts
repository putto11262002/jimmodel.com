import { config } from "@/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin/"],
    },
    sitemap: `${config.url}/sitemap.xml`,
  };
}
