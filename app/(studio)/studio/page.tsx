import type { Metadata } from "next";
import { Studio } from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Studio",
  description: "The PineLaunch workspace.",
  // The studio is for the closed beta. Keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <Studio />;
}
