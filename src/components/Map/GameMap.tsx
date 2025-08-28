import { useState } from "react";
import { getFactionSystemNumber, updateMapString } from "../../util/map";
import styles from "./GameMap.module.scss";
import OverlayLegend from "./OverlayLegend";
import { OverlayDetails } from "./PlanetOverlay";
import SystemImage from "./SystemImage";
import { rem } from "../../util/util";
import { useOptions } from "../../context/dataHooks";

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
  hideLegend?: boolean;
  hideFracture?: boolean;
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
  canSelectSystem,
  onSelect,
  hideFracture,
}: MapProps) {
  const planetInfo = planets ?? {};
  const [overlayDetails, setOverlayDetails] =
    useState<OverlayDetails>(defaultOverlay);

  const updatedMapString =
    mapString === ""
      ? updateMapString(mapString, mapStyle, factions.length)
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
  let ghostsCorner = null;
  factions.forEach((faction, index) => {
    if (faction.id === "Ghosts of Creuss") {
      switch (factions.length) {
        case 3:
          switch (index) {
            case 0:
              ghostsCorner = "top-right";
              break;
            case 1:
              ghostsCorner = "bottom-right";
              break;
            case 2:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 4:
          switch (index) {
            case 0:
              ghostsCorner = mapStyle === "standard" ? "top-left" : "top-right";
              break;
            case 1:
              ghostsCorner =
                mapStyle === "standard" ? "top-right" : "bottom-right";
              break;
            case 2:
              ghostsCorner =
                mapStyle === "standard" ? "bottom-right" : "bottom-left";
              break;
            case 3:
              ghostsCorner =
                mapStyle === "standard" ? "bottom-left" : "top-left";
              break;
          }
          break;
        case 5:
          switch (index) {
            case 0:
              ghostsCorner = "top-right";
              break;
            case 1:
              ghostsCorner = "bottom-right";
              break;
            case 2:
              ghostsCorner = "bottom-right";
              break;
            case 3:
              ghostsCorner = "bottom-left";
              break;
            case 4:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 6:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
              ghostsCorner = "bottom-right";
              break;
            case 4:
              ghostsCorner = "bottom-left";
              break;
            case 5:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 7:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
              ghostsCorner = "bottom-right";
              break;
            case 4:
              ghostsCorner = "bottom-left";
              break;
            case 5:
            case 6:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 8:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
            case 4:
              ghostsCorner = "bottom-right";
              break;
            case 5:
              ghostsCorner = "bottom-left";
              break;
            case 6:
            case 7:
              ghostsCorner = "top-left";
              break;
          }
          break;
      }

      ghosts = true;
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

  return (
    <div className={styles.Map}>
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
                systemNumber={tile}
                selectable={canSelectSystem ? canSelectSystem(tile) : false}
                onClick={onSelect}
              />
            </div>
          );
        })}
        {ghosts ? (
          <div
            style={{
              position: "absolute",
              right:
                ghostsCorner === "top-right" || ghostsCorner === "bottom-right"
                  ? 0
                  : undefined,
              bottom:
                ghostsCorner === "bottom-right" ||
                ghostsCorner === "bottom-left"
                  ? 0
                  : undefined,
              left:
                ghostsCorner === "bottom-left" || ghostsCorner === "top-left"
                  ? 0
                  : undefined,
              top:
                ghostsCorner === "top-right" || ghostsCorner === "top-left"
                  ? 0
                  : undefined,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              overlayDetails={overlayDetails}
              planets={planetInfo}
              systemNumber="51"
              selectable={false}
              onClick={onSelect}
            />
          </div>
        ) : null}
        {wormholeNexus ? (
          <div
            style={{
              position: "absolute",
              left: ghostsCorner !== "bottom-left" ? 0 : undefined,
              right: ghostsCorner === "bottom-left" ? 0 : undefined,
              bottom: 0,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${getWormholeNexusHeight(
                wormholeNexus,
                tilePercentage,
                HEX_RATIO
              )}%`,
            }}
          >
            <SystemImage
              overlayDetails={overlayDetails}
              planets={planetInfo}
              systemNumber={getWormholeNexusSystemNum(wormholeNexus)}
              selectable={
                canSelectSystem
                  ? canSelectSystem(
                      wormholeNexus === "PURGED" ? "81" : `82${wormholeNexus}`
                    )
                  : false
              }
              onClick={onSelect}
            />
          </div>
        ) : null}
        {hideFracture ? null : (
          <Fracture
            tilePercentage={tilePercentage}
            overlayDetails={overlayDetails}
            planetInfo={planetInfo}
            numRings={numRings}
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

function getFracturePosition(numRings: number) {
  // Returns [-1, -2, -2, -3, -3, -4, -4, etc.]
  const q = (1 / 4) * (-2 * numRings - (-1) ** numRings - 3);
  return Cube(q, 0, numRings);
}

function Fracture({
  tilePercentage,
  overlayDetails,
  planetInfo,
  numRings,
}: {
  tilePercentage: number;
  overlayDetails: OverlayDetails;
  planetInfo: Partial<Record<PlanetId, Planet>>;
  numRings: number;
}) {
  const options = useOptions();

  if (!options.expansions.includes("THUNDERS EDGE")) {
    return null;
  }

  const position = getFracturePosition(numRings);

  const twoTileWidth = tilePercentage * (HEX_RATIO * 2 - HEX_OVERLAP);
  const threeTileWidth = tilePercentage * (HEX_RATIO * 3 - HEX_OVERLAP * 2);
  const tileHeight = tilePercentage * 1.5;

  const fracture = CubeToPixel(position, tilePercentage * HEX_RATIO);
  const fractureMid = CubeToPixel(
    Cube(position.q + 1, 0, position.s),
    tilePercentage * HEX_RATIO
  );
  const fractureBot = CubeToPixel(
    Cube(position.q + 1, 0, position.s + 2),
    tilePercentage * HEX_RATIO
  );

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
