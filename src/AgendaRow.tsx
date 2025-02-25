import { FormattedMessage, useIntl } from "react-intl";
import { SelectableRow } from "./SelectableRow";
import { ModalContent } from "./components/Modal/Modal";
import { translateOutcome } from "./components/VoteBlock/VoteBlock";
import {
  useAgendas,
  useFactions,
  useObjectives,
  usePlanets,
  useStrategyCards,
} from "./context/dataHooks";
import { useSharedModal } from "./data/SharedModal";
import { agendaTypeString, outcomeString } from "./util/strings";
import { rem } from "./util/util";

function InfoContent({ agenda }: { agenda: Agenda }) {
  const intl = useIntl();

  const description = agenda.description.replaceAll("\\n", "\n");
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
      <div className="flexColumn">
        {agenda.elect !== "For/Against" ? (
          <div style={{ padding: rem(12), fontFamily: "Slider" }}>
            <FormattedMessage
              id="EAsvAe"
              defaultMessage="Elect {outcomeType}"
              description="Text explaining what players should be voting for."
              values={{ outcomeType: outcomeString(agenda.elect, intl) }}
            />
          </div>
        ) : null}
        {description}
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

  const { openModal } = useSharedModal();

  const intl = useIntl();

  const textColor = "#eee";

  return (
    <SelectableRow itemId={agenda.id} removeItem={removeAgenda}>
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
