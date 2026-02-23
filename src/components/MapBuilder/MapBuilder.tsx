import NextImage from "next/image";
import { use } from "react";
import { useDrag, useDrop } from "react-dnd";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import { DatabaseFnsContext } from "../../context/contexts";
import {
  isFactionHomeSystem,
  isHomeSystem,
  validSystemNumber,
} from "../../util/map";
import { Optional } from "../../util/types/types";
import { objectEntries, rem } from "../../util/util";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import styles from "./MapBuilder.module.scss";
import { Hex } from "./hexGrid";

interface PlanetValues {
  resources: number;
  influence: number;
}

interface NearbyValues {
  optimal: PlanetValues;
  total: PlanetValues;
  attributes: PlanetAttribute[];
}

const HEX_RATIO = 2 / Math.sqrt(3);

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

function hex_to_system(hex: Hex, spiral: Hex[], systems: string[]) {
  const index = spiral.findIndex((value) => value.equals(hex));
  if (index === -1) {
    return;
  }
  return systems[index];
}

function system_to_hex(system: string, spiral: Hex[], systems: string[]) {
  const index = systems.findIndex((value) => value === system);
  if (index === -1) {
    return;
  }
  return spiral[index];
}

function toSystemId(systemId: Optional<string>): Optional<SystemId> {
  if (!systemId) {
    return;
  }
  const subString = systemId.split(":")[0];
  if (!subString) {
    return;
  }
  if (subString.includes("A")) {
    return `${subString.split("A")[0]}A` as SystemId;
  }
  if (subString.includes("B")) {
    return `${subString.split("B")[0]}B` as SystemId;
  }
  return parseInt(subString) as SystemId;
}

function getSystemRotation(systemId: string): Optional<number> {
  let subString = systemId.split("A")[1];
  if (subString) {
    return parseInt(subString);
  }
  subString = systemId.split("B")[1];
  if (subString) {
    return parseInt(subString);
  }
}

function getNextHyperlane(dir: Direction) {
  switch (dir) {
    case "UP":
      return "TOP RIGHT";
    case "DOWN":
      return "BOTTOM LEFT";
    case "TOP LEFT":
      return "UP";
    case "BOTTOM LEFT":
      return "TOP LEFT";
    case "TOP RIGHT":
      return "BOTTOM RIGHT";
    case "BOTTOM RIGHT":
      return "DOWN";
  }
}

function rotateHyperlane(hyperlane: Hyperlane, rotation: Optional<number>) {
  if (!rotation) {
    return hyperlane;
  }
  const rotated: Hyperlane = hyperlane;
  for (let i = 0; i < rotation; i++) {
    rotated.a = getNextHyperlane(rotated.a);
    rotated.b = getNextHyperlane(rotated.b);
  }
  return rotated;
}

function getBaseSystem(
  system: string,
  baseSystems: Partial<Record<SystemId, BaseSystem>>,
): Optional<BaseSystem> {
  const systemId = toSystemId(system);
  if (!systemId) {
    return;
  }
  return baseSystems[systemId];
}

function getMatchingWormholeSystems(
  hex: Hex,
  spiral: Hex[],
  systems: string[],
  baseSystems: Partial<Record<SystemId, BaseSystem>>,
) {
  const systemString = hex.toSystem(spiral, systems);
  if (!systemString) {
    return [];
  }
  const baseSystem = getBaseSystem(systemString, baseSystems);
  const wormholes = baseSystem?.wormholes;
  if (!wormholes || wormholes.length === 0) {
    return [];
  }
  const adjacentSystems: string[] = [];
  for (const wormhole of wormholes) {
    for (const system of systems) {
      const baseSystem = getBaseSystem(system, baseSystems);
      const wormholes = baseSystem?.wormholes;
      if (wormholes?.includes(wormhole)) {
        adjacentSystems.push(system);
      }
    }
  }
  return adjacentSystems;
}

interface Neighbor {
  hex: Hex;
  // Which direction the neighbor was entered from.
  direction: Hex;
}

// TODO: Clean up this file.
function hex_reachable(
  start: Hex,
  movement: number,
  spiral: Hex[],
  systems: string[],
  baseSystems: Partial<Record<SystemId, BaseSystem>>,
) {
  const visited = new Set<string>();
  visited.add(JSON.stringify(start));
  const results: string[][] = [];
  const fringes: Hex[][] = [];
  fringes.push([start]);

  for (let i = 1; i < movement; i++) {
    const fringe = fringes[i - 1];
    // If we have nothing to explore, stop.
    if (!fringe || fringe.length === 0) {
      break;
    }
    for (const hex of fringe) {
      const wormholeSystems = getMatchingWormholeSystems(
        hex,
        spiral,
        systems,
        baseSystems,
      );
      for (const wormholeSystem of wormholeSystems) {
        const wormholeCube = system_to_hex(wormholeSystem, spiral, systems);
        if (!wormholeCube) {
          continue;
        }
        if (!visited.has(JSON.stringify(wormholeCube))) {
          visited.add(JSON.stringify(wormholeCube));
          const newResult = results[i] ?? [];
          newResult.push(wormholeSystem);
          results[i] = newResult;
          const newFringe = fringes[i] ?? [];
          newFringe.push(wormholeCube);
          fringes[i] = newFringe;
        }
      }

      const neighbors: Neighbor[] = [];
      for (const dir of Hex.directions()) {
        const neighbor = hex.neighbor(dir);
        neighbors.push({
          hex: neighbor,
          direction: dir,
        });
      }
      // Mostly just a safeguard in case of weird loops.
      let maxDepth = 1000;
      while (neighbors.length > 0 && maxDepth > 0) {
        const neighbor = neighbors.shift();
        maxDepth--;
        if (!neighbor) {
          break;
        }
        const system = neighbor.hex.toSystem(spiral, systems);

        // TODO: If system is hyperspace (and the direction is correct), need to check systems that are adjacent.
        const isBlocked = !system || system === "0" || system === "-1";
        if (isBlocked) {
          continue;
        }
        const systemId = toSystemId(system);
        if (systemId) {
          const baseSystem = baseSystems[systemId];
          if (baseSystem && baseSystem.type === "HYPERLANE") {
            visited.add(JSON.stringify(neighbor));
            const hexSide = Hex.hexToDirection(
              neighbor.direction,
              /* opposite= */ true,
            );
            const rotation = getSystemRotation(system);
            if (hexSide) {
              for (const lane of baseSystem.hyperlanes ?? []) {
                const hyperlane = rotateHyperlane(
                  structuredClone(lane),
                  rotation,
                );
                if (hyperlane.a === hexSide) {
                  const direction = Hex.directionToHex(hyperlane.b);
                  const nextNeighbor = neighbor.hex.neighbor(direction);
                  neighbors.push({
                    hex: nextNeighbor,
                    direction,
                  });
                } else if (hyperlane.b === hexSide) {
                  const direction = Hex.directionToHex(hyperlane.a);
                  const nextNeighbor = neighbor.hex.neighbor(direction);
                  neighbors.push({
                    hex: nextNeighbor,
                    direction,
                  });
                }
              }
            }
            continue;
          }
        }
        if (!visited.has(JSON.stringify(neighbor))) {
          visited.add(JSON.stringify(neighbor));
          const newResult = results[i] ?? [];
          newResult.push(system);
          results[i] = newResult;
          const newFringe = fringes[i] ?? [];
          newFringe.push(neighbor.hex);
          fringes[i] = newFringe;
        }
      }
    }
  }
  return results;
}

function buildFactionValues(
  spiral: Hex[],
  systems: string[],
  planets: Partial<Record<PlanetId, BasePlanet>>,
  baseSystems: Partial<Record<SystemId, BaseSystem>>,
) {
  const ownedSystems: Record<number, string[]> = {};
  spiral.forEach((hex, index) => {
    const currentSystem = systems[index];
    if (
      !currentSystem ||
      currentSystem === "-1" ||
      currentSystem === "0" ||
      isHomeSystem(currentSystem) ||
      currentSystem.includes("A") ||
      currentSystem.includes("B")
    ) {
      return;
    }
    const nearbySystems = hex_reachable(hex, 7, spiral, systems, baseSystems);
    for (let i = 1; i < 7; i++) {
      const ring = nearbySystems[i];
      if (!ring) {
        break;
      }
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
  const databaseFns = use(DatabaseFnsContext);
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

  const center = new Hex(0, 0, 0);
  const spiral = center.spiral(numRings);

  const basePlanets: Partial<Record<PlanetId, BasePlanet>> =
    databaseFns.getBaseValue("planets") ?? {};
  const baseSystems: Partial<Record<SystemId, BaseSystem>> =
    databaseFns.getBaseValue("systems") ?? {};

  const values = buildFactionValues(
    spiral,
    updatedSystemTiles,
    basePlanets,
    baseSystems,
  );

  return (
    <div className={styles.Map}>
      <div className={styles.MapBody}>
        {spiral.map((hex, index) => {
          const point = hex.toPixel(tilePercentage * HEX_RATIO);
          let tile = updatedSystemTiles[index];
          if (!tile) {
            tile = "-1";
          }
          if (riftWalker && tile === "-1") {
            return null;
          }
          const baseSystem = getBaseSystem(tile, baseSystems);
          let canDrop = true;
          let canDrag = !dropOnly;
          if (riftWalker) {
            if (baseSystem && baseSystem.type === "HYPERLANE") {
              canDrop = false;
              canDrag = false;
            }
          }
          if (exploration) {
            if (tile !== "-1") {
              canDrop = false;
            }
            let neighborSystems = 0;
            for (const direction of Hex.directions()) {
              const neighbor = hex.neighbor(direction);
              const neighborSystem = neighbor.toSystem(
                spiral,
                updatedSystemTiles,
              );
              if (neighborSystem) {
                if (nonHomeNeighbors && isFactionHomeSystem(neighborSystem)) {
                  continue;
                }
                const baseSystem = getBaseSystem(neighborSystem, baseSystems);
                if (baseSystem && baseSystem.type !== "HYPERLANE") {
                  neighborSystems++;
                }
              }
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
