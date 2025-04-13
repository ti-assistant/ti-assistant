"use client";

import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { LockedButtons } from "../../../../src/LockedButton";
import FactionCircle from "../../../../src/components/FactionCircle/FactionCircle";
import {
  useCurrentTurn,
  useGameId,
  useStrategyCards,
} from "../../../../src/context/dataHooks";
import {
  useFaction,
  useFactions,
} from "../../../../src/context/factionDataHooks";
import {
  useFinalPhase,
  useGameState,
  usePhase,
} from "../../../../src/context/stateDataHooks";
import { advancePhaseAsync } from "../../../../src/dynamic/api";
import { statusPhaseComplete } from "../main/@phase/status/StatusPhase";
import { getLogEntries } from "../../../../src/util/actionLog";
import { getFactionColor } from "../../../../src/util/factions";
import { getStrategyCardsForFaction } from "../../../../src/util/helpers";
import { phaseString } from "../../../../src/util/strings";
import { rem } from "../../../../src/util/util";
import { setupPhaseComplete } from "../main/@phase/setup/SetupPhase";
import {
  FactionOrdering,
  useActiveFaction,
  useOrderedFactionIds,
} from "../../../../src/context/gameDataHooks";
import { Optional } from "../../../../src/util/types/types";

function NextPhaseButtons({}) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const state = useGameState();

  const intl = useIntl();

  const revealedObjectives = getLogEntries<RevealObjectiveData>(
    currentTurn,
    "REVEAL_OBJECTIVE"
  ).map((logEntry) => logEntry.data.event.objective);

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
                  advancePhaseAsync(gameId);
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
                advancePhaseAsync(gameId);
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
                  advancePhaseAsync(gameId);
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
            unlocked={statusPhaseComplete(currentTurn)}
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
  const phase = usePhase();
  const finalPhase = useFinalPhase();

  let ordering: FactionOrdering;
  let tieBreak: Optional<FactionOrdering>;
  let orderTitle = <></>;
  switch (phase) {
    case "SETUP":
    case "STRATEGY":
    case "UNKNOWN":
      orderTitle = (
        <FormattedMessage
          id="L4UH+0"
          description="An ordering of factions based on the speaker."
          defaultMessage="Speaker Order"
        />
      );
      ordering = "SPEAKER";
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
      ordering = "INITIATIVE";
      break;
    case "AGENDA":
      orderTitle = (
        <FormattedMessage
          id="rbtRWF"
          description="An ordering of factions based on voting."
          defaultMessage="Voting Order"
        />
      );
      ordering = "VOTING";
      break;
    case "END":
      ordering = "VICTORY_POINTS";
      switch (finalPhase) {
        case "ACTION":
        case "STATUS":
          tieBreak = "INITIATIVE";
          break;
        default:
          tieBreak = "SPEAKER";
          break;
      }
      break;
  }

  const orderedFactionIds = useOrderedFactionIds(ordering, tieBreak);

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
        {orderedFactionIds.map((factionId) => {
          return <LocalFactionCircle key={factionId} factionId={factionId} />;
        })}
      </div>
    </div>
  );
}

function LocalFactionCircle({ factionId }: { factionId: FactionId }) {
  const activeFaction = useActiveFaction();

  const faction = useFaction(factionId);
  const gameId = useGameId();

  const router = useRouter();
  const phase = usePhase();
  const strategyCards = useStrategyCards();

  if (!faction) {
    return null;
  }

  const isActive =
    (phase === "ACTION" || phase === "STRATEGY") &&
    activeFaction?.id === factionId;
  const color = faction.passed ? "#555" : getFactionColor(faction);
  const cards = getStrategyCardsForFaction(strategyCards, factionId);
  return (
    <FactionCircle
      key={faction.id}
      borderColor={color}
      factionId={faction.id}
      onClick={() => router.push(`/game/${gameId}/${factionId}`)}
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
}
