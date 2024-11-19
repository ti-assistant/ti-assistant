import { useMemo, useState } from "react";
import TechIcon from "../../../../../../src/components/TechIcon/TechIcon";
import Toggle from "../../../../../../src/components/Toggle/Toggle";
import { useFactions } from "../../../../../../src/context/dataHooks";
import { getFactionColor } from "../../../../../../src/util/factions";
import { Optional } from "../../../../../../src/util/types/types";
import {
  objectEntries,
  objectKeys,
  rem,
} from "../../../../../../src/util/util";
import Graph, { Line } from "./Graph";

export function getTechCountsByType(
  techs: Partial<Record<TechId, Tech>>,
  techList: Optional<TechId[]>
) {
  return {
    BLUE: getTechsOfType(techs, techList, "BLUE"),
    GREEN: getTechsOfType(techs, techList, "GREEN"),
    RED: getTechsOfType(techs, techList, "RED"),
    YELLOW: getTechsOfType(techs, techList, "YELLOW"),
    UPGRADE: getTechsOfType(techs, techList, "UPGRADE"),
  };
}

function getTechsOfType(
  techs: Partial<Record<TechId, Tech>>,
  techList: Optional<TechId[]>,
  type: TechType
) {
  if (!techList) {
    return 0;
  }
  let techCount = 0;
  for (const techId of techList) {
    const tech = techs[techId];
    if (!tech || tech.type !== type) {
      continue;
    }
    techCount++;
  }
  return techCount;
}

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

export default function TechGraph({
  rounds,
}: {
  rounds: Record<number, RoundInfo>;
}) {
  const factions = useFactions();

  const [types, setTypes] = useState<Set<TechType>>(
    new Set(["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"])
  );

  const numRounds = objectKeys(rounds).length;
  const maxTechs = Object.values(rounds).reduce((max, curr) => {
    return Math.max(
      max,
      Object.values(curr.techs).reduce((innerMax, innerCurr) => {
        return Math.max(
          innerMax,
          objectEntries(innerCurr).reduce((total, [type, numTechs]) => {
            return total + numTechs;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const lines: Line[] = useMemo(() => {
    const factionLines: Partial<Record<FactionId, Line>> = {};
    for (const [roundNum, round] of objectEntries(rounds)) {
      for (const [factionId, techs] of objectEntries(round.techs)) {
        const line = factionLines[factionId] ?? {
          color: getFactionColor(factions[factionId]),
          points: [],
        };
        const points = objectEntries(techs).reduce((total, [type, num]) => {
          if (!types.has(type)) {
            return total;
          }
          return total + num;
        }, 0);
        line.points.push({ x: roundNum, y: points });
        factionLines[factionId] = line;
      }
    }
    return Object.values(factionLines);
  }, [types, rounds]);
  return (
    <>
      <div
        className="flexColumn"
        style={{
          width: "fit-content",
          height: rem(450),
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div
          className="flexRow"
          style={{ width: "fit-content", height: "100%" }}
        >
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <Toggle
              selected={types.has("GREEN")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("GREEN");
                  } else {
                    newSet.add("GREEN");
                  }
                  return newSet;
                });
              }}
            >
              <TechIcon size={16} type="GREEN" />
            </Toggle>
            <Toggle
              selected={types.has("BLUE")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("BLUE");
                  } else {
                    newSet.add("BLUE");
                  }
                  return newSet;
                });
              }}
            >
              <TechIcon size={16} type="BLUE" />
            </Toggle>
            <Toggle
              selected={types.has("YELLOW")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("YELLOW");
                  } else {
                    newSet.add("YELLOW");
                  }
                  return newSet;
                });
              }}
            >
              <TechIcon size={16} type="YELLOW" />
            </Toggle>
            <Toggle
              selected={types.has("RED")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("RED");
                  } else {
                    newSet.add("RED");
                  }
                  return newSet;
                });
              }}
            >
              <TechIcon size={16} type="RED" />
            </Toggle>
            <Toggle
              selected={types.has("UPGRADE")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("UPGRADE");
                  } else {
                    newSet.add("UPGRADE");
                  }
                  return newSet;
                });
              }}
            >
              Upgrade
            </Toggle>
          </div>
          <Graph xAxis={numRounds - 1} yAxis={maxTechs} lines={lines} />
        </div>
      </div>
      <div className="flexRow" style={{ width: "100%" }}>
        Rounds
      </div>
    </>
  );
}
