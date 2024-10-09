import {
  useFactions,
  useGameState,
  useStrategyCards,
} from "../../context/dataHooks";
import { getFactionColor } from "../../util/factions";
import { getStrategyCardsForFaction } from "../../util/helpers";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import styles from "./FactionRow.module.scss";

interface FactionRowProps {
  onClick: (factionId: FactionId) => void;
}

export default function FactionRow({ onClick }: FactionRowProps) {
  const factions = useFactions();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  let orderedFactions: Faction[] = [];
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderedFactions = Object.values(factions).sort(
        (a, b) => a.order - b.order
      );
      break;
    case "ACTION":
    case "STATUS":
      const orderedCards = Object.values(strategyCards).sort(
        (a, b) => a.order - b.order
      );
      const orderedIds: FactionId[] = [];
      for (const card of orderedCards) {
        if (card.faction && !orderedIds.includes(card.faction)) {
          orderedIds.push(card.faction);
        }
      }

      for (const factionId of orderedIds) {
        const faction = factions[factionId];
        if (!faction) {
          continue;
        }
        orderedFactions.push(faction);
      }
      break;
    case "AGENDA":
      orderedFactions = Object.values(factions).sort((a, b) => {
        if (a.name === "Argent Flight") {
          return -1;
        }
        if (b.name === "Argent Flight") {
          return 1;
        }
        if (a.name === state.speaker) {
          return 1;
        }
        if (b.name === state.speaker) {
          return -1;
        }
        return a.order - b.order;
      });
      break;
  }

  return (
    <div className={styles.FactionRow}>
      <div className={styles.InnerRow}>
        {orderedFactions.map((faction) => {
          const color = faction.passed ? "#555" : getFactionColor(faction);
          const cards = getStrategyCardsForFaction(strategyCards, faction.id);
          return (
            <FactionCircle
              key={faction.id}
              borderColor={color}
              factionId={faction.id}
              onClick={() => onClick(faction.id)}
              tag={
                cards.length > 0 ? (
                  <div
                    style={{
                      fontSize: rem(18),
                      color: cards[0]?.color,
                    }}
                  >
                    {cards[0]?.order}
                  </div>
                ) : undefined
              }
              tagBorderColor={cards[0]?.color}
            />
          );
        })}
      </div>
    </div>
  );
}
