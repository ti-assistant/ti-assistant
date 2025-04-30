import { useOptions, useStrategyCards } from "../../context/dataHooks";
import { useObjectives } from "../../context/objectiveDataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { computeVPs, getFactionColor } from "../../util/factions";
import {
  getInitiativeForFaction,
  getStrategyCardsForFaction,
} from "../../util/helpers";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import styles from "./FactionRow.module.scss";

interface FactionRowProps {
  onClick: (factionId: FactionId) => void;
}

export default function FactionRow({ onClick }: FactionRowProps) {
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
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
    case "END":
      let subOrder =
        state.finalPhase === "ACTION" || state.finalPhase === "STATUS"
          ? "INITIATIVE"
          : "SPEAKER";
      const sortFunction = (a: Faction, b: Faction) => {
        const aVPs = computeVPs(factions, a.id, objectives);
        const bVPs = computeVPs(factions, b.id, objectives);
        switch (options["game-variant"]) {
          case "alliance-combined":
          case "alliance-separate": {
            const aPartner = a.alliancePartner;
            const bPartner = b.alliancePartner;
            if (aPartner === b.id || !aPartner || !bPartner) {
              break;
            }
            const aPartnerVPs = computeVPs(factions, aPartner, objectives);
            const bPartnerVPs = computeVPs(factions, bPartner, objectives);

            if (aVPs + aPartnerVPs > bVPs + bPartnerVPs) {
              return -1;
            }
            return 1;
          }
          case "normal":
          default:
            break;
        }
        if (aVPs !== bVPs) {
          if (bVPs > aVPs) {
            return 1;
          }
          return -1;
        }
        switch (subOrder) {
          case "INITIATIVE":
            const aInitiative = getInitiativeForFaction(strategyCards, a.id);
            const bInitiative = getInitiativeForFaction(strategyCards, b.id);
            if (aInitiative > bInitiative) {
              return 1;
            }
            return -1;
          case "SPEAKER":
            if (a.order > b.order) {
              return 1;
            }
            return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return -1;
      };
      orderedFactions = Object.values(factions).sort(sortFunction);
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
                cards.length > 0 && state.phase !== "END" ? (
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
