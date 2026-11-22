import localFont from "next/font/local";

/**
 * UI / body face from the design spec (Rubik role).
 * Self-hosted variable WOFF2 served by Google Fonts, unmodified.
 */
export const rubik = localFont({
  src: [{ path: "./rubik/Rubik-Variable.woff2", weight: "300 900", style: "normal" }],
  variable: "--font-rubik",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Chunky display sans from the design spec (Space Grotesk substitute).
 * Self-hosted variable WOFF2 served by Google Fonts, unmodified.
 */
export const spaceGrotesk = localFont({
  src: [
    {
      path: "./space-grotesk/SpaceGrotesk-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["Rubik", "system-ui", "sans-serif"],
});
