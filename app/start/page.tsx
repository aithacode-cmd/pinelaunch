import type { Metadata } from "next";
import { IdeaPicker } from "@/components/IdeaPicker";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Idea picker",
};

export default function StartPage() {
  return (
    <PageShell
      title="Idea picker"
      lead="Seven short questions. At the end you get a Project Card: a name, a pitch, three features, and a tool."
    >
      <IdeaPicker />
    </PageShell>
  );
}
