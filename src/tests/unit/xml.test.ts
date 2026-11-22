import { describe, expect, it } from "vitest";
import { escapeXml } from "@/lib/xml";

describe("escapeXml", () => {
  it("escapes the five XML entities", () => {
    expect(escapeXml(`<title>A & B "quoted" 'single'</title>`)).toBe(
      "&lt;title&gt;A &amp; B &quot;quoted&quot; &apos;single&apos;&lt;/title&gt;",
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeXml("Designing a Rate Limiter")).toBe(
      "Designing a Rate Limiter",
    );
  });

  it("escapes ampersands only once", () => {
    expect(escapeXml("&amp;")).toBe("&amp;amp;");
  });
});
