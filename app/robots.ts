import type { MetadataRoute } from "next";
import config from "@/config/global";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin/"],
    },
    sitemap: `${config.url}/sitemap.xml`,
  };
}
