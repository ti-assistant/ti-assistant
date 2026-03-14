import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../../../../../../../../src/AgendaRow";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { Selector } from "../../../../../../../../src/components/Selector/Selector";
import { useCurrentAgenda } from "../../../../../../../../src/context/actionLogDataHooks";
import {
  useAgendas,
  useCurrentTurn,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useNumFactions } from "../../../../../../../../src/context/factionDataHooks";
import {
  getActiveAgenda,
  getSelectedEligibleOutcomes,
  getSelectedSubAgenda,
  getSpeakerTieBreak,
} from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { outcomeString } from "../../../../../../../../src/util/strings";
import { computeVotes } from "../AgendaPhase";

const CovertLegislation = {
  RevealOutcomes,
  RevealAgenda,
};

export default CovertLegislation;

function RevealOutcomes() {
  const agendas = useAgendas();
  const currentAgenda = useCurrentAgenda();
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const intl = useIntl();
  const viewOnly = useViewOnly();

  if (currentAgenda !== "Covert Legislation") {
    return null;
  }

  const outcomes = new Set<OutcomeType>();
  Object.values(agendas).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);

  return (
    <Selector
      hoverMenuLabel={
        <FormattedMessage
          id="cKaLW8"
          description="Text on a hover menu for revealing eligible outcomes."
          defaultMessage="Reveal Eligible Outcomes"
        />
      }
      selectedLabel={
        <FormattedMessage
          id="+BcBcX"
          description="Label for a section showing the eligible outcomes."
          defaultMessage="Eligible Outcomes"
        />
      }
      options={Array.from(outcomes).map((outcome) => ({
        id: outcome,
        name: outcomeString(outcome, intl),
      }))}
      selectedItem={eligibleOutcomes}
      toggleItem={(outcome, add) => {
        if (add) {
          dataUpdate(Events.SelectEligibleOutcomesEvent(outcome));
        } else {
          dataUpdate(Events.SelectEligibleOutcomesEvent("None"));
        }
      }}
      viewOnly={viewOnly}
    />
  );
}

function RevealAgenda() {
  const agendas = useAgendas();
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const numFactions = useNumFactions();
  const viewOnly = useViewOnly();

  const activeAgenda = getActiveAgenda(currentTurn);

  if (activeAgenda !== "Covert Legislation") {
    return null;
  }
  const currentAgenda = agendas[activeAgenda];

  const representativeGovernmentPassed =
    agendas["Representative Government"]?.passed;

  const votes = computeVotes(
    currentAgenda,
    currentTurn,
    numFactions,
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

  if (selectedTargets.length !== 1) {
    const speakerTieBreak = getSpeakerTieBreak(currentTurn);
    if (!speakerTieBreak) {
      return null;
    }
  }

  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  const possibleSubAgendas = Object.values(agendas ?? {}).filter(
    (agenda) => agenda.elect === eligibleOutcomes,
  );
  const selectedSubAgenda = getSelectedSubAgenda(currentTurn);
  const subAgenda = selectedSubAgenda ? agendas[selectedSubAgenda] : undefined;

  return (
    <Selector
      style={{ maxWidth: "70vw" }}
      hoverMenuLabel={
        <FormattedMessage
          id="Agendas.Covert Legislation.Title"
          description="Title of Agenda Card: Covert Legislation"
          defaultMessage="Covert Legislation"
        />
      }
      options={possibleSubAgendas}
      selectedItem={subAgenda?.id}
      renderItem={(agendaId) => {
        const agenda = agendas[agendaId];
        if (!agenda) {
          return null;
        }
        return (
          <LabeledDiv
            label={
              <FormattedMessage
                id="Agendas.Covert Legislation.Title"
                description="Title of Agenda Card: Covert Legislation"
                defaultMessage="Covert Legislation"
              />
            }
          >
            <AgendaRow
              agenda={agenda}
              removeAgenda={() =>
                dataUpdate(Events.SelectSubAgendaEvent("None"))
              }
            />
          </LabeledDiv>
        );
      }}
      toggleItem={(agendaId, add) => {
        if (add) {
          dataUpdate(Events.SelectSubAgendaEvent(agendaId));
        } else {
          dataUpdate(Events.SelectSubAgendaEvent("None"));
        }
      }}
      viewOnly={viewOnly}
    />
  );
}
