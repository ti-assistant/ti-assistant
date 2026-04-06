import { use } from "react";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import SpliceModal from "../../../../../../../../src/components/Splice/SpliceModal";
import Toggle from "../../../../../../../../src/components/Toggle/Toggle";
import { ModalContext } from "../../../../../../../../src/context/contexts";
import { useCurrentTurn } from "../../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColors,
} from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { getSpliceParticipants } from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import {
  convertToFactionBorder,
  convertToFactionColor,
} from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";

const Calamitas = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Calamitas;

function Primary({ factionId }: { factionId: FactionId }) {
  const colors = useFactionColors(factionId);

  return (
    <div style={{ width: "fit-content" }}>
      <LabeledDiv
        label={<FactionComponents.Name factionId={factionId} />}
        color={colors.color}
        borderColor={colors.border}
        blur
      >
        <GainTFCard factionId={factionId} numToGain={{ upgrades: 1 }} splice />
      </LabeledDiv>
    </div>
  );
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
        <GainTFCard factionId={factionId} numToGain={{ upgrades: 1 }} splice />
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
      <LabeledDiv label="Participate" rightLabel="Cost: 1 CC + 4 Resources">
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
            <SpliceModal
              activeFactionId={activeFactionId}
              type="UNIT_UPGRADE"
            />,
          )
        }
      >
        Start Splice
      </button>
    </div>
  );

  return (
    <div
      className="flexRow mediumFont"
      style={{
        paddingTop: rem(4),
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {orderedFactionIds.map((factionId) => {
        if (factionId === activeFactionId) {
          return null;
        }
        return (
          <div key={factionId} style={{ width: "48%" }}>
            <Secondary factionId={factionId} />
          </div>
        );
      })}
    </div>
  );
}
