// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { Navigation } from "@/components/layout/Navigation";
import { TableOfContents } from "@/components/article/TableOfContents";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Heading } from "@/lib/mdx/headings";

const headings: Heading[] = [
  { id: "intro", text: "Introduction", depth: 2 },
  { id: "inner", text: "Details", depth: 3 },
];

describe("accessibility smoke checks", () => {
  it("Navigation has no violations", async () => {
    const { container } = render(<Navigation />);
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });

  it("TableOfContents has no violations", async () => {
    const { container } = render(<TableOfContents headings={headings} />);
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });

  it("CopyButton has no violations", async () => {
    const { container } = render(<CopyButton text="test" />);
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });
});
