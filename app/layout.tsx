import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { program } from "@/config/program";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
    <html
      lang="en"
      className={`h-full ${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="relative flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="relative flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
