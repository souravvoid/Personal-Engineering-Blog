import { compile } from "@mdx-js/mdx";
import { describe, expect, it } from "vitest";
import { remarkMermaid } from "@/lib/mdx/remark-mermaid";

describe("remarkMermaid", () => {
  it("converts a mermaid fence into a MermaidDiagram element with a source prop", async () => {
    const source = "```mermaid\ngraph TD;\n  A-->B;\n```\n";
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    const output = String(result);
    expect(output).toContain("MermaidDiagram");
    expect(output).toContain("source:");
    expect(output).not.toContain("MermaidDiagramContainer");
  });

  it("preserves newlines in diagram labels", async () => {
    const source =
      '```mermaid\nflowchart TD\n  A["Client"] --> B["Service"]\n```\n';
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    expect(String(result)).toContain("Client");
    expect(String(result)).toContain("Service");
    expect(String(result)).toContain("\\n");
  });

  it("leaves non-mermaid code fences untouched", async () => {
    const source = "```ts\nconst value = 1;\n```\n";
    const result = await compile(source, {
      remarkPlugins: [remarkMermaid],
      outputFormat: "function-body",
    });
    expect(String(result)).not.toContain("MermaidDiagram");
  });
});
