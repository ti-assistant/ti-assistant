import Image from "next/image";
import { useGameId, useViewOnly } from "../../../context/dataHooks";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import {
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { getColorForFaction } from "../../../util/factions";
import { rem } from "../../../util/util";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";

export default function CustodiansToken() {
  const gameId = useGameId();
  const viewOnly = useViewOnly();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const custodiansToken = useObjective("Custodians Token");
  const custodiansScorerId = (custodiansToken?.scorers ?? [])[0];

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
        src={`/images/custodians.png`}
        alt={`Custodians Token`}
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
          selectedFaction={custodiansScorerId}
          onSelect={(factionId) => {
            if (custodiansScorerId) {
              unscoreObjectiveAsync(
                gameId,
                custodiansScorerId,
                "Custodians Token"
              );
            }
            if (factionId) {
              scoreObjectiveAsync(gameId, factionId, "Custodians Token");
            }
          }}
          borderColor={
            custodiansScorerId
              ? getColorForFaction(custodiansScorerId)
              : undefined
          }
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
}
