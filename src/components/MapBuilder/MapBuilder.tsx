import NextImage from "next/image";
import { useDrag, useDrop } from "react-dnd";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import { isHomeSystem, validSystemNumber } from "../../util/map";
import { Optional } from "../../util/types/types";
import styles from "./MapBuilder.module.scss";
import { rem } from "../../util/util";

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

function cube_equals(a: Cube, b: Cube) {
  return a.q === b.q && a.r === b.r && a.s === b.s;
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
  index,
  systemNumber,
  onDrop,
  blockDrag,
}: {
  index: number;
  systemNumber: Optional<string>;
  onDrop?: (dragItem: any, dropItem: any) => void;
  blockDrag?: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(() => {
    return {
      canDrag: () => !blockDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      type: "SYSTEM_TILE",
      item: { systemNumber, index },
    };
  }, [systemNumber, index]);

  const [{ isOver }, drop] = useDrop(() => {
    return {
      accept: "SYSTEM_TILE",
      collect: (monitor) => ({
        isOver: monitor.isOver() && onDrop,
      }),
      drop: (dragItem) => {
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

  function attachRef(el: HTMLDivElement) {
    drag(el);
    drop(el);
  }

  if (systemNumber === "-1") {
    return (
      <div
        ref={attachRef}
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
          sizes={rem(128)}
          style={{
            opacity: "10%",
            objectFit: "contain",
            filter: "invert(0.9)",
          }}
          priority
        />
        {isOver ? (
          <div
            style={{
              borderRadius: "100%",
              position: "absolute",
              width: rem(4),
              height: rem(4),
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
          ref={attachRef}
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
            sizes={rem(128)}
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    }
    return (
      <div
        ref={attachRef}
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
          sizes={rem(128)}
          style={{ opacity: "10%", objectFit: "contain" }}
          priority
        />
        {isOver ? (
          <div
            style={{
              borderRadius: "100%",
              position: "absolute",
              width: rem(4),
              height: rem(4),
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
        ref={attachRef}
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
          sizes={rem(128)}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
        <div
          className="flexRow"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            fontSize: rem(28),
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
              width: rem(4),
              height: rem(4),
              backgroundColor: "white",
              boxShadow: "0 0 8px 8px white",
            }}
          ></div>
        ) : null}
      </div>
    );
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
      ref={attachRef}
      className={`flexRow ${styles.SystemImage}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        opacity: isDragging ? "25%" : "100%",
      }}
    >
      <NextImage
        className={classNames}
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        fill
        sizes={rem(128)}
        style={{ objectFit: "contain" }}
        priority={systemNumber === "18"}
      />
      <div
        className="flexRow"
        style={{
          width: "100%",
          height: "60%",
          top: 0,
          position: "absolute",
          fontSize: rem(18),
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
            width: rem(4),
            height: rem(4),
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
  mallice?: string | SystemId;

  dropOnly?: boolean;
  exploration?: boolean;
  riftWalker?: boolean;
}

export default function MapBuilder({
  mapString,
  updateMapString,
  mallice,
  dropOnly,
  exploration,
  riftWalker,
}: MapProps) {
  const shouldAddMecatol = !mapString.includes(" 18 ") && mallice !== "18";
  let updatedSystemTiles = mapString.split(" ");
  if (shouldAddMecatol) {
    updatedSystemTiles.unshift("18");
  }
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

  if (!riftWalker) {
    numRings += 1;
  }

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
          if (riftWalker && tile === "-1") {
            return null;
          }
          let canDrop = true;
          if (exploration) {
            if (tile !== "-1") {
              canDrop = false;
            }
            let hasSystemNeighbor = false;
            for (const direction of CUBE_DIRECTIONS) {
              const neighbor = cube_neighbor(cube, direction);
              spiral.forEach((cube, index) => {
                if (cube_equals(cube, neighbor)) {
                  const neighborTile = updatedSystemTiles[index];
                  if (neighborTile && neighborTile !== "-1") {
                    hasSystemNeighbor = true;
                  }
                }
              });
            }
            if (!hasSystemNeighbor) {
              canDrop = false;
            }
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
                index={index}
                systemNumber={tile}
                onDrop={
                  !canDrop
                    ? undefined
                    : (dragItem, dropItem) => {
                        updateMapString(dragItem, dropItem);
                      }
                }
                blockDrag={dropOnly}
              />
            </div>
          );
        })}
        {mallice ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              index={-2}
              systemNumber={getMalliceSystemNum(mallice)}
              blockDrag={
                !riftWalker || (mallice !== "PURGED" && mallice !== "81")
              }
              onDrop={
                !riftWalker || (mallice !== "PURGED" && mallice !== "81")
                  ? undefined
                  : (dragItem, dropItem) => {
                      updateMapString(dragItem, dropItem);
                    }
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
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
