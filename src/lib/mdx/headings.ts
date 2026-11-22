import { toString } from "hast-util-to-string";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

export type Heading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

/**
 * Collect anchored h2/h3 headings from a rehype tree.
 *
 * Run this after `rehype-slug` so the ids recorded here are exactly the ids
 * rendered in the document. Headings without an id are ignored, which keeps
 * the table of contents free of dead links.
 */
export function collectHeadings(tree: Root): Heading[] {
  const headings: Heading[] = [];

  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "h2" && node.tagName !== "h3") return;
    const id = node.properties?.id;
    if (typeof id !== "string" || id.length === 0) return;
    const text = toString(node).replace(/\s+/g, " ").trim();
    if (!text) return;
    headings.push({
      id,
      text,
      depth: node.tagName === "h2" ? 2 : 3,
    });
  });

  return headings;
}
