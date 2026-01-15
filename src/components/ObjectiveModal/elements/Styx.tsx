import Image from "next/image";
import { useGameId, useOptions, useViewOnly } from "../../../context/dataHooks";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import {
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { getColorForFaction } from "../../../util/factions";
import { rem } from "../../../util/util";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";

export default function Styx() {
  const gameId = useGameId();
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
              unscoreObjectiveAsync(gameId, styxScorerId, "Styx");
            }
            if (factionId) {
              scoreObjectiveAsync(gameId, factionId, "Styx");
            }
          }}
          borderColor={
            styxScorerId ? getColorForFaction(styxScorerId) : undefined
          }
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
}
