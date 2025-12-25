import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColor,
} from "../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import { getResearchedTechs } from "../../../../../../../src/util/actionLog";
import { getFactionColor } from "../../../../../../../src/util/factions";
import { rem } from "../../../../../../../src/util/util";

const Magus = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Magus;

function Primary({ factionId }: { factionId: FactionId }) {
  const factionColor = useFactionColor(factionId);

  return (
    <div style={{ width: "fit-content" }}>
      <LabeledDiv
        label={<FactionComponents.Name factionId={factionId} />}
        color={factionColor}
        blur
      >
        <GainTFCard factionId={factionId} numToGain={{ abilities: 2 }} />
      </LabeledDiv>
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
      opts={{ fixedWidth: true }}
      blur
    >
      <>
        <GainTFCard factionId={factionId} numToGain={{ abilities: 1 }} />
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId
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
