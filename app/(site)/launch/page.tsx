import type { Metadata } from "next";
import { LaunchView } from "@/components/LaunchView";

export const metadata: Metadata = {
  title: "Launch Day",
};

export default function LaunchPage() {
  return <LaunchView />;
}
