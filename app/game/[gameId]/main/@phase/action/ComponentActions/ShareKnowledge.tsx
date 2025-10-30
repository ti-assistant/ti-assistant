import TechResearchSection from "../../../../../../../src/components/TechResearchSection/TechResearchSection";
import { useFaction } from "../../../../../../../src/context/factionDataHooks";
import { hasTech } from "../../../../../../../src/util/api/techs";

export default function ShareKnowledge({
  factionId,
}: {
  factionId: FactionId;
}) {
  const deepwrought = useFaction("Deepwrought Scholarate");
  if (!deepwrought) {
    return null;
  }
  return (
    <TechResearchSection
      factionId={factionId}
      filter={(tech) => hasTech(deepwrought, tech)}
      gain
      shareKnowledge
    />
  );
}
