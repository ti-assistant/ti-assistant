import Image from "next/image";
import { useViewOnly } from "../../../context/dataHooks";
import { useFactionColor } from "../../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import { useDataUpdate } from "../../../util/api/dataUpdate";
import { Events } from "../../../util/api/events";
import { rem } from "../../../util/util";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";

export default function CustodiansToken() {
  const dataUpdate = useDataUpdate();
  const viewOnly = useViewOnly();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const custodiansToken = useObjective("Custodians Token");
  const custodiansScorerId = (custodiansToken?.scorers ?? [])[0];
  const factionColor = useFactionColor(
    custodiansScorerId ?? "Vuil'raith Cabal",
  );

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
              dataUpdate(
                Events.UnscoreObjectiveEvent(
                  custodiansScorerId,
                  "Custodians Token",
                ),
              );
            }
            if (factionId) {
              dataUpdate(
                Events.ScoreObjectiveEvent(factionId, "Custodians Token"),
              );
            }
          }}
          borderColor={custodiansScorerId ? factionColor : undefined}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
}
