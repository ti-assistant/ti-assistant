import { FormattedMessage, useIntl } from "react-intl";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import {
  canFactionVote,
  computeRemainingVotes,
  translateOutcome,
} from "../../../../../../../src/components/VoteBlock/VoteBlock";
import {
  useActionLog,
  useAgendas,
  useAttachments,
  useCurrentTurn,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useStrategyCards,
  useTechs,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../../src/context/stateDataHooks";
import { resolveAgendaAsync } from "../../../../../../../src/dynamic/api";
import {
  getActiveAgenda,
  getSelectedEligibleOutcomes,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../../../../../../../src/util/actionLog";
import {
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../../../../../../src/util/api/actionLog";
import { ActionLog } from "../../../../../../../src/util/types/types";
import { objectKeys, rem } from "../../../../../../../src/util/util";
import { computeVotes } from "../AgendaPhase";
import AgendaDetails from "./AgendaDetails";
import CovertLegislation from "./CovertLegislation";

export function CastVotesSection({
  hideObjectives,
  showRemainingVotes,
}: {
  hideObjectives?: boolean;
  showRemainingVotes?: boolean;
}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  if (!state.votingStarted) {
    return null;
  }

  const currentAgendaId = getActiveAgenda(currentTurn);
  if (!currentAgendaId) {
    return null;
  }
  const currentAgenda = agendas[currentAgendaId];
  if (!currentAgenda) {
    return null;
  }

  const localAgenda = structuredClone(currentAgenda);
  // Hack for Covert Legislation.
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (eligibleOutcomes && eligibleOutcomes !== "None" && localAgenda) {
    localAgenda.elect = eligibleOutcomes;
  }

  const representativeGovernmentPassed =
    agendas["Representative Government"]?.passed;

  let totalVotes = 0;
  for (const faction of Object.values(factions)) {
    if (
      !canFactionVote(
        faction,
        agendas,
        state,
        getCurrentTurnLogEntries(actionLog),
        leaders,
      )
    ) {
      continue;
    }
    const factionVotes = computeRemainingVotes(
      faction.id,
      factions,
      planets,
      attachments,
      agendas,
      options,
      state,
      getCurrentPhasePreviousLogEntries(actionLog),
      leaders,
      techs,
    );
    totalVotes += factionVotes.influence;
    totalVotes += factionVotes.extraVotes;
  }

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

  for (const numVotes of Object.values(votes)) {
    totalVotes -= numVotes;
  }
  totalVotes = Math.max(totalVotes, 0);

  const selectedSubAgenda = getSelectedSubAgenda(currentTurn);
  const subAgenda = selectedSubAgenda ? agendas[selectedSubAgenda] : undefined;

  function getSelectedOutcome(
    selectedTargets: string[],
    currentTurn: ActionLog,
  ) {
    if (selectedTargets.length === 1) {
      return selectedTargets[0];
    }
    return getSpeakerTieBreak(currentTurn);
  }

  function readyToResolve() {
    if (!currentAgenda || !getSelectedOutcome(selectedTargets, currentTurn)) {
      return false;
    }
    const localAgenda =
      currentAgenda.id === "Covert Legislation" ? subAgenda : currentAgenda;
    if (!localAgenda) {
      return false;
    }
    return true;
  }

  function completeAgenda() {
    if (!currentAgenda) {
      return;
    }
    const target = getSelectedOutcome(selectedTargets, currentTurn);
    if (!target) {
      return;
    }

    resolveAgendaAsync(gameId, currentAgenda.id, target);
  }

  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="uxvbkq"
          defaultMessage="Results"
          description="Label for section describing the results of voting on an agenda."
        />
      }
    >
      {votes && Object.keys(votes).length > 0 ? (
        <div
          className="flexColumn"
          style={{
            gap: rem(4),
            padding: `${rem(8)} ${rem(20)}`,
            alignItems: "flex-start",
            border: `${"1px"} solid #555`,
            borderRadius: rem(10),
            width: "100%",
          }}
        >
          {Object.entries(votes).map(([target, voteCount]) => {
            let displayText = translateOutcome(
              target,
              localAgenda.elect,
              planets,
              factions,
              objectives,
              agendas,
              strategyCards,
              intl,
            );
            return (
              <div key={target}>
                {displayText}: {voteCount}
              </div>
            );
          })}
        </div>
      ) : null}
      {showRemainingVotes ? (
        <div>
          <FormattedMessage
            id="8j6M9c"
            defaultMessage="Remaining Votes: {votes}"
            description="Label for a section listing out the remaining votes."
            values={{ votes: totalVotes }}
          />
        </div>
      ) : null}
      <CovertLegislation.RevealAgenda />
      <AgendaDetails hideObjectives={hideObjectives} />
      {readyToResolve() ? (
        <div
          className="flexColumn"
          style={{ paddingTop: rem(8), width: "100%" }}
        >
          <button onClick={completeAgenda} disabled={viewOnly}>
            <FormattedMessage
              id="GR4fXA"
              defaultMessage="Resolve with Outcome: {outcome}"
              description="Text on a button that resolves the current agenda with a specific outcome."
              values={{
                outcome: translateOutcome(
                  getSelectedOutcome(selectedTargets, currentTurn),
                  localAgenda?.elect,
                  planets,
                  factions,
                  objectives,
                  agendas,
                  strategyCards,
                  intl,
                ),
              }}
            />
          </button>
        </div>
      ) : null}
    </LabeledDiv>
  );
}
