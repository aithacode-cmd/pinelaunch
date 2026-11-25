import { HubSection } from "@/components/home/HubSection";
import { NightHero } from "@/components/home/NightHero";
import { ToolsStrip } from "@/components/home/ToolsStrip";
import { WeeksStage } from "@/components/home/WeeksStage";
import { ClosingSection, OutcomeSection, ParentsStrip, RunsSection, ShowcaseSection, WhoSection } from "@/components/home/Sections";

/**
 * Night to launch: the page scrolls from a night sky (the idea) through dawn
 * (the build) to a sunrise close (the launch). The paid plans moved to the
 * parent pages on 2026-11-25.
 */
export default function HomePage() {
  return (
    <>
      <NightHero />
      <HubSection />
      <ToolsStrip />
      <WeeksStage />
      <ShowcaseSection />
      <WhoSection />
      <OutcomeSection />
      <ParentsStrip />
      <RunsSection />
      <ClosingSection />
    </>
  );
}
