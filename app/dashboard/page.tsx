import type { Metadata } from "next";
import { DashboardView } from "@/components/DashboardView";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" lead="Your project, your next step, and how far you have come.">
      <DashboardView />
    </PageShell>
  );
}
