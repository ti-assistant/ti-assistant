import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
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
