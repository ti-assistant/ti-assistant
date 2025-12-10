import { AgendaRow } from "../../../../../../../src/AgendaRow";
import {
  useAgendas,
  useCurrentTurn,
} from "../../../../../../../src/context/dataHooks";
import { getLogEntries } from "../../../../../../../src/util/actionLog";
import { rem } from "../../../../../../../src/util/util";
import AfterAnAgendaIsRevealed from "../../agenda/components/AfterAnAgendaIsRevealed";
import AgendaSelect from "../../agenda/components/AgendaSelect";
import { CastVotesSection } from "../../agenda/components/CastVotesSection";
import CovertLegislation from "../../agenda/components/CovertLegislation";
import StartVoting from "../../agenda/components/StartVoting";
import VotingColumn from "../../agenda/components/VotingColumn";
import WhenAnAgendaIsRevealed from "../../agenda/components/WhenAnAgendaIsRevealed";

const ExecutiveOrder = {
  Content,
  Label,
};

export default ExecutiveOrder;

function Label() {
  const currentTurn = useCurrentTurn();

  const resolvedAgenda = getLogEntries<ResolveAgendaData>(
    currentTurn,
    "RESOLVE_AGENDA"
  );

  if (resolvedAgenda.length > 0) {
    return "Resolved Agenda";
  }

  return (
    <span style={{ color: "var(--foreground-color)" }}>
      <AgendaSelect fontSize={rem(14)} />
    </span>
  );
}

function Content({ factionId }: { factionId: FactionId }) {
  const agendas = useAgendas();
  const currentTurn = useCurrentTurn();

  const resolvedAgenda = getLogEntries<ResolveAgendaData>(
    currentTurn,
    "RESOLVE_AGENDA"
  );

  if (resolvedAgenda.length > 0) {
    const agendaId = resolvedAgenda[0]?.data.event.agenda;
    const agenda = agendaId ? agendas[agendaId] : null;
    if (!agenda) {
      return null;
    }
    return <AgendaRow agenda={agenda} />;
  }

  return (
    <div className="flexColumn" style={{ paddingTop: rem(8), width: "100%" }}>
      <div className="flexColumn" style={{ alignItems: "flex-start" }}>
        <CovertLegislation.RevealOutcomes />
        <WhenAnAgendaIsRevealed speaker={factionId} />
        <AfterAnAgendaIsRevealed />
        <StartVoting />
      </div>
      <VotingColumn speaker={factionId} manualVotes />
      <CastVotesSection />
    </div>
  );
}
