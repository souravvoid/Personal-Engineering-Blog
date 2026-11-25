// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Navigation } from "@/components/layout/Navigation";
import { TableOfContents } from "@/components/article/TableOfContents";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Heading } from "@/lib/mdx/headings";

afterEach(() => {
  document.body.innerHTML = "";
});

const headings: Heading[] = [
  { id: "intro", text: "Introduction", depth: 2 },
  { id: "details", text: "Details", depth: 2 },
  { id: "inner", text: "Inner note", depth: 3 },
];

describe("Navigation", () => {
  it("renders desktop and mobile navigation links", () => {
    render(<Navigation />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const label of ["Articles", "Categories", "Archive", "Search", "About", "RSS"]) {
      expect(within(nav).getByText(label)).toBeTruthy();
    }
  });

  it("toggles the mobile menu", () => {
    render(<Navigation />);
    const menuButton = screen.getByRole("button", { name: "Open menu" });
    const panel = document.querySelector("#mobile-navigation");
    expect(panel).toBeTruthy();
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");
    expect(panel?.hasAttribute("hidden")).toBe(false);
    fireEvent.click(menuButton);
    expect(panel?.hasAttribute("hidden")).toBe(true);
  });

  it("exposes the masthead as a link", () => {
    render(<Navigation />);
    expect(screen.getAllByRole("link", { name: "LORD VOID — home" }).length).toBeGreaterThan(0);
  });
});

describe("TableOfContents", () => {
  it("renders an anchor per heading and indents level 3", () => {
    render(<TableOfContents headings={headings} />);
    const intro = screen.getByText("Introduction");
    const inner = screen.getByText("Inner note");
    expect(intro.closest("a")?.getAttribute("href")).toBe("#intro");
    expect(inner.closest("a")?.getAttribute("href")).toBe("#inner");
    expect(inner.parentElement?.parentElement?.hasAttribute("class")).toBe(true);
  });

  it("renders nothing for an empty TOC", () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.querySelectorAll("nav, details, ol, li").length).toBe(0);
  });
});

describe("CopyButton", () => {
  it("copies text and shows feedback", async () => {
    const writes: string[] = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          writes.push(text);
        },
      },
    });

    render(<CopyButton text="hello world" />);
    const button = screen.getByRole("button", { name: "Copy" });
    fireEvent.click(button);
    await screen.findByText("Copied!");
    expect(writes).toEqual(["hello world"]);
  });
});
