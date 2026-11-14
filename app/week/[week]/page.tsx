import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { WeekView } from "@/components/WeekView";
import type { WeekNumber } from "@/config/program";
import { getWeek } from "@/content";

export function generateStaticParams() {
  return [{ week: "1" }, { week: "2" }, { week: "3" }];
}

type Props = { params: Promise<{ week: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  const content = getWeek(Number(week));
  return { title: content ? content.title : "Week" };
}

export default async function WeekPage({ params }: Props) {
  const { week } = await params;
  const n = Number(week);
  if (!getWeek(n)) notFound();
  return (
    <PageShell title="" hideTitle>
      <WeekView week={n as WeekNumber} />
    </PageShell>
  );
}
