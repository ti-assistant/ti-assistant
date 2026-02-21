import NextImage from "next/image";
import { useDrag, useDrop } from "react-dnd";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import {
  isFactionHomeSystem,
  isHomeSystem,
  validSystemNumber,
} from "../../util/map";
import { Optional } from "../../util/types/types";
import { objectEntries, rem } from "../../util/util";
import styles from "./MapBuilder.module.scss";
import { getPlanets } from "../../../server/data/planets";
import { useIntl } from "react-intl";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import { PlanetAttributes } from "../PlanetRow/PlanetRow";

interface Cube {
  q: number;
  r: number;
  s: number;
}

interface Point {
  x: number;
  y: number;
}

interface PlanetValues {
  resources: number;
  influence: number;
}

interface NearbyValues {
  optimal: PlanetValues;
  total: PlanetValues;
  attributes: PlanetAttribute[];
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

const IMPORTANT_ATTRIBUTES: Set<PlanetAttribute> = new Set([
  "blue-skip",
  "red-skip",
  "green-skip",
  "yellow-skip",
  "legendary",
]);

const EMPTY_NEARBY_VALUES: NearbyValues = {
  optimal: { resources: 0, influence: 0 },
  total: { resources: 0, influence: 0 },
  attributes: [],
} as const;

function computeNearbyValues(
  systems: string[],
  planets: Partial<Record<PlanetId, BasePlanet>>,
) {
  const nearbyValues: NearbyValues = structuredClone(EMPTY_NEARBY_VALUES);
  for (const system of systems) {
    let systemPlanets = Object.values(planets).filter((planet) => {
      if (!system) {
        return false;
      }
      if (system === "18" || system === "112") {
        return planet.system === 18 || planet.system === 112;
      }
      if (system === "82A" || system === "82B") {
        return planet.system === "82B" || planet.system === "82A";
      }
      if (typeof planet.system === "number") {
        return planet.system === parseInt(system);
      }
      return planet.system === system;
    });
    for (const planet of systemPlanets) {
      for (const attribute of planet.attributes) {
        if (IMPORTANT_ATTRIBUTES.has(attribute)) {
          nearbyValues.attributes.push(attribute);
        }
      }
      nearbyValues.total.resources += planet.resources;
      nearbyValues.total.influence += planet.influence;
      if (planet.resources > planet.influence) {
        nearbyValues.optimal.resources += planet.resources;
      } else if (planet.resources < planet.influence) {
        nearbyValues.optimal.influence += planet.influence;
      } else {
        nearbyValues.optimal.resources += planet.resources / 2;
        nearbyValues.optimal.influence += planet.influence / 2;
      }
    }
  }

  return nearbyValues;
}

export function SystemImage({
  index,
  systemNumber,
  onDrop,
  blockDrag,
  hideSystemNumbers = false,
  values,
}: {
  index: number;
  systemNumber: Optional<string>;
  onDrop?: (dragItem: any, dropItem: any) => void;
  blockDrag?: boolean;
  hideSystemNumbers?: boolean;
  values?: Record<number, NearbyValues>;
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
          sizes={rem(144)}
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
            sizes={rem(256)}
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
          sizes={rem(144)}
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
    const playerNum = parseInt(systemNumber.substring(1, 2));
    const playerValues: NearbyValues =
      (values ?? {})[playerNum] ?? structuredClone(EMPTY_NEARBY_VALUES);
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
          src={`/images/systems/ST_299.png`}
          alt={`Player Home System`}
          sizes={rem(256)}
          fill
          style={{ objectFit: "contain" }}
          priority
        />
        {hideSystemNumbers ? null : (
          <div
            className="flexColumn"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              fontSize: rem(28),
              textShadow: "0 0 4px black, 0 0 4px black",
              gap: 0,
            }}
          >
            <div
              className="flexRow"
              style={{
                fontSize: rem(20),
                textShadow: "0 0 4px black, 0 0 4px black",
              }}
            >
              {systemNumber}
            </div>
            <div
              className="flexRow"
              style={{
                backgroundColor: "var(--background-color)",
                height: rem(32),
                borderRadius: rem(8),
                gap: 0,
              }}
            >
              <ResourcesIcon
                resources={playerValues.optimal.resources}
                influence={playerValues.optimal.influence}
                height={32}
              />
              <ResourcesIcon
                resources={playerValues.total.resources}
                influence={playerValues.total.influence}
                height={32}
              />
            </div>
          </div>
        )}
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
      parseInt(systemNumber.split("A")[1] ?? "0"),
    );
    systemNumber = `${systemNumber.split("A")[0] ?? ""}A`;
  }
  if (systemNumber.includes("B") && systemNumber.split("B").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("B")[1] ?? "0"),
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
        sizes={rem(256)}
        style={{ objectFit: "contain" }}
        priority={systemNumber === "18"}
      />
      {hideSystemNumbers ? null : (
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
      )}
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
  requiredNeighbors?: number;
  nonHomeNeighbors?: boolean;
}

function cube_to_system(cube: Cube, spiral: Cube[], systems: string[]) {
  const index = spiral.findIndex((value) => cube_equals(value, cube));
  if (index === -1) {
    return;
  }
  return systems[index];
}

function system_to_cube(system: string, spiral: Cube[], systems: string[]) {
  const index = systems.findIndex((value) => value === system);
  if (index === -1) {
    return;
  }
  return spiral[index];
}

function hex_reachable(
  start: Cube,
  movement: number,
  spiral: Cube[],
  systems: string[],
) {
  const visited = new Set<string>();
  visited.add(JSON.stringify(start));
  const results: string[][] = [];
  const fringes: Cube[][] = [];
  fringes.push([start]);

  for (let i = 1; i < movement; i++) {
    const fringe = fringes[i - 1];
    // If we have nothing to explore, stop.
    if (!fringe || fringe.length === 0) {
      break;
    }
    for (const cube of fringe) {
      // TODO: If cube contains a wormhole, need to check other wormhole systems.
      for (const dir of CUBE_DIRECTIONS) {
        const neighbor = cube_neighbor(cube, dir);
        const system = cube_to_system(neighbor, spiral, systems);

        // TODO: If system is hyperspace (and the direction is correct), need to check systems that are adjacent.
        const isBlocked = !system || system === "0" || system === "-1";
        if (!visited.has(JSON.stringify(neighbor)) && !isBlocked) {
          visited.add(JSON.stringify(neighbor));
          const newResult = results[i] ?? [];
          newResult.push(system);
          results[i] = newResult;
          const newFringe = fringes[i] ?? [];
          newFringe.push(neighbor);
          fringes[i] = newFringe;
        }
      }
    }
    console.log("Visited", visited);
  }
  return results;
}

interface LocalValues {
  influence: number;
  resources: number;
}

function buildFactionValues(
  spiral: Cube[],
  systems: string[],
  planets: Partial<Record<PlanetId, BasePlanet>>,
) {
  const ownedSystems: Record<number, string[]> = {};
  spiral.forEach((cube, index) => {
    const currentSystem = systems[index];
    if (
      !currentSystem ||
      currentSystem === "-1" ||
      currentSystem === "0" ||
      isHomeSystem(currentSystem)
    ) {
      return;
    }
    console.log("Current", currentSystem);
    const nearbySystems = hex_reachable(cube, 7, spiral, systems);
    for (let i = 1; i < 7; i++) {
      const ring = nearbySystems[i];
      if (!ring) {
        break;
      }
      console.log("Ring", ring);
      const homeSystems = [];
      for (const system of ring) {
        if (isHomeSystem(system)) {
          homeSystems.push(system);
        }
      }
      if (homeSystems.length > 1) {
        break;
      }
      if (homeSystems.length === 1) {
        const homeSystem = homeSystems[0]?.substring(1, 2);
        if (homeSystem) {
          const playerNum = parseInt(homeSystem);
          const owned = ownedSystems[playerNum] ?? [];
          owned.push(currentSystem);
          ownedSystems[playerNum] = owned;
          break;
        }
      }
    }
  });

  const values: Record<number, NearbyValues> = {};
  for (const [playerNum, systems] of objectEntries(ownedSystems)) {
    values[playerNum] = computeNearbyValues(systems, planets);
  }
  return values;
}

export default function MapBuilder({
  mapString,
  updateMapString,
  mallice,
  dropOnly,
  exploration,
  riftWalker,
  requiredNeighbors = 0,
  nonHomeNeighbors = false,
}: MapProps) {
  let updatedSystemTiles = mapString.split(" ");
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      return updatedTile;
    }
    return tile;
  });

  const numTiles = updatedSystemTiles.length;
  let numRings = Math.ceil((3 + Math.sqrt(9 - 12 * (1 - numTiles))) / 6);

  const largestDimension = numRings * 2 - 1;
  const tilePercentage = 98 / largestDimension;

  if (!riftWalker) {
    numRings += 1;
  }

  const spiral = cubeSpiral(Cube(0, 0, 0), numRings);

  const intl = useIntl();
  const basePlanets = getPlanets(intl);

  const values = buildFactionValues(spiral, updatedSystemTiles, basePlanets);

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
          let canDrag = !dropOnly;
          if (riftWalker) {
            if (tile.includes("A") || tile.includes("B")) {
              canDrop = false;
              canDrag = false;
            }
          }
          if (exploration) {
            if (tile !== "-1") {
              canDrop = false;
            }
            let neighborSystems = 0;
            for (const direction of CUBE_DIRECTIONS) {
              const neighbor = cube_neighbor(cube, direction);
              spiral.forEach((cube, index) => {
                if (cube_equals(cube, neighbor)) {
                  const neighborTile = updatedSystemTiles[index];
                  if (
                    neighborTile &&
                    nonHomeNeighbors &&
                    isFactionHomeSystem(neighborTile)
                  ) {
                    return;
                  }
                  if (
                    neighborTile &&
                    neighborTile !== "-1" &&
                    !neighborTile.includes("A") &&
                    !neighborTile.includes("B")
                  ) {
                    neighborSystems++;
                  }
                }
              });
            }
            if (neighborSystems < requiredNeighbors) {
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
                blockDrag={!canDrag}
                hideSystemNumbers={exploration}
                values={values}
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
              values={values}
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
