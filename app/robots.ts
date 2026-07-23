import type { MetadataRoute } from "next";

const SITE_URL = "https://praisegrid.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /assets/features-high-converting/ holds public marketing screenshots
      // served from public/ - it collides with the private /assets dashboard
      // route below, so it needs an explicit allow to stay crawlable.
      allow: ["/", "/assets/features-high-converting/"],
      disallow: [
        "/dashboard",
        "/reviews",
        "/analytics",
        "/settings",
        "/locations",
        "/marketing",
        "/assets",
        "/franchise",
        "/api/",
        "/auth/",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
