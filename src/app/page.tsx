import type { Metadata } from "next";
import Link from "next/link";
import { CategoryGrid } from "@/components/articles/CategoryGrid";
import { FeaturedArticle } from "@/components/articles/FeaturedArticle";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCategoryCounts, getAllArticles } from "@/lib/content/loader";
import { websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

const principles = [
  {
    title: "Start with the mechanism",
    body: "Every essay begins with the question a system is actually answering, then follows the work from input to outcome.",
  },
  {
    title: "Name where the model stops",
    body: "A simplified model is useful only when its boundaries are explicit. Articles separate the mental model from the implementation.",
  },
  {
    title: "Leave a trail",
    body: "Claims that depend on external behaviour link to primary documentation, specifications, or source material.",
  },
  {
    title: "Write for the next engineer",
    body: "No assumed context and no performance of expertise. If a step matters, it gets explained.",
  },
] as const;

export default function HomePage() {
  const articles = getAllArticles();
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const latest = articles
    .filter((article) => article.slug !== featured?.slug)
    .slice(0, 5);
  const categoryCounts = getCategoryCounts();
  const latestDate = articles[0]?.date;
  const year = new Date().getFullYear();

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      <section className="starfield border-b border-line">
        <Container className="py-[var(--section-space)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <div>
              <p className="eyebrow">
                Engineering / Research / {year}
              </p>
              <h1 className="display-title mt-6 max-w-3xl">
                Systems, examined <span className="lime-chip">carefully</span>.
              </h1>
              <p className="mt-7 max-w-[38rem] text-[1.0625rem] leading-relaxed text-ink-muted md:text-lg">
                Long-form writing about the machinery underneath the software we
                use: distributed systems, backend engineering, databases,
                operating systems, and security. Explanations first, trade-offs
                named, references kept close.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/articles" className="button button-primary">
                  Browse writing <span aria-hidden="true">→</span>
                </Link>
                <Link href="/search" className="button">
                  Search notes
                </Link>
              </div>
            </div>

            <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-1">
                <div>
                  <dt className="eyebrow">Published</dt>
                  <dd className="mt-2 font-display text-2xl">
                    {articles.length} {articles.length === 1 ? "essay" : "essays"}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Topics</dt>
                  <dd className="mt-2 font-display text-2xl">
                    {categoryCounts.length} categories
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Latest</dt>
                  <dd className="mt-2 font-display text-2xl">
                    {latestDate ? formatDate(latestDate) : "—"}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      <Container className="py-[var(--section-space)]">
        <SectionHeader
          eyebrow="Selected"
          title="Featured essay"
          action={{ href: "/articles", label: "All articles" }}
        />
        <div className="mt-8">
          {featured ? (
            <FeaturedArticle article={featured} />
          ) : (
            <p className="border border-line p-6 text-ink-muted">
              No articles are published yet.
            </p>
          )}
        </div>
      </Container>

      <Container className="pb-[var(--section-space)]">
        <SectionHeader
          eyebrow="The index"
          title="Latest writing"
          action={{ href: "/articles", label: "Browse all" }}
        />
        <div className="mt-2">
          {latest.map((article, index) => (
            <ArticleListItem
              key={article.slug}
              article={article}
              index={index}
            />
          ))}
        </div>
      </Container>

      <section className="border-y border-line bg-surface">
        <Container className="py-[var(--section-space)]">
          <SectionHeader
            eyebrow="Browse by topic"
            title="Categories"
            action={{ href: "/categories", label: "Category index" }}
          />
          <div className="mt-8">
            <CategoryGrid counts={categoryCounts} />
          </div>
        </Container>
      </section>

      <Container className="py-[var(--section-space)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Editorial stance</p>
            <h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3rem)] leading-[1.08] tracking-[-0.02em]">
              Explain the mechanism, not the metaphor.
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-muted">
              Technical writing is most useful when it stays honest about the
              distance between a diagram and a running system. These are the
              rules this publication tries to follow.
            </p>
            <Link
              href="/about"
              className="link-underline mt-7 inline-block text-sm text-ink"
            >
              More about the publication
            </Link>
          </div>

          <ol className="border-t border-line">
            {principles.map((principle, index) => (
              <li
                key={principle.title}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-line py-6"
              >
                <span className="font-mono text-[0.6875rem] text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl">{principle.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
                    {principle.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <section className="border-t border-line">
        <Container className="py-[var(--section-space)]">
          <div className="grid gap-8 rounded-xxl border border-line bg-surface p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8">
            <div>
              <p className="eyebrow">The author</p>
              <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                Written by Sourav.
              </h2>
              <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">
                LORD VOID is an independent publication maintained by one
                author. It exists to make one thing clearer at a time: how a
                system works, where a simplified model stops matching the
                implementation, and what that difference costs in practice.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href="/about" className="link-underline">
                  About the publication
                </Link>
                <a
                  href="https://github.com/souravvoid"
                  className="link-underline"
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a href="/rss.xml" className="link-underline">
                  RSS feed
                </a>
              </div>
            </div>

            <Link href="/articles" className="button w-fit">
              Start reading <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
