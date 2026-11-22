import { getAllArticles } from "@/lib/content/loader";
import { absoluteUrl, site } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-static";

function rfc822(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? new Date(0).toUTCString() : date.toUTCString();
}

export function GET() {
  const articles = getAllArticles();
  const lastBuildDate = articles[0]?.date ?? new Date().toISOString().slice(0, 10);

  const items = articles
    .map((article) => {
      const url = absoluteUrl(`/articles/${article.slug}`);
      const categories = [article.category, ...article.tags]
        .map((category) => `      <category>${escapeXml(category)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(article.date)}</pubDate>
      <description>${escapeXml(article.description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <copyright>${new Date().getFullYear()} ${escapeXml(site.name)}</copyright>
    <lastBuildDate>${rfc822(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
