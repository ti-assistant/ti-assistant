import { FormattedMessage, useIntl } from "react-intl";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import VoteBlock, {
  getTargets,
} from "../../../../../../../src/components/VoteBlock/VoteBlock";
import {
  useAgendas,
  useCurrentTurn,
  useGameId,
  useOptions,
  usePlanets,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import { speakerTieBreakAsync } from "../../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../../src/HoverMenu";
import { SelectableRow } from "../../../../../../../src/SelectableRow";
import {
  getActiveAgenda,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../../../../../src/util/actionLog";
import { getColorForFaction } from "../../../../../../../src/util/factions";
import { objectKeys, rem } from "../../../../../../../src/util/util";
import { computeVotes } from "../AgendaPhase";

export default function VotingColumn({
  speaker,
  manualVotes,
}: {
  speaker: FactionId;
  manualVotes?: boolean;
}) {
  const agendas = useAgendas();
  const currentTurn = useCurrentTurn();
  const factions = useFactions();

  const speakerOrder = factions[speaker]?.order ?? 1;

  const votingOrder = Object.values(factions).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === speakerOrder) {
      return 1;
    }
    if (b.order === speakerOrder) {
      return -1;
    }
    if (a.order > speakerOrder && b.order < speakerOrder) {
      return -1;
    }
    if (a.order < speakerOrder && b.order > speakerOrder) {
      return 1;
    }
    return a.order - b.order;
  });

  const activeAgenda = getActiveAgenda(currentTurn);
  const currentAgenda = activeAgenda ? agendas[activeAgenda] : undefined;

  // Hack the elect field to handle Covert Legislation.
  const localAgenda = currentAgenda
    ? structuredClone(currentAgenda)
    : undefined;
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (eligibleOutcomes && eligibleOutcomes !== "None" && localAgenda) {
    localAgenda.elect = eligibleOutcomes;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        paddingBottom: rem(8),
        alignItems: "flex-end",
        gap: rem(8),
        maxWidth: rem(480),
      }}
    >
      <div
        style={{
          display: "grid",
          gridColumn: "span 4",
          gridTemplateColumns: "subgrid",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <FormattedMessage
            id="ifN0t/"
            defaultMessage="Outcome"
            description="Header for column listing what voting outcome players have selected."
          />
        </div>
        <div
          className="flexColumn"
          style={{
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridColumn: "span 3",
          }}
        >
          <div className="flexRow">
            <FormattedMessage
              id="5FWWeX"
              defaultMessage="Available"
              description="Header for column listing how many votes players have available."
            />
          </div>
          <div className="flexRow">
            <FormattedMessage
              id="VIWZO7"
              defaultMessage="Votes"
              description="Header for column listing how many votes players have cast."
            />
          </div>
          <div className="flexRow">
            <FormattedMessage
              id="X3VPhD"
              defaultMessage="Extra"
              description="Header for column listing how many extra votes players have cast."
            />
          </div>
        </div>
      </div>
      {votingOrder.map((faction) => {
        return (
          <VoteBlock
            key={faction.id}
            factionId={faction.id}
            agenda={localAgenda}
            manualVotes={manualVotes}
          />
        );
      })}
      <SpeakerTieBreak speaker={speaker} />
    </div>
  );
}

function SpeakerTieBreak({ speaker }: { speaker: FactionId }) {
  const agendas = useAgendas();
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const activeAgenda = getActiveAgenda(currentTurn);
  const currentAgenda = activeAgenda ? agendas[activeAgenda] : undefined;
  if (!currentAgenda) {
    return null;
  }

  const localAgenda = currentAgenda
    ? structuredClone(currentAgenda)
    : undefined;
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (eligibleOutcomes && eligibleOutcomes !== "None" && localAgenda) {
    localAgenda.elect = eligibleOutcomes;
  }

  const representativeGovernmentPassed =
    agendas["Representative Government"]?.passed;

  const votes = computeVotes(
    currentAgenda,
    currentTurn,
    objectKeys(factions).length,
    !!representativeGovernmentPassed,
  );
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });
  const isTie = selectedTargets.length !== 1;

  if (!isTie) {
    return null;
  }

  const allTargets = getTargets(
    localAgenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    options,
    intl,
  );

  let items = selectedTargets.length;
  if (items === 0) {
    items = allTargets.length;
  }
  if (items > 10) {
    items = 10;
  }
  const tieBreak = getSpeakerTieBreak(currentTurn);

  if (tieBreak) {
    return (
      <LabeledDiv label="Speaker Tie Break" style={{ gridColumn: "span 4" }}>
        <SelectableRow
          itemId={tieBreak}
          removeItem={() => speakerTieBreakAsync(gameId, "None")}
          viewOnly={viewOnly}
        >
          {tieBreak}
        </SelectableRow>
      </LabeledDiv>
    );
  }

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={speaker} />}
      color={getColorForFaction(speaker)}
      style={{ width: "auto", gridColumn: "span 4" }}
    >
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="Kzzn9t"
            description="Text on a hover menu for the speaker choosing the outcome."
            defaultMessage="Choose outcome if tied"
          />
        }
      >
        <div
          className="flexRow"
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start",
            maxWidth: "92vw",
            overflowX: "auto",
            gap: rem(4),
            padding: rem(8),
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${items}, auto)`,
          }}
        >
          {selectedTargets.length > 0
            ? selectedTargets.map((target) => {
                return (
                  <button
                    key={target}
                    style={{
                      fontSize: rem(14),
                      writingMode: "horizontal-tb",
                    }}
                    onClick={() => speakerTieBreakAsync(gameId, target)}
                    disabled={viewOnly}
                  >
                    {target}
                  </button>
                );
              })
            : allTargets.map((target) => {
                if (target.id === "Abstain") {
                  return null;
                }
                return (
                  <button
                    key={target.id}
                    style={{
                      fontSize: rem(14),
                      writingMode: "horizontal-tb",
                    }}
                    onClick={() => speakerTieBreakAsync(gameId, target.id)}
                    disabled={viewOnly}
                  >
                    {target.name}
                  </button>
                );
              })}
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}
