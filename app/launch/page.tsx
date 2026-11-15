import type { Metadata } from "next";
import { LaunchView } from "@/components/LaunchView";

export const metadata: Metadata = {
  title: "Launch Day · Dec 20, 2026",
};

export default function LaunchPage() {
  return <LaunchView />;
}
