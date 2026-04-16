import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthTour — Fast, Economical, Comfortable Travel",
  description: "Discover the world with NorthTour. Premium travel packages to stunning destinations with unmatched comfort and value.",
  keywords: "travel, tour, destination, adventure, vacation, holiday packages",
  openGraph: {
    title: "NorthTour — Fast, Economical, Comfortable Travel",
    description: "Discover the world with NorthTour. Premium travel packages to stunning destinations.",
    type: "website",
  },
};

import ScrollReveal from "@/components/ScrollReveal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
