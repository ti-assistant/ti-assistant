import Image from 'next/image';

import { Resources } from "/src/Resources.js";

function LegendaryPlanetIcon() {
  return (
    <div style={{display: "flex", alignItems: "flex-start", borderRadius: "22px", height: "18px", width: "18px", paddingTop: "3px", paddingLeft: "3px", boxShadow: "0px 0px 2px 1px purple", backgroundColor: "black"}}>
      <Image src="/images/legendary_planet.svg" alt="Legendary Planet Icon" width="15px" height="15px" />
    </div>);
}


export function AttachRow({ attachment, currentPlanet }) {
  function isSkip() {
    return attachment.attribute.includes("skip");
  }
  function hasResourcesOrInfluence() {
    return attachment.resources !== 0 || attachment.influence !== 0;
  }
  function hasAttribute() {
    return attachment.attribute !== "";
  }
  function getAttributeIcon(width, height) {
    switch (attachment.attribute) {
      case "legendary":
        return <LegendaryPlanetIcon />;
      case "red-skip":
        return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width={width} height={height} />;
      case "yellow-skip":
        return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width={width} height={height} />;
      case "blue-skip":
        return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
      case "green-skip":
        return <Image src="/images/green_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
      case "demilitarized":
        return <Image src="/images/demilitarized_zone.svg" alt="Demilitarized Zone" width={width} height={height} />;
      case "tomb":
        return <Image src="/images/tomb_symbol.webp" alt="Tomb of Emphidia" width={width} height={height} />;
      case "all-types":
        return <div>
          <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" width={width} height={height} />
          <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" width={width} height={height} />
          <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" width={width} height={height} />
        </div>
      case "space-cannon":
        return <div style={{width: "22px", height: "22px"}}>✹✹✹</div>
      default:
        return null;
    }
  }
  let attached = null;
  (attachment.planets ?? []).forEach((planet) => {
    if (planet !== currentPlanet) {
      if (attached === null) {
        attached = planet;
      } else {
        attached = "Multiple Planets";
      }
    }
  });

  return (
    <div className="flexRow" style={{width: "100%", height: "72px", justifyContent: "flex-start", fontSize: "16px", position: "relative"}}>
      <div style={{flexBasis: "60%"}}>{attachment.name}</div>
      <Resources resources={attachment.resources} influence={attachment.influence} />
      {isSkip() ? <div style={{marginRight: "6px"}}>OR</div> : null}
      {hasAttribute() ? getAttributeIcon("22px", "22px") : null}
      {attached ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: "indianred",
        borderRadius: "5px",
        border: `1px solid indianred`,
        padding: "0px 4px",
        fontSize: "12px",
        bottom: "4px",
      }}>Attached to {attached}</div> : null
      }
    </div>
  );
}
