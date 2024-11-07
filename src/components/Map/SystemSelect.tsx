import NextImage from "next/image";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import { useGameId } from "../../context/dataHooks";
import { getFactionSystemNumber, validSystemNumber } from "../../util/map";
import { Optional } from "../../util/types/types";
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
  systemNumber,
  selectable,
  onClick,
}: {
  gameId: string;
  systemNumber: Optional<string>;
  selectable: boolean;
  onClick: (systemId: string) => void;
}) {
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
            cursor: selectable ? "pointer" : undefined,
            opacity: selectable ? undefined : 0.25,
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
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: selectable ? "pointer" : undefined,
          opacity: selectable ? undefined : 0.25,
        }}
      >
        <NextImage
          src={Hexagon}
          alt={`System Tile`}
          fill
          style={{ opacity: "10%", objectFit: "contain" }}
        />
      </div>
    );
  }

  const parsedNum = parseInt(systemNumber);
  if (parsedNum > 4200) {
    systemNumber = (parsedNum - 3200).toString();
  }
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
        cursor: selectable ? "pointer" : undefined,
        opacity: selectable ? undefined : 0.25,
      }}
      onClick={() => {
        if (!systemNumber) {
          return;
        }
        onClick(systemNumber);
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

interface MapProps {
  mapString: string;
  mapStyle: MapStyle;
  mallice?: string;
  factions: {
    id?: FactionId;
    name?: string;
    startswith?: {
      faction?: FactionId;
    };
  }[];
  canSelectSystem: (systemId: string) => boolean;
  onSelect: (systemId: string) => void;
}

export default function SystemSelect({
  mapString,
  mapStyle,
  mallice,
  factions,
  canSelectSystem,
  onSelect,
}: MapProps) {
  const gameId = useGameId();

  let updatedSystemTiles = mapString.split(" ");
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      const parsedTile = parseInt(updatedTile);
      if (parsedTile > 4200) {
        return (parsedTile - 3200).toString();
      }
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

  return (
    <div className={styles.Map}>
      <div className={styles.SystemSelectBody}>
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
                systemNumber={tile}
                selectable={canSelectSystem(tile)}
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
                  ? "4%"
                  : undefined,
              bottom:
                ghostsCorner === "bottom-right" ||
                ghostsCorner === "bottom-left"
                  ? "4%"
                  : undefined,
              left:
                ghostsCorner === "bottom-left" || ghostsCorner === "top-left"
                  ? "4%"
                  : undefined,
              top:
                ghostsCorner === "top-right" || ghostsCorner === "top-left"
                  ? "4%"
                  : undefined,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              gameId={gameId}
              systemNumber="51"
              onClick={onSelect}
              selectable={false}
            />
          </div>
        ) : null}
        {mallice ? (
          <div
            style={{
              position: "absolute",
              left: ghostsCorner !== "bottom-left" ? "4%" : undefined,
              right: ghostsCorner === "bottom-left" ? "4%" : undefined,
              bottom: "4%",
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              gameId={gameId}
              systemNumber={mallice === "PURGED" ? "81" : `82${mallice}`}
              selectable={canSelectSystem(
                mallice === "PURGED" ? "81" : `82${mallice}`
              )}
              onClick={onSelect}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
