import { useState } from "react";
import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";
import Chip from "../../../../../../../src/components/Chip/Chip";
import ChipGroup from "../../../../../../../src/components/Chip/ChipGroup";
import FactionDiv from "../../../../../../../src/components/LabeledDiv/FactionDiv";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import { getGainedTFCards } from "../../../../../../../src/util/actionLog";

type DiceRoll = "1-5" | "6-9" | "10";

export default function LegacyOfIxth({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();

  const gainedCards = getGainedTFCards(currentTurn);

  const anyGained = gainedCards.length > 0;

  const [roll, setRoll] = useState<DiceRoll>("1-5");

  return (
    <div className="flexColumn" style={{ alignItems: "flex-start" }}>
      <ChipGroup label="Roll:">
        <Chip
          selected={roll === "1-5"}
          toggleFn={() => setRoll("1-5")}
          disabled={anyGained}
        >
          1 - 5
        </Chip>
        <Chip
          selected={roll === "6-9"}
          toggleFn={() => setRoll("6-9")}
          disabled={anyGained}
        >
          6 - 9
        </Chip>
        <Chip
          selected={roll === "10"}
          toggleFn={() => setRoll("10")}
          disabled={anyGained}
        >
          10
        </Chip>
      </ChipGroup>
      <CardGainSection factionId={factionId} roll={roll} />
    </div>
  );
}

function CardGainSection({
  factionId,
  roll,
}: {
  factionId: FactionId;
  roll: DiceRoll;
}) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    factionId,
  );
  if (roll === "1-5") {
    return null;
  }
  if (roll === "6-9") {
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
              <GainTFCard
                factionId={faction}
                numToGain={{ total: 1, abilities: 1, genomes: 1, upgrades: 1 }}
              />
            </FactionDiv>
          );
        })}
      </div>
    );
  }

  return (
    <FactionDiv factionId={factionId}>
      <GainTFCard
        factionId={factionId}
        numToGain={{ total: 2, abilities: 2, genomes: 2, upgrades: 2 }}
      />
    </FactionDiv>
  );
}
