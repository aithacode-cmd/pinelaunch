import type { ReactNode } from "react";
import { Background } from "./Background";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { Ticker } from "./Ticker";

/**
 * Everything that wraps a public site page: the background, the skip link,
 * the status bar, the header and the footer. The studio does not use it:
 * it is a workspace with its own frame (see app/(studio)).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
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
    </>
  );
}
