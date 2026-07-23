import type { MetadataRoute } from "next";

const SITE_URL = "https://praisegrid.com";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "weekly" },
  { path: "/scan", priority: 0.9, changeFrequency: "weekly" },
  { path: "/customers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/signup", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.4, changeFrequency: "weekly" },
  { path: "/login", priority: 0.3, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.3, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" },
  { path: "/status", priority: 0.2, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
