import { useState } from "react";
import Image from 'next/image';

import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "./FactionCard";
import { responsivePixels } from "./util/util";

function TechIcon({ type, width, height }) {
  switch (type) {
    case "red":
      return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width={width} height={height} />;
    case "yellow":
      return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width={width} height={height} />;
    case "blue":
      return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
    case "green":
      return <Image src="/images/green_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
  }
  return type;
}

function PlanetAttributes({ attributes }) {
  if (attributes.length === 0) {
    return null;
  }
  function getAttributeIcon(attribute) {
    switch (attribute) {
      case "legendary":
        return <LegendaryPlanetIcon />;
      case "red-skip":
        return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width="22px" height="22px" />;
      case "yellow-skip":
        return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width="22px" height="22px" />;
      case "blue-skip":
        return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width="22px" height="22px" />;
      case "green-skip":
        return <Image src="/images/green_tech.webp" alt="Blue Tech Skip" width="22px" height="22px" />;
      case "demilitarized":
        return <Image src="/images/demilitarized_zone.svg" alt="Demilitarized Zone" width="22px" height="22px" />;
      case "tomb":
        return <Image src="/images/tomb_symbol.webp" alt="Tomb of Emphidia" width="22px" height="22px" />;
      case "space-cannon":
        return <div style={{width: "22px", height: "22px"}}>✹✹✹</div>
      default:
        return null;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "12px",
        height: "48px",
        justifyContent: "space-evenly"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "48px",
        }}
      >
        {attributes.map((attribute, index) => {
          if (index >= 2) {
            return null;
          }
          return <div key={attribute}>{getAttributeIcon(attribute)}</div>;
        })}
      </div>
      {attributes.length > 2 ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          {attributes.map((attribute, index) => {
            if (index < 2) {
              return null;
            }
            return <div key={attribute}>{getAttributeIcon(attribute)}</div>;
          })}
        </div>
      ) : null}
    </div>
  );
}

function InfoContent({objective}) {
  return (
    <div className="myriadPro" style={{boxSizing: "border-box", maxWidth: "800px", width: "100%", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "32px"}}>
      {objective.description}
    </div>
  );
}

export function ObjectiveRow({faction, objective, addObjective, removeObjective, scoreObjective, viewing, hideScorers}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  if (!objective) {
    return null;
  }

  function displayInfo() {
    setShowInfoModal(true);
  }

  function canScore() {
    if (!scoreObjective || viewing || !faction) {
      return false;
    }
    if (objective.max && (objective.scorers ?? []).length === objective.max) {
      return false;
    }
    return (!(objective.scorers ?? []).includes(faction) || objective.repeatable);
  }

  return (
    <div className="objectiveRow">
      <Modal closeMenu={() => setShowInfoModal(false)} visible={showInfoModal} title={<div style={{fontSize: "40px"}}>{objective.name}</div>} content={
        <InfoContent objective={objective} />
      } top="35%" level={2} />
      <div className="flexRow hoverParent" style={{ height: "38px"}}>
        <div style={{width: responsivePixels(36)}}>
        {addObjective ? 
          <div
          className=""
          style={{
            alignItems: "center",
            fontSize: responsivePixels(32),
            lineHeight: responsivePixels(32),
            color: "darkgreen",
            cursor: "pointer",
            zIndex: 100,
            marginRight: responsivePixels(8),
            height: responsivePixels(32),
          }}
          onClick={() => addObjective(objective.name)}
        >
          &#x2713;
        </div>
        : null}
        {removeObjective ? 
          <div
            className=""
            style={{
              alignItems: "center",
              fontSize: responsivePixels(32),
              lineHeight: responsivePixels(32),
              color: "darkred",
              cursor: "pointer",
              zIndex: 100,
              marginRight: responsivePixels(8),
              height: responsivePixels(32),
            }}
            onClick={() => removeObjective(objective.name)}
          >
            &#x2715;
          </div>
        : null}
        </div>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flexBasis: "50%", flexGrow: 2}}>
          <div style={{ display: "flex", flex: "2 0 50%", fontSize: responsivePixels(19)}}>
            {objective.name}
          </div>
          <div className="popupIcon" style={{paddingRight: responsivePixels(8)}} onClick={displayInfo}>&#x24D8;</div>
        </div>
        <div className="flexColumn">
          {canScore() ? <button onClick={() => scoreObjective(objective.name, true)}>Score</button> : null}
        </div>
      </div>
      {hideScorers ? null : <div className="flexRow" style={{justifyContent: "flex-start"}}>
        {(objective.scorers ?? []).map((scorer, index) => {
          if (scorer === faction) {
            return (
              <div key={`${scorer}-${index}`} className="flexRow" style={{position: "relative", width: responsivePixels(45)}}>
                <div style={{cursor: "pointer", width: responsivePixels(16), fontSize: responsivePixels(8), lineHeight: responsivePixels(8), height: responsivePixels(16), top: "0px", left: responsivePixels(28), position: "absolute", zIndex: 40, backgroundColor: "#222", color: "red", display: "flex", alignItems: "center", fontWeight: "bold", justifyContent: "center", borderRadius: "12px", boxShadow: "1px 1px 4px black"}} onClick={() => scoreObjective(objective.name, false)}>
                  &#x2715;
                </div>
                <FactionSymbol faction={scorer} size={42} />
              </div>
            );
          }
          return <div key={`${scorer}-${index}`} className="flexRow" style={{width: "45px"}}>
            <FactionSymbol faction={scorer} size={42} />
          </div>
        })}
      </div>}
    </div>);
}