import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "flow+ — Creative AI & Automation Studio",
  description:
    "We build automation systems, AI products, digital content engines, and web experiences. Based in Abu Dhabi, built for the region, capable globally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
