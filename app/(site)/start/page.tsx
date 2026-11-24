import type { Metadata } from "next";
import { IdeaPicker } from "@/components/IdeaPicker";

export const metadata: Metadata = {
  title: "Start · The idea picker",
};

export default function StartPage() {
  return <IdeaPicker />;
}
