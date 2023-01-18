import Image from 'next/image';
import { useRouter } from 'next/router'
import { useRef, useState } from "react";
import useSWR, { useSWRConfig } from 'swr'

import { AttachRow } from "/src/AttachRow.js";
import { Resources } from "/src/Resources.js";
import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";
import { fetcher } from './util/api/util';
import { SelectableRow } from './SelectableRow';
import { useSharedUpdateTimes } from './Updater';
import { responsiveNegativePixels, responsivePixels } from './util/util';
import { ResponsiveResources } from './Resources';
import { FullFactionSymbol } from './FactionCard';
import React from 'react';
import { getFactionColor } from './util/factions';

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
      return <FullFactionSymbol faction={faction} />
      return <FactionSymbol faction={faction} size={42} />;
    default:
      return null;
  }
}

export function FullPlanetSymbol({ type, faction, size }) {
  let image;
  switch (type) {
    case "Industrial":
      image = <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" layout="fill" objectFit='contain'/>;
      break;
    case "Cultural":
      image = <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" layout="fill" objectFit='contain'/>;
      break;
    case "Hazardous":
      image = <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" layout="fill" objectFit='contain'/>;
      break;
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
      return <div style={{position: "relative", width: responsivePixels(size), height: responsivePixels(size)}}>
          <FullFactionSymbol faction={faction} />
        </div>
    default:
      return null;
  }
  return <div style={{position: "relative", height: responsivePixels(size), width: responsivePixels(size)}}>
    {image}
  </div>
}

function LegendaryPlanetIcon() {
  return (
    <div style={{display: "flex", alignItems: "flex-start", borderRadius: responsivePixels(22), height: responsivePixels(16), width: responsivePixels(16), paddingTop: responsivePixels(2), paddingLeft: responsivePixels(2), boxShadow: "0px 0px 2px 1px purple", backgroundColor: "black"}}>
      <div style={{position: "relative", width: responsivePixels(14), height: responsivePixels(14)}}>
      <Image src="/images/legendary_planet.svg" alt="Legendary Planet Icon" layout="fill" objectFit='contain'/>
      </div>
    </div>);
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
        return <Image src="/images/red_tech.webp" alt="Red Tech Skip" layout="fill" objectFit='contain'/>;
      case "yellow-skip":
        return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" layout="fill" objectFit='contain'/>;
      case "blue-skip":
        return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" layout="fill" objectFit='contain'/>;
      case "green-skip":
        return <Image src="/images/green_tech.webp" alt="Green Tech Skip" layout="fill" objectFit='contain'/>;
      case "demilitarized":
        return <Image src="/images/demilitarized_zone.svg" alt="Demilitarized Zone" layout="fill" objectFit='contain'/>;
      case "tomb":
        return <Image src="/images/tomb_symbol.webp" alt="Tomb of Emphidia" layout="fill" objectFit='contain'/>;
      case "space-cannon":
        return <div style={{width: responsivePixels(36), height: responsivePixels(22)}}>✹✹✹</div>
      default:
        return null;
    }
  }
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     marginTop: "12px",
    //     height: responsivePixels(36),
    //     justifyContent: "space-evenly"
    //   }}
    // >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: responsivePixels(36),
          flexWrap: "wrap",
          gap: responsivePixels(4),
        }}
      >
        {attributes.map((attribute, index) => {
          return <div key={index} style={{width: responsivePixels(16), height: responsivePixels(16), position: "relative"}}>{getAttributeIcon(attribute)}</div>;
        })}
      </div>
    // </div>
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
    <div className="flexColumn" style={{boxSizing: "border-box", padding: responsivePixels(4), width: "100%"}}>
      {Object.entries(attachments).map(([name, attachment]) => {
        return <AttachRow key={name} attachment={attachment} currentPlanet={planet.name} />

        return (
          // <div key={name} className="flexRow" style={{whiteSpace: "nowrap", justifyContent: "flex-start", alignItems: "stretch", alignItems: "center", padding: `0 ${responsivePixels(4)}`}}>
            {/* <input onChange={() => toggleAttachment(name, attachment)} type="checkbox" checked={attachment.planets.includes(planet.name)}></input> */}
            // <AttachRow attachment={attachment} currentPlanet={planet.name} />
          // </div>
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
      if (planet.attachments.includes(attachment.name)) {
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

  let claimed = null;
  let claimedColor = null;
  (planet.owners ?? []).forEach((owner) => {
    if (opts.showSelfOwned || owner !== factionName) {
      if (claimed === null) {
        claimed = owner;
        // claimedColor = getFactionColor(factions[owner]);
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
        <div className="flexRow hiddenButtonParent" style={{width: "100%", alignItems: "center", justifyContent: "space-between", paddingTop: responsivePixels(4), boxSizing: "border-box"}}>
      {claimed ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: claimedColor === "Black" ? "#aaa" : claimedColor,
        borderRadius: responsivePixels(5),
        border: `${responsivePixels(1)} solid ${claimedColor}`,
        padding: `0 ${responsivePixels(4)}`,
        fontSize: responsivePixels(12),
        bottom: responsivePixels(0),
        left: responsivePixels(24),
      }}>Claimed by {claimed}</div> : null
      }
      <div style={{display: "flex", flexDirection: "row", flexBasis: "50%", alignItems: "center"}}>
        <div>{planet.name}</div>
        <div
          style={{
            position: "relative",
            top: responsiveNegativePixels(-4),
            marginLeft: responsiveNegativePixels(-12),
            opacity: "60%",
            height: responsivePixels(28),
            zIndex: -1,
          }}
        >
          <FullPlanetSymbol type={planet.type} faction={planet.faction} size={28} />
        </div>
      </div>
      {!opts.showAttachButton ? <div className="flexRow" style={{width: responsivePixels(62), paddingRight: responsivePixels(6)}}>
        {canAttach() ? <button style={{fontSize: responsivePixels(12)}} className="hiddenButton" onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
      </div> : null}
      <ResponsiveResources
        resources={planet.resources}
        influence={planet.influence}
      />
      <div
        style={{
          margin: `0 ${responsivePixels(4)} 0 ${responsivePixels(8)}`,
          width: responsivePixels(24)
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
            {opts.showAttachButton ? <div style={{width: responsivePixels(56)}}>
              {canAttach() ? <button onClick={() => displayAttachMenu(planet.name)}>Attach</button> : null}
            </div> : null}
          </div>
      : null}
      {/* {showAttachMenu ? */}
      <AttachMenu visible={showAttachMenu} planet={planet} attachments={availableAttachments()} closeMenu={displayAttachMenu} />
        </div>
      }  
    />
  );
}