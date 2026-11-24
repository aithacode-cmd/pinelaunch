import { SiteChrome } from "@/components/SiteChrome";

/** The public site: every page here gets the header, footer and background. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
