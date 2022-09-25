import Image from 'next/image';
import { useRouter } from 'next/router'
import { useState } from "react";
import useSWR, { useSWRConfig } from 'swr'

import { AttachRow } from "/src/AttachRow.js";
import { Resources } from "/src/Resources.js";
import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";
import { attachToPlanet, removeFromPlanet } from './util/api/attachments';

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

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
        return <Image src="/images/green_tech.webp" alt="Green Tech Skip" width="22px" height="22px" />;
      case "demilitarized":
        return <Image src="/images/demilitarized_zone.svg" alt="Demilitarized Zone" width="22px" height="22px" />;
      case "tomb":
        return <Image src="/images/tomb_symbol.webp" alt="Tomb of Emphidia" width="22px" height="22px" />;
      case "space-cannon":
        return <div style={{width: "44px", height: "22px"}}>✹✹✹</div>
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
            <input onChange={() => toggleAttachment(name, attachment)} type="checkbox" checked={attachment.planet === planet.name}></input>
            <AttachRow attachment={attachment} />
          </div>
        );
      })}
    </div>
  } />);
}

function ExhaustIcon({ ready, clickFn }) {
  const content = ready ? "↶" : "↷";
  return (
    <div onClick={clickFn} className="flexRow" style={{height: "32px", width: "32px", fontSize:"32px", border: "1px solid black", borderRadius: "20px", boxShadow: "0px 0px 5px 1px black"}}>
      {content}
    </div>
  );
}

function AttachIcon({ clickFn }) {
  return (
    <div onClick={clickFn} className="flexRow" style={{height: "32px", width: "32px", fontSize: "32px", border: "1px solid black", borderRadius: "16px", boxShadow: "0px 0px 5px 1px black"}}>

    </div>
  );
}

export function PlanetRow({planet, updatePlanet, removePlanet, addPlanet, opts={}}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: gameState, error: gameStateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (gameStateError) {
    return (<div>Failed to load game stae</div>);
  }
  if (!attachments || !gameState) {
    return (<div>Loading...</div>);
  }

  function canAttach() {
    return Object.keys(availableAttachments()).length !== 0;
  }
  
  function availableAttachments() {
    if (planet.name === "Mecatol Rex") {
      return {};
    }
    let available = Object.values(attachments).filter((attachment) => {
      // If attached to this planet, always show.
      if (attachment.planet === planet.name) {
        return true;
      }
      // If attached to a different planet, never show.
      if (attachment.planet) {
        return false;
      }
      if (attachment.name === "Terraform" && playerFaction.name === "Titans of Ul") {
        return false;
      }
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
    }).reduce((result, attachment) => {
      return {
        ...result,
        [attachment.name]: attachment,
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
      ready: !planet.ready,
    });
  }

  function toggleAttachment(name) {
    if (attachments[name].planet === planet.name) {
      removeFromPlanet(mutate, gameid, attachments, name);
    } else {
      attachToPlanet(mutate, gameid, attachments, planet.name, name);
    }
  }

  let claimed = null;
  let claimedColor = null;
  (planet.owners ?? []).forEach((owner) => {
    if (opts.showSelfOwned || owner !== playerFaction) {
      if (claimed === null) {
        claimed = owner;
        claimedColor = gameState.factions[owner].color.toLowerCase();
      } else {
        claimed = "Multiple Players";
        claimedColor = "darkred";
      }
    }
  });

  return (
    <div className={`planetRow ${!planet.ready ? "exhausted" : ""}`}>
      {showAttachMenu ?
        <AttachMenu planet={planet} attachments={availableAttachments()} toggleAttachment={toggleAttachment} closeMenu={displayAttachMenu} /> : null}
      {addPlanet !== undefined ? 
        <div
        style={{
          position: "relative",
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
      {claimed ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: claimedColor,
        borderRadius: "5px",
        border: `1px solid ${claimedColor}`,
        padding: "0px 4px",
        fontSize: "12px",
        bottom: "4px",
        left: (addPlanet || removePlanet) ? "28px" : "0"
      }}>Claimed by {claimed}</div> : null
      }
      <div style={{display: "flex", flexDirection: "row", flexBasis: "50%", flexGrow: 2, alignItems: "center"}}>
        <div style={{fontSize: "24px", zIndex: 2}}>
          {planet.name}
        </div>
        <div
          style={{
            position: "relative",
            top: "-9px",
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
          margin: "0px 4px 0px 8px",
          width: "48px"
        }}
      >
        <PlanetAttributes attributes={planet.attributes ?? []} />
      </div>
      {/* {updatePlanet !== undefined ? 
        <div className="flexRow">
          <ExhaustIcon ready={planet.ready} clickFn={() => togglePlanet(planet.name)} />
        </div>
      : null} */}
      {updatePlanet !== undefined ?
          <div className="flexColumn" style={{height: "100%"}}>
            <button onClick={() => togglePlanet(planet.name)}>
                {planet.ready ? "Exhaust" : "Ready"}
            </button>
            {canAttach() ? <button onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
          </div>
      : null}
    </div>);
}