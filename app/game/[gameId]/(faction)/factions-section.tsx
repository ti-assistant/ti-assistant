"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LockedButtons } from "../../../../src/LockedButton";
import FactionCircle from "../../../../src/components/FactionCircle/FactionCircle";
import { GameIdContext } from "../../../../src/context/Context";
import {
  useActionLog,
  useFactions,
  useGameState,
  useStrategyCards,
} from "../../../../src/context/dataHooks";
import { advancePhaseAsync } from "../../../../src/dynamic/api";
import { advanceToStatusPhase } from "../../../../src/main/ActionPhase";
import {
  setupPhaseComplete,
  startFirstRound,
} from "../../../../src/main/SetupPhase";
import { statusPhaseComplete } from "../../../../src/main/StatusPhase";
import { advanceToActionPhase } from "../../../../src/main/StrategyPhase";
import { getCurrentTurnLogEntries } from "../../../../src/util/api/actionLog";
import { getFactionColor } from "../../../../src/util/factions";
import { getStrategyCardsForFaction } from "../../../../src/util/helpers";
import { phaseString } from "../../../../src/util/strings";
import { rem } from "../../../../src/util/util";

function NextPhaseButtons({}) {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const state = useGameState();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);

  switch (state.phase) {
    case "SETUP":
      return (
        <div className="flexColumn" style={{ marginTop: rem(8) }}>
          <LockedButtons
            unlocked={setupPhaseComplete(factions, revealedObjectives)}
            buttons={[
              {
                text: intl.formatMessage({
                  id: "lYD2yu",
                  description: "Text on a button that will start a game.",
                  defaultMessage: "Start Game",
                }),
                onClick: () => {
                  if (!gameId) {
                    return;
                  }
                  startFirstRound(gameId);
                },
              },
            ]}
          />
        </div>
      );
    case "STRATEGY":
      if (state.activeplayer === "None") {
        return (
          <div className="flexColumn" style={{ marginTop: rem(8) }}>
            <button
              onClick={() => {
                if (!gameId) {
                  return;
                }
                advanceToActionPhase(gameId);
              }}
            >
              <FormattedMessage
                id="8/h2ME"
                defaultMessage="Advance to {phase} Phase"
                description="Text on a button that will advance the game to a specific phase."
                values={{
                  phase: phaseString("ACTION", intl),
                }}
              />
            </button>
          </div>
        );
      }
      return null;
    case "ACTION":
      return (
        <div className="flexColumn" style={{ marginTop: rem(8) }}>
          <LockedButtons
            unlocked={state.activeplayer === "None"}
            buttons={[
              {
                text: intl.formatMessage(
                  {
                    id: "8/h2ME",
                    defaultMessage: "Advance to {phase} Phase",
                    description:
                      "Text on a button that will advance the game to a specific phase.",
                  },
                  { phase: phaseString("STATUS", intl) }
                ),
                onClick: () => {
                  if (!gameId) {
                    return;
                  }
                  advanceToStatusPhase(gameId);
                },
              },
            ]}
          />
        </div>
      );
    case "STATUS":
      let buttons = [];
      if (!state.agendaUnlocked) {
        buttons.push({
          text: intl.formatMessage({
            id: "5WXn8l",
            defaultMessage: "Start Next Round",
            description: "Text on a button that will start the next round.",
          }),
          onClick: () => {
            if (!gameId) {
              return;
            }
            advancePhaseAsync(gameId, true);
          },
        });
      }
      buttons.push({
        text: intl.formatMessage(
          {
            id: "8/h2ME",
            defaultMessage: "Advance to {phase} Phase",
            description:
              "Text on a button that will advance the game to a specific phase.",
          },
          { phase: phaseString("AGENDA", intl) }
        ),
        onClick: () => {
          if (!gameId) {
            return;
          }
          advancePhaseAsync(gameId);
        },
      });
      return (
        <div className="flexColumn" style={{ marginTop: rem(8) }}>
          <LockedButtons
            unlocked={statusPhaseComplete(getCurrentTurnLogEntries(actionLog))}
            buttons={buttons}
          />
        </div>
      );
    case "AGENDA":
      return (
        <div className="flexColumn" style={{ marginTop: rem(8) }}>
          <LockedButtons
            unlocked={state.agendaNum === 3}
            buttons={[
              {
                text: intl.formatMessage({
                  id: "5WXn8l",
                  defaultMessage: "Start Next Round",
                  description:
                    "Text on a button that will start the next round.",
                }),
                onClick: () => {
                  if (!gameId) {
                    return;
                  }
                  advancePhaseAsync(gameId, true);
                },
              },
            ]}
          />
        </div>
      );
  }
  return null;
}

export default function FactionsSection({}) {
  const router = useRouter();
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  let orderedFactions: Faction[] = [];
  let orderTitle = <></>;
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderTitle = (
        <FormattedMessage
          id="L4UH+0"
          description="An ordering of factions based on the speaker."
          defaultMessage="Speaker Order"
        />
      );
      orderedFactions = Object.values(factions).sort(
        (a, b) => a.order - b.order
      );
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = (
        <FormattedMessage
          id="09baik"
          description="An ordering of factions based on initiative."
          defaultMessage="Initiative Order"
        />
      );
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
      orderTitle = (
        <FormattedMessage
          id="rbtRWF"
          description="An ordering of factions based on voting."
          defaultMessage="Voting Order"
        />
      );
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
    <div
      className="flexColumn"
      style={{
        width: "100%",
        gap: rem(4),
        fontSize: rem(18),
      }}
    >
      <NextPhaseButtons />
      {orderTitle}
      <div
        className="flexRow"
        style={{ width: "100%", alignItems: "space-evenly", gap: 0 }}
      >
        {orderedFactions.map((faction) => {
          const isActive =
            (state.phase === "ACTION" || state.phase === "STRATEGY") &&
            state.activeplayer === faction.id;
          const color = faction.passed ? "#555" : getFactionColor(faction);
          const cards = getStrategyCardsForFaction(strategyCards, faction.id);
          return (
            <FactionCircle
              key={faction.id}
              borderColor={color}
              factionId={faction.id}
              onClick={() => router.push(`/game/${gameId}/${faction.id}`)}
              style={{
                backgroundColor: isActive ? "#333" : undefined,
                boxShadow: isActive
                  ? color === "Black"
                    ? "#eee 0 0 8px 4px"
                    : "var(--border-color) 0 0 8px 4px"
                  : undefined,
              }}
              tag={
                cards.length > 0 ? (
                  <div
                    style={{
                      fontSize: rem(18),
                      color: cards[0]?.used ? "#555" : cards[0]?.color,
                    }}
                  >
                    {cards[0]?.order}
                  </div>
                ) : undefined
              }
              tagBorderColor={cards[0]?.used ? "#555" : cards[0]?.color}
            />
          );
        })}
      </div>
    </div>
  );
}
