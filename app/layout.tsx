import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import { program } from "@/config/program";
import { Background } from "@/components/Background";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Ticker } from "@/components/Ticker";
import "./globals.css";

// Self-hosted at build time by Next.js, so visits never call Google Fonts.
const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${program.name} — ${program.tagline}`,
    template: `%s — ${program.name}`,
  },
  description: `${program.tagline} A free three-week online program for high school students.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full ${heading.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="relative flex min-h-full flex-col">
        <Background />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-panel3 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Ticker />
        <SiteHeader />
        <main id="main" className="relative flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
