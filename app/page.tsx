import { Hero } from "@/components/home/Hero";
import { LadderSection } from "@/components/home/LadderSection";
import { ToolsStrip } from "@/components/home/ToolsStrip";
import { WeeksStage } from "@/components/home/WeeksStage";
import { ClosingSection, OutcomeSection, RunsSection, ShowcaseSection, WhoSection } from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ToolsStrip />
      <WhoSection />
      <WeeksStage />
      <ShowcaseSection />
      <OutcomeSection />
      <LadderSection />
      <RunsSection />
      <ClosingSection />
    </>
  );
}
