import type { MetadataRoute } from "next";
import { routeCorridors } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://intezaar.vercel.app";
  const lastModified = new Date();

  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/routes`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journey/demo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const routePages: MetadataRoute.Sitemap = routeCorridors.map((route) => ({
    url: `${baseUrl}/routes/${route.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...corePages, ...routePages];
}
