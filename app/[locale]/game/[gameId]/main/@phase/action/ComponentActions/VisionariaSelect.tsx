import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import IconDiv from "../../../../../../../../src/components/LabeledDiv/IconDiv";
import TechResearchSection from "../../../../../../../../src/components/TechResearchSection/TechResearchSection";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { getColorForFaction } from "../../../../../../../../src/util/factions";

export default function VisionariaSelect({}) {
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");

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
            icon={<FactionIcon size={24} factionId={factionId} />}
            iconSize={24}
            color={getColorForFaction(factionId)}
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
