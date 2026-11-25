import { MermaidDiagram } from "./MermaidDiagram";
import { Callout } from "./Callout";
import { Figure } from "./Figure";
import { References } from "./References";
import type { MDXComponents } from "mdx/types";

/**
 * Components exposed to MDX content.
 */
export const mdxComponents: MDXComponents = {
  MermaidDiagram,
  Callout,
  Figure,
  References,
};
