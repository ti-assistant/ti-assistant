import { useState } from "react";

import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "./FactionCard";

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
      target = agenda.elect;
      break;
    case "Non-Home, Non-Mecatol Rex planet":
      target = "Non-Home Planet Other Than Mecatol Rex";
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

  return (
    <div className="agendaRow">
      <Modal closeMenu={() => setShowInfoModal(false)} visible={showInfoModal} title={<div className="flexColumn" style={{fontSize: "40px"}}>{agenda.name}<div style={{fontSize: "24px"}}>[{type}]</div></div>} content={
        <InfoContent agenda={agenda} />
      } top="35%" level={2} />
      <div className="flexRow" style={{ height: "30px"}}>
        {addAgenda ? 
          <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "darkgreen",
            cursor: "pointer",
            fontSize: "20px",
            zIndex: 100,
            marginRight: "8px",
          }}
          onClick={() => addAgenda(agenda.name)}
        >
          &#x2713;
        </div>
        : null}
        {removeAgenda ? 
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "darkred",
              cursor: "pointer",
              fontSize: "20px",
              zIndex: 100,
              marginRight: "8px",
            }}
            onClick={() => removeAgenda(agenda.name)}
          >
            &#x2715;
          </div>
        : null}
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flexBasis: "50%", flexGrow: 2}}>
          <div style={{ display: "flex", fontSize: "18px", zIndex: 2}}>
            {agenda.name}
          </div>
          <div className="popupIcon" onClick={displayInfo}>&#x24D8;</div>
          {agenda.target && agenda.target !== "For" ?
            <div style={{paddingLeft: "8px"}}>[{agenda.target}]</div>
          : null}
        </div>
      </div>
    </div>);
}