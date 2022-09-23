import Image from 'next/image';

import { FactionSymbol } from "/src/FactionCard.js";

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

export function TechRow({tech, updateTech, removeTech, addTech, leftContent}) {

  function toggleTech() {
    updateTech(tech.name, {
      ...tech,
      isReady: !tech.isReady,
    });
  }

  function getTechColor() {
    switch (tech.type) {
      case "red":
        return "indianred";
      case "yellow":
        return "goldenrod";
      case "blue":
        return "cornflowerblue";
      case "green":
        return "seagreen";
    }
    return "#eee";
  }

  return (
    <div className={`techRow ${tech.canExhaust && !tech.isReady ? "exhausted" : ""}`} style={{fontSize: "16px", gap: "4px"}}>
      {leftContent ? <div style={{zIndex: 2}}>{leftContent}</div> : null}
      {addTech ? 
        <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "darkgreen",
          cursor: "pointer",
          zIndex: 100,
          marginRight: "4px",
        }}
        onClick={() => addTech(tech.name)}
      >
        &#x2713;
      </div>
      : null}
      {removeTech ? 
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "darkred",
            cursor: "pointer",
            zIndex: 100,
            marginRight: "4px",
          }}
          onClick={() => removeTech(tech.name)}
        >
          &#x2715;
        </div>
      : null}
      {/* <div className="flexRow" style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0"}}>
        {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="22px" height="22px" />;
        })}
      </div> */}
      <div style={{display: "flex", flexDirection: "row", flexGrow: 2, alignItems: "center"}}>
        <div style={{ display: "flex", zIndex: 2, color: getTechColor()}}>
          {tech.name}
        </div>
        {tech.faction ? (
        <div
          style={{
            position: "relative",
            marginLeft: "-10px",
            opacity: "70%",
            height: "36px",
            zIndex: 1,
          }}
        >
          <FactionSymbol faction={tech.faction} size={36} />
        </div>
        ): null}
      </div>
      <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            opacity: "80%",
            flexShrink: 0,
          }}
        >
          {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="27px" height="28px" />;
        })}
          {/* <TechIcon type={tech.type} faction={tech.faction} width="32px" height="36px" /> */}
        </div>
      {/* {updateTech !== undefined && tech.canExhaust ? 
      <div className="flexColumn" style={{zIndex:2}}>
        <button onClick={() => toggleTech(tech.name)}>
            {tech.isReady ? "Exhaust" : "Ready"}
        </button>
      </div>
      : null} */}
    </div>);
}