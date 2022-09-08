import Image from 'next/image';
import { useState } from "react";
import useSWR from 'swr'

import { AttachRow } from "/src/AttachRow.js";
import { Resources } from "/src/Resources.js";
import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  console.log(data);
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

function PlanetSymbol({ type, faction }) {
switch (type) {
    case "Industrial":
      return <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" width="36px" height="36px" />;
    case "Cultural":
      return <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" width="36px" height="36px" />;
    case "Hazardous":
      return <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" width="36px" height="36px" />;
    case "all":
      return <div style={{marginLeft: "8px", width:"36px", height: "36px"}}>
        <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" width="18px" height="18px" />
        <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" width="18px" height="18px" />
        <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" width="18px" height="18px" />
      </div>;
    case "none":
      if (faction === undefined) {
        return null;
      }
      return <FactionSymbol faction={faction} size={42} />;
    default:
      return null;
  }
}

function LegendaryPlanetIcon() {
  return (
    <div style={{borderRadius: "22px", height: "18px", width: "18px", paddingTop: "3px", paddingLeft: "3px", boxShadow: "0px 0px 2px 1px purple", backgroundColor: "black"}}>
      <Image src="/images/legendary_planet.svg" alt="Legendary Planet Icon" width="15px" height="15px" />
    </div>);
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

function AttachMenu({planet, attachments, toggleAttachment, closeMenu}) {
  return (<Modal closeMenu={closeMenu} visible={true} title="Attachments"
    content={
    <div>
      {Object.entries(attachments).map(([name, attachment]) => {
        return (
          
          <div key={name} className="flexRow" style={{justifyContent: "flex-start", alignItems: "center"}}>
            <input onChange={() => toggleAttachment(name, attachment)} type="checkbox" checked={planet.attachments.includes(name)}></input>
            <AttachRow attachment={attachment} />
          </div>
        );
      })}
    </div>
  } />);
}

export function PlanetRow({planet, updatePlanet, removePlanet, addPlanet}) {
  const { data: attachments, error: attachmentsError } = useSWR("/api/attachments", fetcher);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (!attachments) {
    return (<div>Loading...</div>);
  }

  function canAttach() {
    return Object.keys(availableAttachments()).length !== 0;
  }
  
  function availableAttachments() {
    if (planet.name === "Mecatol Rex") {
      return {};
    }
    let available = Object.keys(attachments).filter((name) => {
      if (planet.attachments.includes(name)) {
        return true;
      }
      const attachment = attachments[name];
      if (attachment.required.type !== undefined) {
        if (attachment.required.type !== planet.type && planet.type !== "all") {
          return false;
        }
      }
      if (attachment.required.name !== undefined) {
        if (attachment.required.name !== planet.name) {
          return false;
        }
      }
      if (attachment.required.home !== undefined) {
        if (attachment.required.home !== planet.home) {
          return false;
        }
      }
      if (attachment.required.legendary !== undefined) {
        if (attachment.required.legendary !== planet.attributes.includes("legendary")) {
          return false;
        }
      }
      return true;
    }).reduce((result, name) => {
      return {
        ...result,
        [name]: attachments[name],
      };
    }, {});
    return available;
  }

  function displayAttachMenu() {
    setShowAttachMenu(!showAttachMenu);
  }

  function togglePlanet() {
    updatePlanet(planet.name, {
      ...planet,
      isReady: !planet.isReady,
    });
  }

  function toggleAttachment(name) {
    let attaches = planet.attachments;
    const index = attaches.indexOf(name);
    if (index === -1) {
      attaches.push(name);
    } else {
      attaches.splice(index, 1);
    }
    updatePlanet(planet.name, {
      ...planet,
      attachments: attaches,
    });
  }

  return (
    <div className={`planetRow ${!planet.isReady ? "exhausted" : ""}`}>
      {showAttachMenu ?
        <AttachMenu planet={planet} attachments={availableAttachments()} toggleAttachment={toggleAttachment} closeMenu={displayAttachMenu} /> : null}
      {addPlanet !== undefined ? 
        <div
        style={{
          position: "relative",
          top: "32px",
          lineHeight: "20px",
          color: "darkgreen",
          cursor: "pointer",
          fontSize: "20px",
          zIndex: 100,
          marginRight: "8px",
          height: "20px",
        }}
        onClick={() => addPlanet(planet.name)}
      >
        &#x2713;
      </div>
      : null}
      {removePlanet !== undefined ? 
        <div
          style={{
            position: "relative",
            top: "32px",
            lineHeight: "20px",
            color: "darkred",
            cursor: "pointer",
            fontSize: "20px",
            zIndex: 100,
            marginRight: "8px",
            height: "20px",
          }}
          onClick={() => removePlanet(planet.name)}
        >
          &#x2715;
        </div>
      : null}
      <div style={{display: "flex", flexDirection: "row", flexBasis: "50%", flexGrow: 2}}>
        <div style={{ display: "flex", alignItems: "end", paddingBottom: "14px", fontSize: "24px", zIndex: 2}}>
          {planet.name}
        </div>
        <div
          style={{
            position: "relative",
            top: "18px",
            marginLeft: "-16px",
            opacity: "70%",
            height: "36px",
            zIndex: 1,
          }}
        >
          <PlanetSymbol type={planet.type} faction={planet.faction} />
        </div>
      </div>
      <Resources
        resources={planet.resources}
        influence={planet.influence}
      />
      <div
        style={{
          marginRight: "10px",
          width: "48px"
        }}
      >
        <PlanetAttributes attributes={planet.attributes} />
      </div>
      {updatePlanet !== undefined ? 
      <div className="flexColumn">
        <button onClick={() => togglePlanet(planet.name)}>
            {planet.isReady ? "Exhaust" : "Ready"}
        </button>
        {canAttach() ? <button onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
      </div>
      : null}
    </div>);
}