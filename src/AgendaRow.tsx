import { use } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import FormattedDescription from "./components/FormattedDescription/FormattedDescription";
import { ModalContent } from "./components/Modal/Modal";
import { translateOutcome } from "./components/VoteBlock/VoteBlock";
import { ModalContext } from "./context/contexts";
import {
  useAgendas,
  usePlanets,
  useStrategyCards,
  useViewOnly,
} from "./context/dataHooks";
import { useFactions } from "./context/factionDataHooks";
import { useObjectives } from "./context/objectiveDataHooks";
import { SelectableRow } from "./SelectableRow";
import { agendaTypeString, outcomeString } from "./util/strings";
import { rem } from "./util/util";

function InfoContent({ agenda }: { agenda: Agenda }) {
  const intl = useIntl();

  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: rem(320),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <div className="flexColumn" style={{ gap: rem(32) }}>
        {agenda.elect !== "For/Against" ? (
          <div style={{ paddingTop: rem(12), fontFamily: "Slider" }}>
            <FormattedMessage
              id="EAsvAe"
              defaultMessage="Elect {outcomeType}"
              description="Text explaining what players should be voting for."
              values={{ outcomeType: outcomeString(agenda.elect, intl) }}
            />
          </div>
        ) : null}
        <FormattedDescription description={agenda.description} />
      </div>
    </div>
  );
}

interface AgendaRowProps {
  agenda: Agenda;
  removeAgenda?: (agendaId: AgendaId) => void;
  hideOutcome?: boolean;
}

export function AgendaRow({
  agenda,
  removeAgenda,
  hideOutcome,
}: AgendaRowProps) {
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const { openModal } = use(ModalContext);

  const intl = useIntl();

  const textColor = "#eee";

  return (
    <SelectableRow
      itemId={agenda.id}
      removeItem={removeAgenda}
      viewOnly={viewOnly}
    >
      <div>
        <div className="flexRow">
          <div
            className="flexColumn"
            style={{
              color: textColor,
              alignItems: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            <div>{agenda.name}</div>
            {agenda.target && !hideOutcome ? (
              <div>
                [
                {translateOutcome(
                  agenda.target,
                  agenda.elect,
                  planets,
                  factions,
                  objectives,
                  agendas,
                  strategyCards,
                  intl
                )}
                ]
              </div>
            ) : null}
          </div>
          <div
            className="popupIcon"
            onClick={() =>
              openModal(
                <ModalContent
                  title={
                    <div className="flexColumn" style={{ fontSize: rem(40) }}>
                      {agenda.name}
                      <div style={{ fontSize: rem(24) }}>
                        [{agendaTypeString(agenda.type, intl)}]
                      </div>
                    </div>
                  }
                >
                  <InfoContent agenda={agenda} />
                </ModalContent>
              )
            }
            style={{ fontSize: rem(16) }}
          >
            &#x24D8;
          </div>
        </div>
      </div>
    </SelectableRow>
  );
}
