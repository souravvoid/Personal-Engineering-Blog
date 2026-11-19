import type { Code, Parent, Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

/**
 * Turn mermaid fenced code blocks into a server-rendered marker
 * that the MermaidDiagram component detects on mount, then initializes
 * Mermaid client-side. The chart source travels as HTML text so
 * labels with quotes and newlines are preserved.
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    ;(visit as any)(tree, "code", (node: Code, index: number | null, parent: Parent | null) => {
      if (node.lang !== "mermaid" || index === null || parent === null) return;
      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "MermaidDiagramContainer",
        attributes: [{ type: "mdxJsxAttribute", name: "data-mermaid", value: node.value }],
        children: [],
      };
    });
  };
};