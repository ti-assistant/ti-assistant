import { use } from "react";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import SpliceModal from "../../../../../../../../src/components/Splice/SpliceModal";
import Toggle from "../../../../../../../../src/components/Toggle/Toggle";
import { ModalContext } from "../../../../../../../../src/context/contexts";
import { useCurrentTurn } from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { getSpliceParticipants } from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import {
  convertToFactionBorder,
  convertToFactionColor,
} from "../../../../../../../../src/util/factions";

const Noctis = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Noctis;

function Primary({ factionId }: { factionId: FactionId }) {
  return null;
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);

  if (faction?.secondary === "SKIPPED") {
    return null;
  }

  return (
    <LabeledDiv
      key={factionId}
      label={<FactionComponents.Name factionId={factionId} />}
      color={convertToFactionColor(faction?.color)}
      borderColor={convertToFactionBorder(faction?.color)}
      opts={{ fixedWidth: true }}
      blur
    >
      <>
        <GainTFCard factionId={factionId} numToGain={{ genomes: 1 }} splice />
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const { openModal } = use(ModalContext);
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );
  const dataUpdate = useDataUpdate();
  const currentTurn = useCurrentTurn();

  const spliceParticipants = new Set(getSpliceParticipants(currentTurn));

  return (
    <div className="flexColumn" style={{ fontSize: "1rem" }}>
      <LabeledDiv label="Participate" rightLabel="Cost: 1 CC">
        <div className="flexRow">
          {orderedFactionIds.map((factionId) => {
            if (factionId === activeFactionId) {
              return null;
            }
            const inSplice = spliceParticipants.has(factionId);
            return (
              <Toggle
                key={factionId}
                selected={inSplice}
                toggleFn={() => {
                  if (inSplice) {
                    dataUpdate(Events.LeaveSpliceEvent(factionId));
                  } else {
                    dataUpdate(Events.JoinSpliceEvent(factionId));
                  }
                }}
              >
                <FactionIcon factionId={factionId} size={24} />
              </Toggle>
            );
          })}
        </div>
      </LabeledDiv>
      <button
        className="outline"
        onClick={() =>
          openModal(
            <SpliceModal activeFactionId={activeFactionId} type="GENOME" />,
          )
        }
      >
        Start Splice
      </button>
    </div>
  );
}
