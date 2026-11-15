import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeekView } from "@/components/WeekView";
import type { WeekNumber } from "@/config/program";
import { getWeek } from "@/content";

const stageNames: Record<number, string> = { 1: "Idea", 2: "Build", 3: "Launch" };

export function generateStaticParams() {
  return [{ week: "1" }, { week: "2" }, { week: "3" }];
}

type Props = { params: Promise<{ week: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  const n = Number(week);
  return { title: getWeek(n) ? `Week ${n} · ${stageNames[n]}` : "Week" };
}

export default async function WeekPage({ params }: Props) {
  const { week } = await params;
  const n = Number(week);
  if (!getWeek(n)) notFound();
  return <WeekView week={n as WeekNumber} />;
}
