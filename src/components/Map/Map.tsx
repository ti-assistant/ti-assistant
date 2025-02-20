import NextImage from "next/image";
import { ReactNode, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import {
  useAllPlanets,
  useAttachments,
  useFactions,
  useGameId,
} from "../../context/dataHooks";
import { getFactionColor } from "../../util/factions";
import {
  getFactionSystemNumber,
  updateMapString,
  validSystemNumber,
} from "../../util/map";
import {
  applyAllPlanetAttachments,
  getPlanetTypeColor,
} from "../../util/planets";
import { getTechTypeColor } from "../../util/techs";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./Map.module.scss";

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

function getRotationClass(key: string) {
  switch (key) {
    case "rotateSixty":
      return styles.rotateSixty;
    case "rotateOneTwenty":
      return styles.rotateOneTwenty;
    case "rotateOneEighty":
      return styles.rotateOneEighty;
    case "rotateTwoForty":
      return styles.rotateTwoForty;
    case "rotateThreeHundred":
      return styles.rotateThreeHundred;
  }
}

function getRotationClassFromNumber(key: number) {
  switch (key) {
    case 1:
      return styles.rotateSixty;
    case 2:
      return styles.rotateOneTwenty;
    case 3:
      return styles.rotateOneEighty;
    case 4:
      return styles.rotateTwoForty;
    case 5:
      return styles.rotateThreeHundred;
  }
  return "";
}

export function SystemImage({
  gameId,
  showDetails,
  systemNumber,
}: {
  gameId: string;
  showDetails: Details;
  systemNumber: Optional<string>;
}) {
  const attachments = useAttachments();
  const factions = useFactions();
  const planets = useAllPlanets();

  if (
    !systemNumber ||
    systemNumber === "0" ||
    !validSystemNumber(systemNumber)
  ) {
    if (systemNumber && systemNumber.split(":").length > 1) {
      const classNames = getRotationClass(systemNumber.split(":")[0] ?? "");
      systemNumber = systemNumber.split(":")[1] ?? "";
      return (
        <div
          className={`flexRow ${classNames}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <NextImage
            src={`/images/systems/ST_${systemNumber}.png`}
            alt={`System ${systemNumber} Tile`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    }
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <NextImage
          src={Hexagon}
          alt={`System Tile`}
          sizes={rem(64)}
          fill
          style={{ opacity: "10%", objectFit: "contain" }}
          priority
        />
      </div>
    );
  }

  let systemPlanets = Object.values(planets).filter((planet) => {
    if (!systemNumber) {
      return false;
    }
    if (systemNumber === "82A" || systemNumber === "82B") {
      return planet.system === "82B" || planet.system === "82A";
    }
    return planet.system === parseInt(systemNumber);
  });
  systemPlanets = applyAllPlanetAttachments(systemPlanets, attachments);

  let classNames: Optional<string> = "";
  if (systemNumber.includes("A") && systemNumber.split("A").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("A")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("A")[0] ?? ""}A`;
  }
  if (systemNumber.includes("B") && systemNumber.split("B").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("B")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("B")[0] ?? ""}B`;
  }

  return (
    <div
      className={`flexRow ${classNames}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <NextImage
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        sizes={rem(128)}
        fill
        style={{ objectFit: "contain" }}
        priority={
          systemNumber === "92" ||
          systemNumber === "18" ||
          systemNumber === "82A"
        }
      />
      {systemPlanets.map((planet) => {
        let detailsSymbol: Optional<ReactNode>;
        const height =
          planet.id !== "Mallice" && planet.id !== "Creuss"
            ? `calc(24% * ${HEX_RATIO})`
            : "24%";

        if (planet.state === "PURGED") {
          return (
            <div
              key={planet.id}
              className="flexRow"
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <NextImage
                  src={`/images/destroyed.webp`}
                  alt={`Destroyed Planet`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          );
        }
        switch (showDetails) {
          case "OWNERS": {
            if (!planet.owner) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${getFactionColor(
                    (factions ?? {})[planet.owner]
                  )}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <FactionIcon factionId={planet.owner} size="75%" />
              </div>
            );
            break;
          }
          case "TYPES": {
            if (planet.type === "NONE") {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${getPlanetTypeColor(
                    planet.type
                  )}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <PlanetIcon type={planet.type} size="70%" />
              </div>
            );
            break;
          }
          case "ATTACHMENTS": {
            if ((planet.attachments ?? []).length === 0) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${"#eee"}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <div
                  className="flexRow"
                  style={{ position: "relative", width: "70%", height: "70%" }}
                >
                  <div className="symbol">⎗</div>
                </div>
              </div>
            );
            break;
          }
          case "TECH_SKIPS": {
            let color: Optional<TechType>;
            let size: Optional<string>;
            for (const attribute of planet.attributes) {
              switch (attribute) {
                case "red-skip":
                  color = "RED";
                  size = "100%";
                  break;
                case "blue-skip":
                  color = "BLUE";
                  size = "95%";
                  break;
                case "green-skip":
                  color = "GREEN";
                  size = "100%";
                  break;
                case "yellow-skip":
                  color = "YELLOW";
                  size = "90%";
                  break;
              }
            }
            if (color && size) {
              detailsSymbol = (
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    backgroundColor: "var(--background-color)",
                    border: `var(--border-size) solid ${getTechTypeColor(
                      color
                    )}`,
                    borderRadius: "100%",
                    width: "24%",
                    height: height,
                    marginLeft: `${planet.position?.x}%`,
                    marginTop: `${planet.position?.y}%`,
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: "70%",
                      height: "70%",
                    }}
                  >
                    <TechIcon type={color} size={size} />
                  </div>
                </div>
              );
            }
            break;
          }
        }

        return (
          <div
            key={planet.id}
            className="flexRow"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            {detailsSymbol}
          </div>
        );
      })}
      {systemNumber === "18" && !systemPlanets[0]?.owner ? (
        <div
          className="flexRow"
          style={{
            position: "absolute",
            borderRadius: "100%",
            width: "40%",
            height: `calc(40% * ${HEX_RATIO})`,
          }}
        >
          <div
            className="flexRow"
            style={{ position: "relative", width: "90%", height: "90%" }}
          >
            <NextImage
              src={`/images/custodians.png`}
              alt={`Custodians Token`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
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

function fillHomeSystems(a: string, numFactions: number) {
  let currentIndex = 0;
  return a
    .split(" ")
    .map((tile) => {
      if (tile === "0") {
        currentIndex++;
        if (currentIndex > numFactions) {
          return "-1";
        }
        return `P${currentIndex}`;
      }
      return tile;
    })
    .join(" ");
}

type Details = "NONE" | "ATTACHMENTS" | "OWNERS" | "TECH_SKIPS" | "TYPES";

export default function Map({
  mapString,
  mapStyle,
  mallice,
  factions,
  hideLegend,
}: MapProps) {
  const gameId = useGameId();

  const [showDetails, setShowDetails] = useState<Details>("NONE");

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
                selected={showDetails === "NONE"}
                toggleFn={() => setShowDetails("NONE")}
              >
                <FormattedMessage
                  id="n8jSwp"
                  description="Text on a button that will show no overlay."
                  defaultMessage="None"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={showDetails === "OWNERS"}
                toggleFn={() => setShowDetails("OWNERS")}
              >
                <FormattedMessage
                  id="FhKQXR"
                  description="Text on a button that will show planet ownership."
                  defaultMessage="Owners"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={showDetails === "TYPES"}
                toggleFn={() => setShowDetails("TYPES")}
              >
                <FormattedMessage
                  id="wDLqxZ"
                  description="Text on a button that will show planet types."
                  defaultMessage="Types"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={showDetails === "TECH_SKIPS"}
                toggleFn={() => setShowDetails("TECH_SKIPS")}
              >
                <FormattedMessage
                  id="j3n7Nr"
                  description="Text on a button that will show planets with tech skips."
                  defaultMessage="Tech Skips"
                />
              </Chip>
              <Chip
                fontSize={16}
                selected={showDetails === "ATTACHMENTS"}
                toggleFn={() => setShowDetails("ATTACHMENTS")}
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
                gameId={gameId}
                showDetails={showDetails}
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
              gameId={gameId}
              showDetails={showDetails}
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
              gameId={gameId}
              showDetails={showDetails}
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
