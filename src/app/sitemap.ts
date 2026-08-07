import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.intezaar.in";

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/celebrations`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/community-guidelines`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
