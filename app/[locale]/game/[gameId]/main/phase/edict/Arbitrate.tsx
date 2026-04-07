import { useState } from "react";
import DiscardTFCard from "../../../../../../../src/components/Actions/DiscardSplicedCard";
import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";
import FactionDiv from "../../../../../../../src/components/LabeledDiv/FactionDiv";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import {
  getDiscardedTFCards,
  getDiscardedTFCardsByType,
} from "../../../../../../../src/util/actionLog";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import Toggle from "../../../../../../../src/components/Toggle/Toggle";
import FactionIcon from "../../../../../../../src/components/FactionIcon/FactionIcon";

export default function Arbitrate({ factionId }: { factionId: FactionId }) {
  const [allowedFactions, setAllowedFactions] = useState<Set<FactionId>>(
    new Set(),
  );
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    factionId,
  );
  const currentTurn = useCurrentTurn();
  const discardedCards = getDiscardedTFCards(currentTurn);

  return (
    <div className="flexColumn">
      <MulliganSection factionId={factionId} />
      <div className="flexRow">
        {orderedFactionIds.map((otherFaction) => {
          if (factionId === otherFaction) {
            return null;
          }
          let hasDiscards = false;
          for (const card of discardedCards) {
            if (card.data.event.faction === otherFaction) {
              hasDiscards = true;
              break;
            }
          }
          return (
            <Toggle
              key={otherFaction}
              selected={hasDiscards || allowedFactions.has(otherFaction)}
              toggleFn={(prev) => {
                const setCopy = new Set(Array.from(allowedFactions));
                if (!prev) {
                  setCopy.add(otherFaction);
                } else {
                  setCopy.delete(otherFaction);
                }
                setAllowedFactions(setCopy);
              }}
              disabled={hasDiscards}
            >
              <FactionIcon factionId={otherFaction} size={16} />
            </Toggle>
          );
        })}
      </div>
      {orderedFactionIds.map((otherFaction) => {
        if (factionId === otherFaction) {
          return null;
        }
        let hasDiscards = false;
        for (const card of discardedCards) {
          if (card.data.event.faction === otherFaction) {
            hasDiscards = true;
            break;
          }
        }
        if (!hasDiscards && !allowedFactions.has(otherFaction)) {
          return null;
        }
        return <MulliganSection key={otherFaction} factionId={otherFaction} />;
      })}
    </div>
  );
}

function MulliganSection({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const discardedCardsByType = getDiscardedTFCardsByType(
    currentTurn,
    factionId,
  );
  const [done, setDone] = useState<boolean>(false);
  return (
    <FactionDiv
      factionId={factionId}
      rightLabel={
        <Toggle selected={done} toggleFn={() => setDone(!done)}>
          Done
        </Toggle>
      }
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(2, 1fr)",
          columnGap: "0.5rem",
          rowGap: "0.25rem",
        }}
      >
        <div>Discarded Cards</div>
        <div>Gained Cards</div>
        <div>
          <DiscardTFCard
            factionId={factionId}
            numToDiscard={{
              abilities: done ? 0 : Number.MAX_SAFE_INTEGER,
              genomes: done ? 0 : Number.MAX_SAFE_INTEGER,
              upgrades: done ? 0 : Number.MAX_SAFE_INTEGER,
              paradigms: 0,
            }}
          />
        </div>
        <div>
          <GainTFCard
            factionId={factionId}
            numToGain={{
              abilities: discardedCardsByType.abilities.length,
              genomes: discardedCardsByType.genomes.length,
              upgrades: discardedCardsByType.upgrades.length,
              paradigms: 0,
            }}
          />
        </div>
      </div>
    </FactionDiv>
  );
}
