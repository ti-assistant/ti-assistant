import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";
import FactionDiv from "../../../../../../../src/components/LabeledDiv/FactionDiv";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";

export default function Convene({ factionId }: { factionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    factionId,
  );

  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "row",
        gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
        gap: "0.5rem",
        width: "60vw",
      }}
    >
      {orderedFactionIds.map((faction) => {
        return (
          <FactionDiv factionId={faction}>
            <GainTFCard factionId={faction} numToGain={{ abilities: 1 }} />
          </FactionDiv>
        );
      })}
    </div>
  );
}
