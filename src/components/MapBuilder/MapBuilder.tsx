import NextImage from "next/image";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import {
  AttachmentContext,
  FactionContext,
  GameIdContext,
  PlanetContext,
} from "../../context/Context";
import { getFactionColor } from "../../util/factions";
import {
  applyAllPlanetAttachments,
  getPlanetTypeColor,
} from "../../util/planets";
import { getTechTypeColor } from "../../util/techs";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./MapBuilder.module.scss";
import { useDrag, useDrop } from "react-dnd";

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

function validSystemNumber(number: string) {
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return isHomeSystem(number);
  }
  if ((intVal > 102 && intVal < 1001) || intVal > 1060) {
    return false;
  }
  return true;
}

export function isHomeSystem(systemNumber?: string) {
  if (!systemNumber) {
    return false;
  }
  return systemNumber.match(/^P[1-8]$/);
}

export function getDefaultMapString(numFactions: number, mapStyle: MapStyle) {
  switch (numFactions) {
    case 3:
      return (
        "0 0 0 0 0 0 " +
        "0 0 0 0 0 0 0 0 0 0 0 0 " +
        "-1 -1 0 P1 0 -1 -1 -1 0 P2 0 -1 -1 -1 0 P3 0 -1"
      );
    case 4:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 P1 0 0 0 P2 0 0 0 0 P3 0 0 0 P4"
          );
        case "skinny":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "-1 0 P1 -1 -1 -1 -1 P2 0 -1 0 P3 -1 -1 -1 -1 P4 0"
          );
        case "warp":
          return (
            "85A3 0 0 85A 0 0 " +
            "0 87A3 0 0 0 88A 0 87A 0 0 0 88A3 " +
            "86A3 84A3 0 P1 0 0 P2 0 83A 86A 84A 0 P3 0 0 P4 0 83A3"
          );
      }
      break;
    case 5:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 0 0 0 P2 0 0 P3 0 0 P4 0 0 0 P5 0"
          );
        case "skinny":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 -1 0 P2 -1 -1 0 P3 0 -1 -1 P4 0 -1 P5 0"
          );
        case "warp":
          return (
            "0 0 0 85A 0 0 " +
            "0 0 0 0 0 88A 0 87A 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 83A 86A 84A 0 P4 0 0 P5 0 0"
          );
      }
      break;
    case 6:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
          );
        case "large":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 0 P2 0 0 0 P3 0 0 0 P4 0 0 0 P5 0 0 0 P6 0 0 0"
          );
      }
      break;
    case 7:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 85A 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 88A 0 87A 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 83A 86A 84A 0 P5 0 0 P6 0 0 P7 0 0"
          );
        case "warp":
          return (
            "85B 0 0 84B 90B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 88B3 0 P2 0 0 P3 0 86B 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 P4 0 0 P5 -1 -1 P6 0 -1 P7 0 0"
          );
      }
      break;
    case 8:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0 P7 0 0 P8 0 0"
          );
        case "warp":
          return (
            "87A1 90B3 0 88A2 89B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 85B2 0 0 0 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 0 P2 -1 -1 P3 0 -1 P4 0 0 P5 0 0 P6 -1 -1 P7 0 -1 P8 0 0"
          );
      }
      break;
  }
  return (
    "0 0 0 0 0 0 " +
    "0 0 0 0 0 0 0 0 0 0 0 0 " +
    "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
  );
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
  index,
  systemNumber,
  onDrop,
}: {
  gameId: string;
  index: number;
  systemNumber: string | undefined;
  onDrop?: (dragItem: any, dropItem: any) => void;
}) {
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const planets = useContext(PlanetContext);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => {
    return {
      canDrag: () => systemNumber !== "18",
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      type: "SYSTEM_TILE",
      item: { systemNumber, index },
    };
  }, [systemNumber, index]);

  const [{ canDrop, isOver }, drop] = useDrop(() => {
    return {
      accept: "SYSTEM_TILE",
      canDrop: () => systemNumber !== "18",
      collect: (monitor) => ({
        canDrop: monitor.canDrop() && onDrop,
        isOver: monitor.isOver() && onDrop,
      }),
      drop: (dragItem, monitor) => {
        if (!onDrop) {
          return;
        }
        onDrop(dragItem, {
          systemNumber,
          index,
        });
      },
    };
  }, [systemNumber, index, onDrop]);

  if (systemNumber === "-1") {
    return (
      <div
        ref={(node) => {
          if (!onDrop) {
            return drag(node);
          }
          return drag(drop(node));
        }}
        className={`flexRow ${styles.SystemImage}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <NextImage
          src={Hexagon}
          alt={`System ${systemNumber} Tile`}
          fill
          style={{
            opacity: "10%",
            objectFit: "contain",
            filter: "invert(0.9)",
          }}
        />
        {isOver ? (
          <div
            style={{
              borderRadius: "100%",
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              boxShadow: "0 0 8px 8px white",
            }}
          ></div>
        ) : null}
      </div>
    );
  }

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
          ref={(node) => {
            if (!onDrop) {
              return drag(node);
            }
            return drag(drop(node));
          }}
          className={`flexRow ${classNames} ${styles.SystemImage}`}
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
        ref={(node) => {
          if (!onDrop) {
            return drag(node);
          }
          return drag(drop(node));
        }}
        className={`flexRow ${styles.SystemImage}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <NextImage
          src={Hexagon}
          alt={`System Tile`}
          fill
          style={{ opacity: "10%", objectFit: "contain" }}
        />
        {isOver ? (
          <div
            style={{
              borderRadius: "100%",
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              boxShadow: "0 0 8px 8px white",
            }}
          ></div>
        ) : null}
      </div>
    );
  }

  if (isHomeSystem(systemNumber)) {
    return (
      <div
        ref={(node) => {
          if (!onDrop) {
            return drag(node);
          }
          return drag(drop(node));
        }}
        className={`flexRow ${styles.SystemImage}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <NextImage
          src={`/images/systems/ST_92.png`}
          alt={`Player Home System`}
          fill
          style={{ objectFit: "contain" }}
        />
        <div
          className="flexRow"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            fontSize: "28px",
            textShadow: "0 0 4px black, 0 0 4px black",
          }}
        >
          {systemNumber}
        </div>
        {isOver ? (
          <div
            style={{
              borderRadius: "100%",
              position: "absolute",
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              boxShadow: "0 0 8px 8px white",
            }}
          ></div>
        ) : null}
      </div>
    );
  }

  let classNames: string | undefined = "";
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
      ref={(node) => {
        if (!onDrop) {
          return drag(node);
        }
        return drag(drop(node));
      }}
      className={`flexRow ${styles.SystemImage}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        opacity: isDragging ? "25%" : "100%",
        pointerEvents: systemNumber === "18" ? "none" : undefined,
      }}
    >
      <NextImage
        className={classNames}
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        fill
        style={{ objectFit: "contain" }}
      />
      <div
        className="flexRow"
        style={{
          width: "100%",
          height: "60%",
          top: 0,
          position: "absolute",
          fontSize: "18px",
          textShadow: "0 0 4px black, 0 0 4px black",
        }}
      >
        {systemNumber}
      </div>
      {isOver ? (
        <div
          style={{
            borderRadius: "100%",
            position: "absolute",
            width: "4px",
            height: "4px",
            backgroundColor: "white",
            boxShadow: "0 0 8px 8px white",
          }}
        ></div>
      ) : null}
    </div>
  );
}

interface MapProps {
  mapString: string;
  updateMapString: (dragItem: any, dropItem: any) => void;
}

export default function Map({ mapString, updateMapString }: MapProps) {
  const gameId = useContext(GameIdContext);

  let updatedSystemTiles = ["18"].concat(...mapString.split(" "));
  updatedSystemTiles = updatedSystemTiles
    .map((tile, index) => {
      const updatedTile = updatedSystemTiles[index];
      if (tile === "0" && updatedTile && updatedTile !== "0") {
        return updatedTile;
      }
      return tile;
    })
    .filter((tile) => tile !== "");

  const numTiles = updatedSystemTiles.length;
  let numRings = Math.ceil((3 + Math.sqrt(9 - 12 * (1 - numTiles))) / 6);

  const largestDimension = numRings * 2 - 1;
  const tilePercentage = 98 / largestDimension;

  numRings += 1;

  const spiral = cubeSpiral(Cube(0, 0, 0), numRings);

  return (
    <div className={styles.Map}>
      <div className={styles.MapBody}>
        {spiral.map((cube, index) => {
          const point = CubeToPixel(cube, tilePercentage * HEX_RATIO);
          let tile = updatedSystemTiles[index];
          if (!tile) {
            tile = "-1";
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
                index={index}
                systemNumber={tile}
                onDrop={(dragItem, dropItem) => {
                  updateMapString(dragItem, dropItem);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
