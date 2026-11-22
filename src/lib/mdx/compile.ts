import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import type { Root } from "hast";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/article/mdx-components";
import { collectHeadings, type Heading } from "./headings";
import { remarkMermaid } from "./remark-mermaid";

export type CompiledArticle = {
  content: Awaited<ReturnType<typeof compileMDX>>["content"];
  headings: Heading[];
};

/**
 * Compile a raw MDX body (frontmatter already stripped) to a React element
 * plus the heading list used by the table of contents.
 *
 * - `remark-gfm` adds tables, strikethrough, task lists, and autolinks.
 * - `remark-mermaid` converts ```mermaid fences to <MermaidDiagram />.
 * - `rehype-slug` / `rehype-autolink-headings` add anchor ids for the TOC.
 * - `rehype-pretty-code` performs syntax highlighting at build time.
 *
 * `blockJS` is disabled because content is trusted (authored in this
 * repository, never user-submitted). `blockDangerousJS` stays on so dangerous
 * globals are still rejected. Mermaid is lazy-loaded in the browser, so this
 * adds no Mermaid weight to the server bundle or to pages without diagrams.
 */
export async function compileArticle(body: string): Promise<CompiledArticle> {
  const headings: Heading[] = [];

  const { content } = await compileMDX({
    source: body,
    options: {
      parseFrontmatter: false,
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMermaid],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          () => (tree: Root) => {
            headings.push(...collectHeadings(tree));
          },
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
              defaultLang: "text",
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return { content, headings };
}
