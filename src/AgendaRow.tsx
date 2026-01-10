import { FormattedMessage, useIntl } from "react-intl";
import FormattedDescription from "./components/FormattedDescription/FormattedDescription";
import { useOutcome } from "./context/agendaDataHooks";
import { useViewOnly } from "./context/dataHooks";
import { InfoRow } from "./InfoRow";
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
  const viewOnly = useViewOnly();
  const intl = useIntl();

  const outcome = useOutcome(agenda.id, intl);

  const textColor = "#eee";

  return (
    <SelectableRow
      itemId={agenda.id}
      removeItem={removeAgenda}
      viewOnly={viewOnly}
    >
      <InfoRow
        infoTitle={
          <div className="flexColumn" style={{ fontSize: rem(40) }}>
            {agenda.name}
            <div style={{ fontSize: rem(24) }}>
              [{agendaTypeString(agenda.type, intl)}]
            </div>
          </div>
        }
        infoContent={<InfoContent agenda={agenda} />}
      >
        <div
          className="flexColumn"
          style={{
            color: textColor,
            alignItems: "flex-start",
            whiteSpace: "nowrap",
          }}
        >
          <div>{agenda.name}</div>
          {agenda.target && !hideOutcome ? <div>[{outcome}]</div> : null}
        </div>
      </InfoRow>
    </SelectableRow>
  );
}
