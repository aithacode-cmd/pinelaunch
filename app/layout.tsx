import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { program } from "@/config/program";
import "./globals.css";

// Self-hosted at build time by Next.js, so visits never call Google Fonts.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${program.name} — ${program.tagline}`,
    template: `%s — ${program.name}`,
  },
  description: `${program.tagline} A free three-week online program for high school students.`,
  other: { "theme-color": "#120b2e" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${display.variable} ${sans.variable} ${mono.variable}`}>
      {/* The skip link, header and footer live in components/SiteChrome.tsx, used by
          app/(site)/layout.tsx and app/not-found.tsx. The studio in app/(studio) has its own frame. */}
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
