import { useContext, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { SelectableRow } from "./SelectableRow";
import Modal from "./components/Modal/Modal";
import { translateOutcome } from "./components/VoteBlock/VoteBlock";
import {
  AgendaContext,
  FactionContext,
  ObjectiveContext,
  PlanetContext,
  StrategyCardContext,
} from "./context/Context";
import { agendaTypeString, outcomeString } from "./util/strings";

function InfoContent({ agenda }: { agenda: Agenda }) {
  const intl = useIntl();

  const description = agenda.description.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
      }}
    >
      <div className="flexColumn">
        {agenda.elect !== "For/Against" ? (
          <div style={{ padding: "12px", fontFamily: "Slider" }}>
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
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const strategyCards = useContext(StrategyCardContext);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const intl = useIntl();

  function displayInfo() {
    setShowInfoModal(true);
  }

  const textColor = agenda.resolved ? "#777" : "#eee";

  return (
    <SelectableRow itemId={agenda.id} removeItem={removeAgenda}>
      <div>
        <Modal
          closeMenu={() => setShowInfoModal(false)}
          visible={showInfoModal}
          title={
            <div className="flexColumn" style={{ fontSize: "40px" }}>
              {agenda.name}
              <div style={{ fontSize: "24px" }}>
                [{agendaTypeString(agenda.type, intl)}]
              </div>
            </div>
          }
          level={2}
        >
          <InfoContent agenda={agenda} />
        </Modal>
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
            onClick={displayInfo}
            style={{ fontSize: "16px" }}
          >
            &#x24D8;
          </div>
        </div>
      </div>
    </SelectableRow>
  );
}
