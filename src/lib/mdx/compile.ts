import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/article/mdx-components";
import { remarkMermaid } from "./remark-mermaid";

export type CompiledArticle = {
  content: Awaited<ReturnType<typeof compileMDX>>["content"];
};

/**
 * Compile a raw MDX body (frontmatter already stripped) to a React element.
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
export async function compileArticle(body: string) {
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
          rehypePrettyCode,
        ],
      },
    },
    components: mdxComponents,
  });
  return { content };
}
