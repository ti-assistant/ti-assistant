import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { usePlanets } from "../../context/dataHooks";
import { getFactionSystemNumber, updateMapString } from "../../util/map";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./Map.module.scss";
import { OverlayDetails } from "./PlanetOverlay";
import SystemImage from "./SystemImage";

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
  mapString: string;
  mapStyle: MapStyle;
  mallice?: string | SystemId;
  factions: {
    id?: FactionId;
    name?: string;
    startswith?: {
      faction?: FactionId;
    };
  }[];
  hideLegend?: boolean;
}

export default function Map({
  mapString,
  mapStyle,
  mallice,
  factions,
  hideLegend,
}: MapProps) {
  const planets = usePlanets();

  const [overlayDetails, setOverlayDetails] = useState<OverlayDetails>("NONE");

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
      {!hideLegend ? (
        <div className={styles.Legend} onClick={(e) => e.stopPropagation()}>
          <LabeledDiv
            label={
              <FormattedMessage
                id="5rR4S2"
                description="Label for a section that includes map details."
                defaultMessage="View Details"
              />
            }
            style={{
              width: "fit-content",
              backgroundColor: "var(--background-color)",
            }}
            innerStyle={{
              justifyContent: "stretch",
              alignItems: "stretch",
              paddingTop: rem(16),
            }}
          >
            <div className={styles.LegendContent}>
              <Chip
                fontSize={16}
                selected={overlayDetails === "NONE"}
                toggleFn={() => setOverlayDetails("NONE")}
              >
                <FormattedMessage
                  id="n8jSwp"
                  description="Text on a button that will show no overlay."
                  defaultMessage="None"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={overlayDetails === "OWNERS"}
                toggleFn={() => setOverlayDetails("OWNERS")}
              >
                <FormattedMessage
                  id="FhKQXR"
                  description="Text on a button that will show planet ownership."
                  defaultMessage="Owners"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={overlayDetails === "TYPES"}
                toggleFn={() => setOverlayDetails("TYPES")}
              >
                <FormattedMessage
                  id="wDLqxZ"
                  description="Text on a button that will show planet types."
                  defaultMessage="Types"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={overlayDetails === "TECH_SKIPS"}
                toggleFn={() => setOverlayDetails("TECH_SKIPS")}
              >
                <FormattedMessage
                  id="j3n7Nr"
                  description="Text on a button that will show planets with tech skips."
                  defaultMessage="Tech Skips"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={overlayDetails === "ATTACHMENTS"}
                toggleFn={() => setOverlayDetails("ATTACHMENTS")}
              >
                <FormattedMessage
                  id="1odgd1"
                  description="Text on a button that will show planet attachments."
                  defaultMessage="Attachments"
                />
              </Chip>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
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
                planets={planets}
                systemNumber={tile}
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
              planets={planets}
              systemNumber="51"
            />
          </div>
        ) : null}
        {mallice ? (
          <div
            style={{
              position: "absolute",
              left: ghostsCorner !== "bottom-left" ? 0 : undefined,
              right: ghostsCorner === "bottom-left" ? 0 : undefined,
              bottom: 0,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${getMalliceHeight(
                mallice,
                tilePercentage,
                HEX_RATIO
              )}%`,
            }}
          >
            <SystemImage
              overlayDetails={overlayDetails}
              planets={planets}
              systemNumber={getMalliceSystemNum(mallice)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getMalliceHeight(
  mallice: string | SystemId,
  tilePercentage: number,
  hexRatio: number
) {
  if (mallice === "A" || mallice === "B") {
    return tilePercentage * hexRatio;
  }
  return tilePercentage;
}

function getMalliceSystemNum(mallice: string | SystemId) {
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
