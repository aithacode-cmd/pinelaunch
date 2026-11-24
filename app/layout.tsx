import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import { program } from "@/config/program";
import "./globals.css";

// Self-hosted at build time by Next.js, so visits never call Google Fonts.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
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
      className={`h-full ${display.variable} ${heading.variable} ${body.variable} ${mono.variable} ${serif.variable}`}
    >
      {/* The header, footer and background live in app/(site)/layout.tsx.
          The studio in app/(studio) has its own frame. */}
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
