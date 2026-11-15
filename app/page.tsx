import { Hero } from "@/components/home/Hero";
import { ToolsStrip } from "@/components/home/ToolsStrip";
import {
  ClosingSection,
  OutcomeSection,
  RunsSection,
  ScheduleSection,
  ShowcaseSection,
  WhoSection,
} from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolsStrip />
      <WhoSection />
      <ScheduleSection />
      <ShowcaseSection />
      <OutcomeSection />
      <RunsSection />
      <ClosingSection />
    </>
  );
}
