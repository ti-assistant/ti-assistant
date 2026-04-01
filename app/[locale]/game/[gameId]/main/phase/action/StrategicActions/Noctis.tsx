import { use } from "react";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import FormattedDescription from "../../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import SpliceModal from "../../../../../../../../src/components/Splice/SpliceModal";
import Toggle from "../../../../../../../../src/components/Toggle/Toggle";
import { ModalContext } from "../../../../../../../../src/context/contexts";
import { useActionCard } from "../../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColors,
} from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import {
  convertToFactionBorder,
  convertToFactionColor,
} from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";

const Noctis = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Noctis;

function Primary({ factionId }: { factionId: FactionId }) {
  const colors = useFactionColors(factionId);
  const engineer = useActionCard("Engineer");

  return (
    <div>
      {engineer ? (
        <Toggle
          selected={false}
          toggleFn={() => {}}
          info={{
            title: engineer.name,
            description: (
              <FormattedDescription description={engineer.description} />
            ),
          }}
        >
          {engineer.name}
        </Toggle>
      ) : null}
    </div>
  );

  return (
    <div style={{ width: "fit-content" }}>
      <LabeledDiv
        label={<FactionComponents.Name factionId={factionId} />}
        color={colors.color}
        borderColor={colors.border}
        blur
      >
        <GainTFCard factionId={factionId} numToGain={{ genomes: 1 }} splice />
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

  return (
    <div className="flexColumn">
      Participants
      <div className="flexRow">
        {orderedFactionIds.map((factionId) => {
          if (factionId === activeFactionId) {
            return null;
          }
          return (
            <Toggle key={factionId} selected={false} toggleFn={() => {}}>
              <FactionIcon factionId={factionId} size={24} />
            </Toggle>
          );
        })}
      </div>
      <button
        className="outline"
        onClick={() =>
          openModal(<SpliceModal activeFactionId={activeFactionId} />)
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
