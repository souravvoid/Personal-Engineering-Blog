import type { MetadataRoute } from "next";
import { categoryDefinitions, type Category } from "@/lib/content/categories";
import { getAllArticles, getTagCounts } from "@/lib/content/loader";
import { absoluteUrl } from "@/lib/site";

function isoDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const newestByCategory = new Map<Category, string>();

  for (const article of articles) {
    const existing = newestByCategory.get(article.category);
    if (!existing || article.date > existing) {
      newestByCategory.set(article.category, article.date);
    }
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/articles"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/categories"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/tags"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/archive"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.4 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: isoDate(article.updated ?? article.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoryDefinitions.map(
    (definition) => {
      const newest = newestByCategory.get(definition.name);
      return {
        url: absoluteUrl(`/categories/${definition.slug}`),
        lastModified: newest ? isoDate(newest) : undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      };
    },
  );

  const tagRoutes: MetadataRoute.Sitemap = getTagCounts().map((entry) => ({
    url: absoluteUrl(`/tags/${entry.tag}`),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...tagRoutes];
}
