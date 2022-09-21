import Image from 'next/image';
import { useRouter } from 'next/router'
import { useState } from "react";
import useSWR from 'swr'

import { AttachRow } from "/src/AttachRow.js";
import { Resources } from "/src/Resources.js";
import { Modal } from "/src/Modal.js";
import { FactionSymbol } from "/src/FactionCard.js";

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

export function SystemRow({planets, addPlanet}) {
  const router = useRouter();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: gameState, error: gameStateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  if (gameStateError) {
    return (<div>Failed to load game stae</div>);
  }
  if (!gameState) {
    return (<div>Loading...</div>);
  }

  function addPlanets() {
    planets.forEach((planet) => {
      addPlanet(planet.name);
    });
  }

  let claimed = null;
  let claimedColor = null;
  planets.forEach((planet) => {
    (planet.owners ?? []).forEach((owner) => {
      if (claimed === null) {
        claimed = owner;
        claimedColor = gameState.factions[owner].color.toLowerCase();
      } else {
        claimed = "Multiple Players";
        claimedColor = "darkred";
      }
    });
  });

  const height = planets.length * 72;

  return (
    <div className="systemRow">
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
        onClick={addPlanets}
      >
        &#x2713;
      </div>
      : null}
      <div style={{display: "flex", flexDirection: "column", height: height, justifyContent: "center"}}>
      {planets.map((planet) => {
          let claimed = null;
          let claimedColor = null;
          planets.forEach((planet) => {
            (planet.owners ?? []).forEach((owner) => {
                if (claimed === null) {
                  claimed = owner;
                  claimedColor = gameState.factions[owner].color.toLowerCase();
                } else {
                  claimed = "Multiple Players";
                  claimedColor = "darkred";
                }
            });
          });

        return <div key={planet.name} style={{display: "flex", flexDirection: "row", height: "72px"}}>
                  {claimed ? 
          <div style={{fontFamily: "Myriad Pro",
          position: "absolute",
          color: claimedColor,
          borderRadius: "5px",
          border: `1px solid ${claimedColor}`,
          padding: "0px 4px",
          fontSize: "12px",
          bottom: "4px",
          left: "28px"
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
          marginRight: "10px",
          width: "48px"
        }}
      >
        <PlanetAttributes attributes={planet.attributes ?? []} />
      </div>
      </div>
      })}
      </div>
    </div>);
}