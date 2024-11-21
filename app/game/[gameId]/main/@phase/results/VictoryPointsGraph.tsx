import { useMemo, useState } from "react";
import Toggle from "../../../../../../src/components/Toggle/Toggle";
import { useFactions } from "../../../../../../src/context/dataHooks";
import { getFactionColor } from "../../../../../../src/util/factions";
import {
  objectEntries,
  objectKeys,
  rem,
} from "../../../../../../src/util/util";
import Graph, { Line } from "./Graph";

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

export function VictoryPointsGraph({
  rounds,
}: {
  rounds: Record<number, RoundInfo>;
}) {
  const factions = useFactions();

  const [types, setTypes] = useState<Set<ObjectiveType>>(
    new Set(["STAGE ONE", "STAGE TWO", "SECRET", "OTHER"])
  );

  const numRounds = objectKeys(rounds).length;
  const maxVPs = Object.values(rounds).reduce((max, curr) => {
    return Math.max(
      max,
      Object.values(curr.victoryPoints).reduce((innerMax, innerCurr) => {
        return Math.max(
          innerMax,
          objectEntries(innerCurr).reduce((total, [type, vps]) => {
            return total + vps;
          }, 0)
        );
      }, 0)
    );
  }, 0);
  const minVPs = Object.values(rounds).reduce((max, curr) => {
    return Math.min(
      max,
      Object.values(curr.victoryPoints).reduce((innerMax, innerCurr) => {
        return Math.min(
          innerMax,
          objectEntries(innerCurr).reduce((total, [type, vps]) => {
            return total + vps;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const lines: Line[] = useMemo(() => {
    const factionLines: Partial<Record<FactionId, Line>> = {};
    for (const [roundNum, round] of objectEntries(rounds)) {
      for (const [factionId, vps] of objectEntries(round.victoryPoints)) {
        const line = factionLines[factionId] ?? {
          color: getFactionColor(factions[factionId]),
          points: [],
        };
        const points = objectEntries(vps).reduce((total, [type, num]) => {
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
  }, [types, rounds, factions]);
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
              selected={types.has("STAGE ONE")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("STAGE ONE");
                  } else {
                    newSet.add("STAGE ONE");
                  }
                  return newSet;
                });
              }}
            >
              Stage I
            </Toggle>
            <Toggle
              selected={types.has("STAGE TWO")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("STAGE TWO");
                  } else {
                    newSet.add("STAGE TWO");
                  }
                  return newSet;
                });
              }}
            >
              Stage II
            </Toggle>
            <Toggle
              selected={types.has("SECRET")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("SECRET");
                  } else {
                    newSet.add("SECRET");
                  }
                  return newSet;
                });
              }}
            >
              Secrets
            </Toggle>
            <Toggle
              selected={types.has("OTHER")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("OTHER");
                  } else {
                    newSet.add("OTHER");
                  }
                  return newSet;
                });
              }}
            >
              Other
            </Toggle>
          </div>
          <Graph
            xAxis={{ min: 0, max: numRounds - 1 }}
            yAxis={{ max: maxVPs, min: minVPs }}
            lines={lines}
          />
        </div>
      </div>
      <div className="flexRow" style={{ width: "100%" }}>
        Rounds
      </div>
    </>
  );
}
