import { headers } from "next/headers";
import { serializeJsonLd } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Inline JSON-LD. The payload is generated from validated local content.
 *
 * The nonce is injected when a request runs through the CSP proxy so the
 * script is allowed under a strict policy in production.
 */
export async function JsonLd({ data }: JsonLdProps) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
