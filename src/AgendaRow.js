import { useState } from "react";

import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "./FactionCard";
import { SelectableRow } from "./SelectableRow";

function InfoContent({agenda}) {
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
    <div className="myriadPro" style={{maxWidth: "800px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "32px"}}>
      <div className="flexColumn">
        {target ? <div style={{padding: "12px", fontFamily: "Slider"}}>Elect  {target}</div> : null}
        {description}
      </div>
    </div>
  );
}

export function AgendaRow({agenda, addAgenda, removeAgenda}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }
  
  const type = agenda.type === "law" ? "LAW" : "DIRECTIVE";

  const textColor = addAgenda && agenda.resolved ? "#777" : "#eee";

  return (
    <SelectableRow
      itemName={agenda.name}
      selectItem={addAgenda}
      removeItem={removeAgenda} 
      content={
        <div>
          <Modal closeMenu={() => setShowInfoModal(false)} visible={showInfoModal} title={<div className="flexColumn" style={{fontSize: "40px"}}>{agenda.name}<div style={{fontSize: "24px"}}>[{type}]</div></div>} content={
            <InfoContent agenda={agenda} />
          } top="35%" level={2} />
          <div className="flexRow" style={{gap: "4px", height: "50px"}}>
            <div className="flexColumn" style={{fontSize: "20px", color: textColor, gap: "4px", alignItems: "flex-start"}}>
              <div>{agenda.name}</div>
              {agenda.target ?
                <div>[{agenda.target}]</div>
              : null}
            </div>
            <div className="popupIcon" onClick={displayInfo}>&#x24D8;</div>
          </div>
        </div>
    } />);
}