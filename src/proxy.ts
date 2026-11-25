import { type NextRequest, NextResponse } from "next/server";

/**
 * Route-level security headers + CSP nonce, applied to every response.
 *
 * Nonce handling follows the official Next.js "Strict CSP" pattern:
 * `proxy` generates a fresh per-request nonce, forwards it as the
 * `x-nonce` request header, and sets the CSP header on the response.
 * Components that render inline scripts (e.g. JSON-LD) read `x-nonce`
 * via `await headers()` and attach it as the `nonce` attribute.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "",
  ]
    .join("; ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const securityHeaders: Record<string, string> = {
    "Content-Security-Policy": cspHeader,
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-DNS-Prefetch-Control": "off",
  };

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}
