import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "What LORD VOID is, the editorial rules behind it, and how the publication is built.",
  path: "/about",
});

const principles = [
  {
    title: "Mechanism before metaphor",
    body: "An analogy is a tool for entering a subject, not the explanation itself. The mechanism is described in its own terms as soon as the reader has enough ground to stand on.",
  },
  {
    title: "Models have edges",
    body: "When an article simplifies something, it says so. A four-box diagram and a production implementation are different artefacts, and the distance between them is part of the lesson.",
  },
  {
    title: "Trade-offs, not verdicts",
    body: "Most engineering decisions are conditional. Articles name the conditions instead of declaring one tool universally correct.",
  },
  {
    title: "References where they matter",
    body: "Protocol behaviour, product limits, and performance claims link to primary documentation or source material so a reader can verify the claim.",
  },
] as const;

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="About"
        title="A publication about how systems actually behave."
        description="LORD VOID is an independent technical publication. It publishes long-form explanations of the machinery underneath modern software, with an emphasis on the gap between a clean model and a running system."
      />

      <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="max-w-[42rem] space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted">
          <p>
            Most technical writing is written for one of two readers: the person
            who already knows the answer, or the person who needs a recipe. This
            publication is aimed at a third reader, the one who wants to
            understand why the recipe works and when it stops working.
          </p>
          <p>
            The subjects are the ones that keep causing production incidents:
            scheduling, consensus, indexes, retries, rate limits, and threat
            models. The approach is consistent. Start with the problem, build
            the simplest correct model, then show where that model diverges from
            the implementation.
          </p>
          <p>
            There is no account system, comment section, CMS, or tracking
            script. Articles are MDX files committed to a Git repository and
            validated during the build. If a page is reachable, its content
            passed the same checks as every other page.
          </p>
        </div>

        <aside className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="eyebrow">How it is made</p>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ink-muted">
            <li>
              <span className="text-ink">Next.js App Router</span> for static
              generation and routing.
            </li>
            <li>
              <span className="text-ink">MDX in Git</span> for content. The
              filename is the slug, and frontmatter is schema-validated.
            </li>
            <li>
              <span className="text-ink">Build-time highlighting</span> through
              Shiki, so code blocks ship as markup rather than client
              JavaScript.
            </li>
            <li>
              <span className="text-ink">Lazy Mermaid</span> for diagrams. The
              renderer loads only when a diagram approaches the viewport.
            </li>
            <li>
              <span className="text-ink">Client-side search</span> over
              published article metadata, with no search backend.
            </li>
          </ul>

          <p className="eyebrow mt-10">Source and contact</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href="https://github.com/souravvoid/Personal-Engineering-Blog"
                className="link-underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Repository on GitHub <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/souravvoid"
                className="link-underline"
                rel="me noopener noreferrer"
                target="_blank"
              >
                GitHub profile <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a href="/rss.xml" className="link-underline">
                RSS feed
              </a>
            </li>
          </ul>
        </aside>
      </div>

      <section className="border-t border-line py-14">
        <p className="eyebrow">Editorial rules</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3rem)] leading-[1.08] tracking-[-0.02em]">
          Four constraints that decide what gets published.
        </h2>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <li
              key={principle.title}
              className="rounded-xl border border-line bg-surface p-6 md:p-8"
            >
              <span className="font-mono text-[0.625rem] tracking-[0.1em] text-ink-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {principle.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line py-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="eyebrow">Corrections</p>
            <h2 className="mt-4 font-display text-3xl">
              Found something wrong?
            </h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">
              If an explanation is inaccurate, a reference is stale, or a
              diagram misrepresents the system, open an issue or a pull request
              in the repository. Corrections are part of the publication, not an
              exception to it.
            </p>
          </div>
          <Link href="/articles" className="button button-primary w-fit">
            Read the articles <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="border-t border-line py-14">
        <p className="eyebrow">Author</p>
        <h2 className="mt-4 font-display text-3xl">{site.author.name}</h2>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">
          LORD VOID is written and maintained by Sourav. The publication is a
          place to work through systems in public: one mechanism, one trade-off,
          and one honest boundary at a time.
        </p>
      </section>
    </Container>
  );
}
