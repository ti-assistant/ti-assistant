import { useState } from "react";
import { getFactionSystemNumber, updateMapString } from "../../util/map";
import styles from "./GameMap.module.scss";
import OverlayLegend from "./OverlayLegend";
import { OverlayDetails } from "./PlanetOverlay";
import SystemImage from "./SystemImage";
import { Optional } from "../../util/types/types";
import Nexus, { NexusPosition } from "./Nexus";

interface Cube {
  q: number;
  r: number;
  s: number;
}

interface Point {
  x: number;
  y: number;
}

function Cube(q: number, r: number, s: number): Cube {
  return {
    q,
    r,
    s,
  };
}

function Point(x: number, y: number): Point {
  return {
    x,
    y,
  };
}

const HEX_RATIO = 2 / Math.sqrt(3);
const HEX_OVERLAP = 0.2888;

const CUBE_DIRECTIONS = [
  Cube(0, -1, +1),
  Cube(+1, -1, 0),
  Cube(+1, 0, -1),
  Cube(0, +1, -1),
  Cube(-1, +1, 0),
  Cube(-1, 0, +1),
] as const;

function cube_add(hex: Cube, vec: Cube) {
  return Cube(hex.q + vec.q, hex.r + vec.r, hex.s + vec.s);
}

function cube_neighbor(cube: Cube, direction: Cube) {
  return cube_add(cube, direction);
}

function cube_scale(hex: Cube, factor: number) {
  return Cube(hex.q * factor, hex.r * factor, hex.s * factor);
}

function cubeRing(center: Cube, radius: number) {
  const results: Cube[] = [];
  let hex = cube_add(center, cube_scale(CUBE_DIRECTIONS[4], radius));
  for (const direction of CUBE_DIRECTIONS) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = cube_neighbor(hex, direction);
    }
  }
  return results;
}

function cubeSpiral(center: Cube, radius: number) {
  let results: Cube[] = [center];
  for (let i = 1; i < radius; i++) {
    results = results.concat(cubeRing(center, i));
  }
  return results;
}

function CubeToPixel(hex: Cube, size: number) {
  const x = size * ((3 / 2) * hex.s);
  const y = size * ((Math.sqrt(3) / 2) * hex.s + Math.sqrt(3) * hex.q);
  return Point(x, y);
}

interface MapProps {
  defaultOverlay?: OverlayDetails;
  mapString: string;
  mapStyle: MapStyle;
  wormholeNexus?: string | SystemId;
  factions: {
    id?: FactionId;
    name?: string;
    startswith?: {
      faction?: FactionId;
    };
  }[];
  planets?: Partial<Record<PlanetId, Planet>>;
  systems?: Partial<Record<SystemId, System>>;
  hideLegend?: boolean;
  hideFracture?: boolean;
  expansions: Expansion[];
  // Used for selecting systems.
  canSelectSystem?: (systemId: string) => boolean;
  onSelect?: (systemId: string) => void;
}

export default function GameMap({
  defaultOverlay = "NONE",
  mapString,
  mapStyle,
  wormholeNexus,
  factions,
  hideLegend,
  planets,
  systems,
  canSelectSystem,
  onSelect,
  hideFracture,
  expansions,
}: MapProps) {
  const planetInfo = planets ?? {};
  const [overlayDetails, setOverlayDetails] =
    useState<OverlayDetails>(defaultOverlay);

  const updatedMapString =
    mapString === ""
      ? updateMapString(
          mapString,
          mapStyle,
          factions.length,
          expansions.includes("THUNDERS EDGE")
        )
      : mapString;
  let updatedSystemTiles = updatedMapString.split(" ");
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      return updatedTile;
    }
    if (tile.startsWith("P")) {
      const number = tile.at(tile.length - 1);
      if (!number) {
        return tile;
      }
      const factionIndex = parseInt(number);
      return getFactionSystemNumber(factions[factionIndex - 1]);
    }
    return tile;
  });

  const numTiles = updatedSystemTiles.length;
  let numRings = Math.ceil((3 + Math.sqrt(9 - 12 * (1 - numTiles))) / 6);
  const largestDimension = numRings * 2 - 1;
  const tilePercentage = 98 / largestDimension;

  const spiral = cubeSpiral(Cube(0, 0, 0), numRings);

  let ghosts = false;
  let rebellion = false;
  let ghostsCorner: Optional<NexusPosition>;
  let rebellionCorner: Optional<NexusPosition>;
  factions.forEach((faction, index) => {
    if (
      faction.id === "Ghosts of Creuss" ||
      faction.id === "Crimson Rebellion"
    ) {
      let positionPriority: NexusPosition[] = ["bottom-left", "bottom-right"];
      switch (factions.length) {
        case 3:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 1:
              positionPriority = ["bottom-right", "bottom-left"];
              break;
            case 2:
              positionPriority = ["top-left", "bottom-left"];
              break;
          }
          break;
        case 4:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 1:
              if (mapStyle === "standard") {
                positionPriority = ["bottom-right", "bottom-left"];
              } else {
                positionPriority = ["bottom-left", "top-left"];
              }
              break;
            case 2:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 3:
              if (mapStyle === "standard") {
                positionPriority = ["top-left", "top-right"];
              } else {
                positionPriority = ["top-left", "bottom-left"];
              }
              break;
          }
          break;
        case 5:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "top-left"];
              break;
            case 1:
              if (mapStyle === "standard") {
                positionPriority = ["bottom-right", "top-right"];
              } else {
                positionPriority = ["top-right", "bottom-right"];
              }
              break;
            case 2:
              if (mapStyle === "standard") {
                positionPriority = ["bottom-right", "bottom-left"];
              } else {
                positionPriority = ["bottom-right", "top-right"];
              }
              break;
            case 3:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 4:
              if (mapStyle === "standard") {
                positionPriority = ["top-left", "top-right"];
              } else {
                positionPriority = ["top-left", "bottom-left"];
              }
              break;
          }
          break;
        case 6:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "top-left"];
              break;
            case 1:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 2:
              positionPriority = ["bottom-right", "top-right"];
              break;
            case 3:
              positionPriority = ["bottom-right", "bottom-left"];
              break;
            case 4:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 5:
              positionPriority = ["top-left", "bottom-left"];
              break;
          }
          break;
        case 7:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "top-left"];
              break;
            case 1:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 2:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 3:
              positionPriority = ["bottom-right", "top-right"];
              break;
            case 4:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 5:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 6:
              positionPriority = ["top-left", "bottom-left"];
              break;
          }
          break;
        case 8:
          switch (index) {
            case 0:
              positionPriority = ["top-right", "top-left"];
              break;
            case 1:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 2:
              positionPriority = ["top-right", "bottom-right"];
              break;
            case 3:
              positionPriority = ["bottom-right", "top-right"];
              break;
            case 4:
              positionPriority = ["bottom-right", "bottom-left"];
              break;
            case 5:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 6:
              positionPriority = ["bottom-left", "top-left"];
              break;
            case 7:
              positionPriority = ["top-left", "bottom-left"];
              break;
          }
          break;
      }

      if (faction.id === "Ghosts of Creuss") {
        ghosts = true;
        ghostsCorner = positionPriority[0];
        if (rebellionCorner === ghostsCorner) {
          ghostsCorner = positionPriority[1];
        }
      } else if (faction.id === "Crimson Rebellion") {
        rebellion = true;
        rebellionCorner = positionPriority[0];
        if (ghostsCorner === rebellionCorner) {
          rebellionCorner = positionPriority[1];
        }
      }
    }
  });
  if (!ghosts) {
    mapString.split(" ").forEach((system) => {
      if (system === "17") {
        ghosts = true;
        ghostsCorner = "bottom-right";
      }
    });
  }
  if (!rebellion) {
    mapString.split(" ").forEach((system) => {
      if (system === "94") {
        rebellion = true;
        rebellionCorner = "top-right";
      }
    });
  }

  let nexusCorner: NexusPosition = "bottom-left";
  if (ghostsCorner === "bottom-left" || rebellionCorner === "bottom-left") {
    nexusCorner = "bottom-right";
    if (ghostsCorner === "bottom-right" || rebellionCorner === "bottom-right") {
      nexusCorner = "top-right";
    }
  }

  const fractureVisible = !hideFracture && expansions.includes("THUNDERS EDGE");
  return (
    <div className={`${styles.Map} ${fractureVisible ? styles.Fracture : ""}`}>
      {hideLegend ? null : (
        <OverlayLegend
          overlayDetails={overlayDetails}
          setOverlayDetails={setOverlayDetails}
        />
      )}
      <div className={styles.MapBody}>
        {spiral.map((cube, index) => {
          const point = CubeToPixel(cube, tilePercentage * HEX_RATIO);
          let tile = updatedSystemTiles[index];
          if (!tile || tile === "-1") {
            return null;
          }
          return (
            <div
              className="flexRow"
              key={index}
              style={{
                position: "absolute",
                width: `${tilePercentage * HEX_RATIO}%`,
                height: `${tilePercentage}%`,
                marginLeft: `${point.x}%`,
                marginTop: `${point.y}%`,
              }}
            >
              <SystemImage
                overlayDetails={overlayDetails}
                planets={planetInfo}
                systems={systems}
                systemNumber={tile}
                selectable={canSelectSystem ? canSelectSystem(tile) : false}
                onClick={onSelect}
              />
            </div>
          );
        })}
        {ghosts && ghostsCorner ? (
          <Nexus
            systemNumber="51"
            overlayDetails={overlayDetails}
            planetInfo={planetInfo}
            systems={systems}
            selectable={false}
            onClick={onSelect}
            position={ghostsCorner}
            tilePercentage={tilePercentage}
            hexRatio={HEX_RATIO}
            fractureVisible={fractureVisible}
          />
        ) : null}
        {rebellion && rebellionCorner ? (
          <Nexus
            systemNumber="118"
            overlayDetails={overlayDetails}
            planetInfo={planetInfo}
            systems={systems}
            selectable={false}
            onClick={onSelect}
            position={rebellionCorner}
            tilePercentage={tilePercentage}
            hexRatio={HEX_RATIO}
            fractureVisible={fractureVisible}
          />
        ) : null}
        {wormholeNexus ? (
          <Nexus
            systemNumber={getWormholeNexusSystemNum(wormholeNexus)}
            overlayDetails={overlayDetails}
            planetInfo={planetInfo}
            systems={systems}
            selectable={
              canSelectSystem
                ? canSelectSystem(
                    wormholeNexus === "PURGED" ? "81" : `82${wormholeNexus}`
                  )
                : false
            }
            onClick={onSelect}
            position={nexusCorner}
            tilePercentage={tilePercentage}
            hexRatio={HEX_RATIO}
            fractureVisible={fractureVisible}
          />
        ) : null}
        {hideFracture ? null : (
          <Fracture
            tilePercentage={tilePercentage}
            overlayDetails={overlayDetails}
            planetInfo={planetInfo}
            expansions={expansions}
            mapStyle={mapStyle}
            numFactions={factions.length}
          />
        )}
      </div>
    </div>
  );
}

function getWormholeNexusHeight(
  mallice: string | SystemId,
  tilePercentage: number,
  hexRatio: number
) {
  if (mallice === "A" || mallice === "B") {
    return tilePercentage * hexRatio;
  }
  return tilePercentage;
}

function getWormholeNexusSystemNum(mallice: string | SystemId) {
  if (mallice === "PURGED") {
    return "81";
  }
  if (mallice === "A") {
    return "82A";
  }
  if (mallice === "B") {
    return "82B";
  }
  return (mallice as SystemId).toString();
}

function getFracturePosition(
  numFactions: number,
  mapStyle: MapStyle
): { left: Cube; center: Cube; right: Cube } {
  switch (numFactions) {
    case 3:
      return {
        left: Cube(-1, 0, -3),
        center: Cube(-2, 0, -1),
        right: Cube(-4, 0, 3),
      };
    case 4:
    case 5:
      return {
        left: Cube(-1, 0, -3),
        center: Cube(-3, 0, -1),
        right: Cube(-4, 0, 3),
      };
    case 6:
      if (mapStyle === "large") {
        return {
          left: Cube(-2, 0, -3),
          center: Cube(-4, 0, -1),
          right: Cube(-5, 0, 3),
        };
      }
      return {
        left: Cube(-1, 0, -3),
        center: Cube(-3, 0, -1),
        right: Cube(-4, 0, 3),
      };
    case 7:
    case 8:
      return {
        left: Cube(-2, 0, -3),
        center: Cube(-4, 0, -1),
        right: Cube(-5, 0, 3),
      };
  }
  return {
    left: Cube(-1, 0, -3),
    center: Cube(-3, 0, -1),
    right: Cube(-4, 0, 3),
  };
}

function Fracture({
  tilePercentage,
  overlayDetails,
  planetInfo,
  expansions,
  numFactions,
  mapStyle,
}: {
  tilePercentage: number;
  overlayDetails: OverlayDetails;
  planetInfo: Partial<Record<PlanetId, Planet>>;
  expansions: Expansion[];
  numFactions: number;
  mapStyle: MapStyle;
}) {
  if (!expansions.includes("THUNDERS EDGE")) {
    return null;
  }

  const position = getFracturePosition(numFactions, mapStyle);

  const twoTileWidth = tilePercentage * (HEX_RATIO * 2 - HEX_OVERLAP);
  const threeTileWidth = tilePercentage * (HEX_RATIO * 3 - HEX_OVERLAP * 2);
  const tileHeight = tilePercentage * 1.5;

  const fracture = CubeToPixel(position.left, tilePercentage * HEX_RATIO);
  const fractureMid = CubeToPixel(position.center, tilePercentage * HEX_RATIO);
  const fractureBot = CubeToPixel(position.right, tilePercentage * HEX_RATIO);

  const leftShift = (tileHeight * HEX_RATIO) / 2;
  const threeTileLeftShift = tileHeight * HEX_RATIO;
  const topShift = -tileHeight / 3;

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: `${twoTileWidth}%`,
          height: `${tileHeight}%`,
          marginLeft: `${fracture.x + leftShift}%`,
          marginTop: `${fracture.y + topShift}%`,
        }}
      >
        <SystemImage
          overlayDetails={overlayDetails}
          planets={planetInfo}
          systemNumber={"666"}
          selectable={false}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: `${threeTileWidth}%`,
          height: `${tileHeight}%`,
          marginLeft: `${fractureMid.x + threeTileLeftShift}%`,
          marginTop: `${fractureMid.y + topShift}%`,
        }}
      >
        <SystemImage
          overlayDetails={overlayDetails}
          planets={planetInfo}
          systemNumber={"667"}
          selectable={false}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: `${twoTileWidth}%`,
          height: `${tileHeight}%`,
          marginLeft: `${fractureBot.x - leftShift}%`,
          marginTop: `${fractureBot.y + topShift}%`,
        }}
      >
        <SystemImage
          overlayDetails={overlayDetails}
          planets={planetInfo}
          systemNumber={"668"}
          selectable={false}
        />
      </div>
    </>
  );
}
