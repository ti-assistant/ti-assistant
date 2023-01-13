import { useState } from "react";
import Image from 'next/image';

import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";
import { SelectableRow } from "./SelectableRow";
import { getTechColor } from "./util/techs";
import { responsiveNegativePixels, responsivePixels } from "./util/util";
import { FullFactionSymbol } from "./FactionCard";

export function TechIcon({ type, width, height }) {
  switch (type) {
    case "red":
      return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width={width} height={height} />;
    case "yellow":
      return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width={width} height={height} />;
    case "blue":
      return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
    case "green":
      return <Image src="/images/green_tech.webp" alt="Green Tech Skip" width={width} height={height} />;
  }
  return type;
}

export function WrappedTechIcon({ type, size }) {
  const width = responsivePixels(size - 1);
  const height = responsivePixels(size);
  return <div style={{position: "relative", width: width, height: height}}>
    <FullTechIcon type={type} />
  </div>
}

export function FullTechIcon({ type }) {
  switch (type) {
    case "red":
      return <Image src="/images/red_tech.webp" alt="Red Tech" layout="fill" objectFit='contain'/>;
    case "yellow":
      return <Image src="/images/yellow_tech.webp" alt="Yellow Tech" layout="fill" objectFit='contain'/>;
    case "blue":
      return <Image src="/images/blue_tech.webp" alt="Blue Tech" layout="fill" objectFit='contain'/>;
    case "green":
      return <Image src="/images/green_tech.webp" alt="Green Tech" layout="fill" objectFit='contain'/>;
  }
  return null;
  return type;
}

function UnitStat({name, stat}) {
  return (
    <div style={{flex: "0 0 25%", boxSizing: "border-box", border: "1px solid #eee", borderRadius: "10px"}}>
      <div style={{fontSize: "32px"}}>{stat}</div>
      <div style={{fontSize: "20px", borderTop: "1px solid #eee"}}>{name}</div>
    </div>
  );
}

function UnitStatBlock({stats}) {
  if (!stats) {
    return null;
  }
  return (
    <div className="flexRow" style={{justifyContent: "flex-start", marginTop: "4px", fontFamily:"Slider", alignItems: "stretch", minWidth: "440px", width: "100%"}}>
      {stats.cost ? <UnitStat name="COST" stat={stats.cost} /> : <div style={{flex: "0 0 25%"}}></div>}
      {stats.combat ? <UnitStat name="COMBAT" stat={stats.combat} /> : <div style={{flex: "0 0 25%"}}></div>}
      {stats.move ? <UnitStat name="MOVE" stat={stats.move} /> : <div style={{flex: "0 0 25%"}}></div>}
      {stats.capacity ? <UnitStat name="CAPACITY" stat={stats.capacity} /> : <div style={{flex: "0 0 25%"}}></div>}
    </div>
  )
}

function InfoContent({tech}) {
  const description = tech.description.replaceAll("\\n", "\n");
  return (
    <div className="myriadPro" style={{maxWidth: responsivePixels(800), minWidth: responsivePixels(300), padding: responsivePixels(4), whiteSpace: "pre-line", textAlign: "center", fontSize: responsivePixels(32)}}>
      {description}
      <UnitStatBlock stats={tech.stats} />
    </div>
  );
}

export function TechRow({tech, updateTech, removeTech, addTech, leftContent, opts = {}}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  function toggleTech() {
    updateTech(tech.name, {
      ...tech,
      isReady: !tech.isReady,
    });
  }

  return (
    <SelectableRow 
      itemName={tech.name}
      selectItem={addTech}
      removeItem={removeTech}
      >
    <div className="flexRow" style={{width: "100%", justifyContent: "stretch"}}>
      <Modal closeMenu={() => setShowInfoModal(false)} level={2} visible={showInfoModal} title={<div style={{fontSize: responsivePixels(40)}}>{tech.name}</div>} content={
        <InfoContent tech={tech} />
      } top="30%" />
      {leftContent ? <div>{leftContent}</div> : null}
      {/* <div className="flexRow" style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0"}}>
        {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="22px" height="22px" />;
        })}
      </div> */}
      <div style={{display: "flex", flexDirection: "row", flexGrow: 2, alignItems: "center"}}>
        <div style={{ position: "relative", display: "flex", color: getTechColor(tech)}}>
          {tech.name}
          {tech.faction ? (
        <div
          style={{
            position: "absolute",
            opacity: "70%",
            height: responsivePixels(20),
            zIndex: -2,
            top: responsiveNegativePixels(-4),
            right: responsiveNegativePixels(-16),
          }}
        >
          <div style={{position: "relative", width: responsivePixels(24), height: responsivePixels(24)}}>
          <FullFactionSymbol faction={tech.faction} />
          </div>
          {/* <FactionSymbol faction={tech.faction} size={24} /> */}
        </div>
        ): null}
        </div>

        <div className="popupIcon" style={{display: opts.hideInfo ? "none" : "block", fontSize: responsivePixels(16)}} onClick={displayInfo}>&#x24D8;</div>
      </div>
      {opts.hideSymbols ? null : <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            opacity: "80%",
            flexShrink: 0,
          }}
        >
          {tech.prereqs.map((prereq, index) => {
            return <WrappedTechIcon key={index} type={prereq} size={20} />
          // return <TechIcon key={index} type={prereq} width={responsivePixels(23)} height={responsivePixels(24)} />;
        })}
          {/* <TechIcon type={tech.type} faction={tech.faction} width="32px" height="36px" /> */}
        </div>}
      {/* {updateTech !== undefined && tech.canExhaust ? 
      <div className="flexColumn" style={{zIndex:2}}>
        <button onClick={() => toggleTech(tech.name)}>
            {tech.isReady ? "Exhaust" : "Ready"}
        </button>
      </div>
      : null} */}
    </div></SelectableRow>);
}