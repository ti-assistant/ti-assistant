import Image from 'next/image';
import { useRouter } from 'next/router'
import { useRef, useState } from "react";
import useSWR, { useSWRConfig } from 'swr'

import { AttachRow } from "/src/AttachRow.js";
import { Resources } from "/src/Resources.js";
import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";
import { attachToPlanet, removeFromPlanet } from './util/api/attachments';
import { fetcher } from './util/api/util';
import { SelectableRow } from './SelectableRow';
import { useSharedUpdateTimes } from './Updater';

export function PlanetSymbol({ type, faction, size="36px" }) {
  switch (type) {
    case "Industrial":
      return <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" width={size} height={size} />;
    case "Cultural":
      return <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" width={size} height={size} />;
    case "Hazardous":
      return <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" width={size} height={size} />;
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
    <div style={{display: "flex", alignItems: "flex-start", borderRadius: "22px", height: "18px", width: "18px", paddingTop: "3px", paddingLeft: "3px", boxShadow: "0px 0px 2px 1px purple", backgroundColor: "black"}}>
      <Image src="/images/legendary_planet.svg" alt="Legendary Planet Icon" width="15px" height="15px" />
    </div>);
}

function getFactionColor(color) {
  if (!color) {
    return "#555";
  }
  switch (color) {
    case "Blue":
      return "cornflowerblue";
    // case "Magenta":
    //   return "hotpink";
    // case "Green":
    //   return "mediumseagreen";
  }
  return color;
}

export function PlanetAttributes({ attributes }) {
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
          flexWrap: "wrap",
        }}
      >
        {attributes.map((attribute, index) => {
          return <div key={index}>{getAttributeIcon(attribute)}</div>;
        })}
      </div>
    </div>
  )
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
          return <div key={index}>{getAttributeIcon(attribute)}</div>;
        })}
      </div>
      {attributes.length > 2 ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          {attributes.map((attribute, index) => {
            if (index < 2) {
              return null;
            }
            return <div key={index}>{getAttributeIcon(attribute)}</div>;
          })}
        </div>
      ) : null}
    </div>
  );
}

function AttachMenu({planet, attachments, visible, closeMenu}) {
  return (<Modal closeMenu={closeMenu} visible={visible} level={2} title={"Attachments for " + planet.name}
    content={
    <div>
      {Object.entries(attachments).map(([name, attachment]) => {
        return (
          <div key={name} className="flexRow" style={{minWidth: "280px", whiteSpace: "nowrap", justifyContent: "flex-start", alignItems: "stretch", alignItems: "center", padding: "0px 4px"}}>
            {/* <input onChange={() => toggleAttachment(name, attachment)} type="checkbox" checked={attachment.planets.includes(planet.name)}></input> */}
            <AttachRow attachment={attachment} currentPlanet={planet.name} />
          </div>
        );
      })}
    </div>
  } />);
}

export function PlanetRow({planet, factionName, updatePlanet, removePlanet, addPlanet, opts={}}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: options, error: optionsError } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  


  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (factionsError) {
    return (<div>Failed to load game state</div>);
  }
  if (!attachments || !factions) {
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
      if (attachment.planets.includes(planet.name)) {
        return true;
      }
      if (attachment.name === "Terraform" && factionName === "Titans of Ul") {
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
    if (attachments[name].planets.includes(planet.name)) {
      removeFromPlanet(mutate, gameid, attachments, planet.name, name);
    } else {
      attachToPlanet(mutate, gameid, attachments, planet.name, name, options);
    }
  }

  let claimed = null;
  let claimedColor = null;
  (planet.owners ?? []).forEach((owner) => {
    if (opts.showSelfOwned || owner !== factionName) {
      if (claimed === null) {
        claimed = owner;
        claimedColor = getFactionColor(factions[owner]);
      } else {
        claimed = "Multiple Players";
        claimedColor = "darkred";
      }
    }
  });

  return (
    <SelectableRow
      itemName={planet.name}
      selectItem={addPlanet}
      removeItem={removePlanet} 
      content={
        <div className="flexRow hoverParent" style={{width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      {claimed ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: claimedColor === "Black" ? "#aaa" : claimedColor,
        borderRadius: "5px",
        border: `1px solid ${claimedColor}`,
        padding: "0px 4px",
        fontSize: "12px",
        bottom: "4px",
        left: "0",
      }}>Claimed by {claimed}</div> : null
      }
      <div style={{display: "flex", flexDirection: "row", flexBasis: "50%", flexGrow: 2, alignItems: "center"}}>
        <div style={{zIndex: 1}}>{planet.name}</div>
        <div
          style={{
            position: "relative",
            top: "-9px",
            marginLeft: "-16px",
            opacity: "70%",
            height: "36px",
            zIndex: 0,
          }}
        >
          <PlanetSymbol type={planet.type} faction={planet.faction} />
        </div>
      </div>
      {!opts.showAttachButton ? <div className="flexRow" style={{width: "62px", paddingRight: "6px"}}>
        {canAttach() ? <button className="hiddenButton" onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
      </div> : null}
      <Resources
        resources={planet.resources}
        influence={planet.influence}
      />
      <div
        style={{
          margin: "0px 4px 0px 8px",
          width: "52px"
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
            {/* <button onClick={() => togglePlanet(planet.name)}>
                {planet.ready ? "Exhaust" : "Ready"}
            </button> */}
            {opts.showAttachButton ? <div style={{width: "56px"}}>
              {canAttach() ? <button onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
            </div> : null}
          </div>
      : null}
      {/* {showAttachMenu ? */}
      <AttachMenu visible={showAttachMenu} planet={planet} attachments={availableAttachments()} toggleAttachment={toggleAttachment} closeMenu={displayAttachMenu} />
        </div>
      }  
    />
  );
}