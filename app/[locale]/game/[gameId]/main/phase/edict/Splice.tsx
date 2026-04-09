import { use, useState } from "react";
import Chip from "../../../../../../../src/components/Chip/Chip";
import ChipGroup from "../../../../../../../src/components/Chip/ChipGroup";
import { ModalContext } from "../../../../../../../src/context/contexts";
import AbilitySVG from "../../../../../../../src/icons/twilightsfall/ability";
import GenomeSVG from "../../../../../../../src/icons/twilightsfall/genome";
import UpgradeSVG from "../../../../../../../src/icons/twilightsfall/upgrade";
import SpliceModal from "../../../../../../../src/components/Splice/SpliceModal";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import { getRevealedTFCards } from "../../../../../../../src/util/actionLog";

type SpliceType = "ABILITY" | "GENOME" | "UNIT_UPGRADE";

export default function Splice({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();

  const revealedCards = getRevealedTFCards(currentTurn);

  const revealedType = revealedCards[0]?.data.event.type;

  const { openModal } = use(ModalContext);
  const [type, setType] = useState<SpliceType>("ABILITY");

  const localType = revealedType ?? type;

  return (
    <div className="flexColumn">
      <ChipGroup label="Type:">
        <Chip
          selected={localType === "ABILITY"}
          toggleFn={() => setType("ABILITY")}
          disabled={!!revealedType}
        >
          <div
            style={{ position: "relative", height: "1.25em", width: "1.5em" }}
          >
            <AbilitySVG />
          </div>
        </Chip>
        <Chip
          selected={localType === "GENOME"}
          toggleFn={() => setType("GENOME")}
          disabled={!!revealedType}
        >
          <div
            style={{ position: "relative", height: "1.5em", width: "1.5em" }}
          >
            <GenomeSVG />
          </div>
        </Chip>
        <Chip
          selected={localType === "UNIT_UPGRADE"}
          toggleFn={() => setType("UNIT_UPGRADE")}
          disabled={!!revealedType}
        >
          <div
            style={{ position: "relative", height: "1.5em", width: "1.5em" }}
          >
            <UpgradeSVG />
          </div>
        </Chip>
      </ChipGroup>
      <button
        className="outline"
        onClick={() =>
          openModal(
            <SpliceModal
              allPlayers
              activeFactionId={factionId}
              type={localType}
            />,
          )
        }
      >
        Start Splice
      </button>
    </div>
  );
}
