import { SiteChrome } from "@/components/SiteChrome";

/** The public site: every page here gets the skip link, header and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
