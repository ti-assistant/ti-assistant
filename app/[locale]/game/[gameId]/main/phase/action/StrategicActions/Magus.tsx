import { use } from "react";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import SpliceModal from "../../../../../../../../src/components/Splice/SpliceModal";
import Toggle from "../../../../../../../../src/components/Toggle/Toggle";
import { useCurrentTurn } from "../../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColors,
} from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import {
  getResearchedTechs,
  getSpliceParticipants,
} from "../../../../../../../../src/util/actionLog";
import {
  getFactionBorder,
  getFactionColor,
} from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";
import { ModalContext } from "../../../../../../../../src/context/contexts";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";

const Magus = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Magus;

function Primary({ factionId }: { factionId: FactionId }) {
  const colors = useFactionColors(factionId);
  const dataUpdate = useDataUpdate();
  const currentTurn = useCurrentTurn();

  const spliceParticipants = new Set(getSpliceParticipants(currentTurn));

  const inSplice = spliceParticipants.has(factionId);

  return (
    <div style={{ width: "fit-content" }}>
      <Toggle
        selected={inSplice}
        toggleFn={() => {
          if (inSplice) {
            dataUpdate(Events.LeaveSpliceEvent(factionId));
          } else {
            dataUpdate(Events.JoinSpliceEvent(factionId));
          }
        }}
      >
        Extra Card - 3 Resources or Influence
      </Toggle>
    </div>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  if (!faction) {
    return null;
  }
  const researchedTechs = getResearchedTechs(currentTurn, factionId);
  const secondaryState = faction?.secondary ?? "PENDING";
  if (researchedTechs.length === 0 && secondaryState === "SKIPPED") {
    return null;
  }
  return (
    <LabeledDiv
      key={factionId}
      label={<FactionComponents.Name factionId={factionId} />}
      color={getFactionColor(faction)}
      borderColor={getFactionBorder(faction)}
      opts={{ fixedWidth: true }}
      blur
    >
      <>
        <GainTFCard
          factionId={factionId}
          action={{ to: factionId }}
          numToGain={{ abilities: 1 }}
          splice
        />
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );
  const dataUpdate = useDataUpdate();
  const currentTurn = useCurrentTurn();
  const { openModal } = use(ModalContext);

  const spliceParticipants = new Set(getSpliceParticipants(currentTurn));

  return (
    <div className="flexColumn" style={{ fontSize: "1rem" }}>
      <LabeledDiv
        label="Participate"
        rightLabel="1 CC + 3 Resources or Influence"
      >
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
            <SpliceModal activeFactionId={activeFactionId} type="ABILITY" />,
          )
        }
      >
        Start Splice
      </button>
    </div>
  );
}
