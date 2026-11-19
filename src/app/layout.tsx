import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Personal Engineering Blog",
    template: "%s — Personal Engineering Blog",
  },
  description: "Long-form writing on systems, backend engineering, and software design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
