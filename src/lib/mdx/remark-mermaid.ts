import type { Code, Parent, Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

/**
 * Convert mermaid fences into `<MermaidDiagram source="..." />`.
 *
 * The source travels as a single JSX string attribute so labels containing
 * quotes, colons, and newlines survive intact. `MermaidDiagram` is the only
 * component name this plugin emits; the MDX component map must export the same
 * name.
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: Code, index, parent: Parent | undefined) => {
      if (node.lang !== "mermaid") return;
      if (index === undefined || index === null || !parent) return;

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "MermaidDiagram",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "source",
            value: node.value,
          },
        ],
        children: [],
      };
    });
  };
};
