import type { Metadata } from "next";
import { PromptsList } from "@/components/PromptsList";

export const metadata: Metadata = {
  title: "Prompts",
};

export default function PromptsPage() {
  return <PromptsList />;
}
