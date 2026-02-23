import Image from "next/image";
import { useOptions, useViewOnly } from "../../../context/dataHooks";
import { useFactionColors } from "../../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import { useDataUpdate } from "../../../util/api/dataUpdate";
import { Events } from "../../../util/api/events";
import { rem } from "../../../util/util";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";

export default function Styx() {
  const dataUpdate = useDataUpdate();
  const factionColors = useFactionColors();
  const options = useOptions();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const styx = useObjective("Styx");
  const viewOnly = useViewOnly();

  if (!options.expansions.includes("THUNDERS EDGE") || !styx) {
    return null;
  }

  const styxScorerId = (styx.scorers ?? [])[0];

  return (
    <div
      className="flexRow"
      style={{
        position: "relative",
        alignItems: "flex-start",
        width: rem(72),
        height: rem(72),
      }}
    >
      <Image
        sizes={rem(144)}
        // TODO: Replace with higher quality image of Styx.
        src={`/images/styx.png`}
        alt={`Styx`}
        fill
        style={{ objectFit: "contain" }}
      />
      <div
        className="flexRow"
        style={{
          position: "absolute",
          marginLeft: "72%",
          marginTop: "44%",
        }}
      >
        <FactionSelectRadialMenu
          factions={orderedFactionIds}
          selectedFaction={styxScorerId}
          onSelect={(factionId) => {
            if (styxScorerId) {
              dataUpdate(Events.UnscoreObjectiveEvent(styxScorerId, "Styx"));
            }
            if (factionId) {
              dataUpdate(Events.ScoreObjectiveEvent(factionId, "Styx"));
            }
          }}
          borderColor={styxScorerId ? factionColors[styxScorerId] : undefined}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
}
