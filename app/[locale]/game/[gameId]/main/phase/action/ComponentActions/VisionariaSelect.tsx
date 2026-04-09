import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import IconDiv from "../../../../../../../../src/components/LabeledDiv/IconDiv";
import TechResearchSection from "../../../../../../../../src/components/TechResearchSection/TechResearchSection";
import { useAllFactionColors } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";

export default function VisionariaSelect({}) {
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useAllFactionColors();

  return (
    <div
      className="flexColumn"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      {mapOrderedFactionIds.map((factionId) => {
        if (factionId === "Deepwrought Scholarate") {
          return null;
        }
        return (
          <IconDiv
            key={factionId}
            icon={<FactionComponents.Icon size={24} factionId={factionId} />}
            iconSize={24}
            color={factionColors[factionId]?.border}
          >
            <TechResearchSection
              factionId={factionId}
              duplicateToFaction="Deepwrought Scholarate"
              hideWrapper
              filter={(tech) => !tech.faction && tech.type !== "UPGRADE"}
            />
          </IconDiv>
        );
      })}
    </div>
  );
}
