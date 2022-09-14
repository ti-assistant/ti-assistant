import Image from 'next/image';

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

export function TechRow({tech, updateTech, removeTech, addTech}) {

  function toggleTech() {
    updateTech(tech.name, {
      ...tech,
      isReady: !tech.isReady,
    });
  }

  return (
    <div className={`techRow ${tech.canExhaust && !tech.isReady ? "exhausted" : ""}`}>
      {addTech !== undefined ? 
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
        onClick={() => addTech(tech.name)}
      >
        &#x2713;
      </div>
      : null}
      {removeTech !== undefined ? 
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
      <div style={{display: "flex", flexDirection: "row", flexBasis: "50%", flexGrow: 2}}>
        <div style={{ display: "flex", fontSize: "24px", zIndex: 2}}>
          {tech.name}
        </div>
      </div>
      <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            position: "absolute",
            opacity: "70%",
            height: "48px",
            zIndex: 1,
            width: "99%",
            height: "100%",
            paddingRight: "8px",
            boxSizing: "border-box",
          }}
        >
          {tech.prereqs.map((prereq, index) => {
          return <TechIcon key={index} type={prereq} width="27px" height="28px" />;
        })}
          {/* <TechIcon type={tech.type} faction={tech.faction} width="32px" height="36px" /> */}
        </div>
      {updateTech !== undefined && tech.canExhaust ? 
      <div className="flexColumn" style={{zIndex:2}}>
        <button onClick={() => toggleTech(tech.name)}>
            {tech.isReady ? "Exhaust" : "Ready"}
        </button>
      </div>
      : null}
    </div>);
}