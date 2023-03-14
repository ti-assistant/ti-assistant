import { useState } from "react";

import { Modal } from "./Modal";
import { SelectableRow } from "./SelectableRow";
import { Agenda } from "./util/api/agendas";
import { responsivePixels } from "./util/util";

function InfoContent({ agenda }: { agenda: Agenda }) {
  let target = null;
  switch (agenda.elect) {
    case "Planet":
      target = "Any Planet";
      break;
    case "Cultural Planet":
    case "Hazardous Planet":
    case "Industrial Planet":
    case "Player":
    case "Strategy Card":
    case "Law":
    case "Scored Secret Objective":
    case "Non-Home Planet Other Than Mecatol Rex":
      target = agenda.elect;
      break;
  }
  const description = agenda.description.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: "320px",
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      <div className="flexColumn">
        {target ? (
          <div style={{ padding: responsivePixels(12), fontFamily: "Slider" }}>
            Elect {target}
          </div>
        ) : null}
        {description}
      </div>
    </div>
  );
}

export interface AgendaRowProps {
  agenda: Agenda;
  addAgenda?: (agendaName: string) => void;
  removeAgenda?: (agendaName: string) => void;
}

export function AgendaRow({ agenda, addAgenda, removeAgenda }: AgendaRowProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  const textColor = addAgenda && agenda.resolved ? "#777" : "#eee";

  return (
    <SelectableRow
      itemName={agenda.name}
      selectItem={addAgenda}
      removeItem={removeAgenda}
    >
      <div>
        <Modal
          closeMenu={() => setShowInfoModal(false)}
          visible={showInfoModal}
          title={
            <div
              className="flexColumn"
              style={{ fontSize: responsivePixels(40) }}
            >
              {agenda.name}
              <div style={{ fontSize: "24px" }}>[{agenda.type}]</div>
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
            {agenda.target ? <div>[{agenda.target}]</div> : null}
          </div>
          <div
            className="popupIcon"
            onClick={displayInfo}
            style={{ fontSize: responsivePixels(16) }}
          >
            &#x24D8;
          </div>
        </div>
      </div>
    </SelectableRow>
  );
}
