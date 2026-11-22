import type { Root } from "hast";
import { describe, expect, it } from "vitest";
import { collectHeadings } from "@/lib/mdx/headings";

const tree: Root = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "h2",
      properties: { id: "intro" },
      children: [{ type: "text", value: "Intro" }],
    },
    {
      type: "element",
      tagName: "h3",
      properties: { id: "a-detail" },
      children: [
        { type: "text", value: "A " },
        {
          type: "element",
          tagName: "code",
          properties: {},
          children: [{ type: "text", value: "detail" }],
        },
      ],
    },
    {
      type: "element",
      tagName: "h4",
      properties: { id: "ignored" },
      children: [{ type: "text", value: "Ignored" }],
    },
    {
      type: "element",
      tagName: "h2",
      properties: {},
      children: [{ type: "text", value: "No id" }],
    },
  ],
};

describe("collectHeadings", () => {
  it("collects only anchored h2 and h3 headings", () => {
    expect(collectHeadings(tree)).toEqual([
      { id: "intro", text: "Intro", depth: 2 },
      { id: "a-detail", text: "A detail", depth: 3 },
    ]);
  });

  it("returns an empty list for a tree without headings", () => {
    expect(collectHeadings({ type: "root", children: [] })).toEqual([]);
  });
});
