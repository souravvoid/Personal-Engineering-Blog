import { compile } from "@mdx-js/mdx";
import { describe, expect, it } from "vitest";
import { remarkMermaid } from "@/lib/mdx/remark-mermaid";

describe("remarkMermaid", () => {
  it("converts a mermaid fence into a MermaidDiagramContainer element with data-mermaid attribute", async () => {
    const source = "```mermaid\ngraph TD;\n  A-->B;\n```\n";
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    const output = String(result);
    expect(output).toContain("MermaidDiagramContainer");
    expect(output).toContain("data-mermaid");
  });

  it("preserves newlines in diagram labels when rendered as source", async () => {
    const source = '```mermaid\nflowchart TD\n  A["Client"] --> B["Service"]\n```\n';
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    expect(String(result)).toContain("MermaidDiagramContainer");
    expect(String(result)).toContain("Client");
    expect(String(result)).toContain("Service");
  });

  it("leaves non-mermaid code fences untouched", async () => {
    const source = "```ts\nconst value = 1;\n```\n";
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    expect(String(result)).not.toContain("MermaidDiagramContainer");
  });
});