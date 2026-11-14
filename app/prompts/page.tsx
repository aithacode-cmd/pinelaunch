import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PromptsList } from "@/components/PromptsList";
import { program } from "@/config/program";

export const metadata: Metadata = {
  title: "AI helper prompts",
};

export default function PromptsPage() {
  return (
    <PageShell
      title="AI helper prompts"
      lead={`Every prompt from all three weeks. Copy one, paste it into ${program.aiHelper.name}, and replace anything in [brackets]. The prompts ask for hints and small steps, not finished work.`}
    >
      <PromptsList />
    </PageShell>
  );
}
