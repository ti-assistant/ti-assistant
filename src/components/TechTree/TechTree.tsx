import { CSSProperties } from "react";
import { useGameId } from "../../context/dataHooks";
import { useFaction } from "../../context/factionDataHooks";
import { Techs } from "../../context/techDataHooks";
import { addTechAsync, removeTechAsync } from "../../dynamic/api";
import { getReplacementTech, isTechPurged } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
import styles from "./TechTree.module.scss";

const TYPE_ORDER: Record<TechType, number> = {
  GREEN: 1,
  BLUE: 2,
  YELLOW: 3,
  RED: 4,
  UPGRADE: 5,
  OTHER: 6,
} as const;

const UPGRADE_TECH_ORDER: Partial<Record<TechId, number>> = {
  "War Sun": 1,
  "Cruiser II": 2,
  "Dreadnought II": 3,
  "Destroyer II": 4,
  "PDS II": 5,
  "Carrier II": 6,
  "Fighter II": 7,
  "Infantry II": 8,
  "Space Dock II": 9,
} as const;

export default function TechTree({
  factionId,
  techs,
  ownedTechs,
  type,
  viewOnly,
}: {
  factionId: FactionId;
  techs: Techs;
  ownedTechs: Set<TechId>;
  type: TechType | "FACTION";
  viewOnly?: boolean;
}) {
  const faction = useFaction(factionId);
  let style: CSSProperties;
  let rowStyle: CSSProperties;
  const layers: TechTreeElement[][] = [];
  switch (type) {
    case "FACTION": {
      style = {
        height: "100%",
        justifyContent: "center",
        gap: rem(4),
      };
      rowStyle = { paddingBottom: 0 };
      let factionTechs = Object.values(techs)
        .filter(
          (tech) =>
            tech.faction &&
            (tech.faction === factionId || ownedTechs.has(tech.id))
        )
        .sort((a, b) => {
          if (a.type === b.type) {
            if (a.type === "UPGRADE") {
              return a.name > b.name ? 1 : -1;
            }
            return a.prereqs.length > b.prereqs.length ? 1 : -1;
          }
          return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
        });
      for (const tech of factionTechs) {
        const isPurged = faction ? isTechPurged(faction, tech) : false;
        const level: TechTreeElement[] = [
          {
            id: tech.id,
            name: tech.name,
            filled: ownedTechs.has(tech.id),
            color: isPurged ? "#555" : getTechTypeColor(tech.type),
            purged: isPurged,
          },
        ];
        layers.push(level);
      }

      while (layers.length < 2) {
        layers.push([]);
      }
      break;
    }
    case "UPGRADE": {
      style = {
        justifyContent: "flex-start",
        gap: rem(2),
      };
      rowStyle = { justifyContent: "flex-start", paddingBottom: 0 };
      const color = "#ccc";
      const sortedUpgrades = Object.values(techs)
        .filter((tech) => tech.type === type)
        .filter((tech) => !tech.faction)
        .sort((a, b) => {
          return (
            (UPGRADE_TECH_ORDER[a.id] ?? 0) - (UPGRADE_TECH_ORDER[b.id] ?? 0)
          );
        });
      let level = 0;
      for (const upgrade of sortedUpgrades) {
        const replacement = getReplacementTech(factionId, upgrade.id);
        const replacementTech = replacement ? techs[replacement] : undefined;
        let filled = replacement
          ? ownedTechs.has(replacement)
          : ownedTechs.has(upgrade.id);
        const isPurged = faction
          ? replacementTech
            ? isTechPurged(faction, replacementTech)
            : isTechPurged(faction, upgrade)
          : false;
        const row = layers[level] ?? [];
        row.push({
          id: replacement ?? upgrade.id,
          name: replacementTech?.name ?? upgrade.name,
          filled,
          color: isPurged ? "#555" : color,
          purged: isPurged,
        });
        layers[level] = row;
        if (upgrade.id === "Cruiser II" || upgrade.id === "PDS II") {
          level++;
        }
      }
      break;
    }
    default: {
      style = {};
      rowStyle = {};
      Object.values(techs)
        .filter((tech) => tech.type === type)
        .filter((tech) => !tech.faction)
        .forEach((tech) => {
          const isPurged = faction ? isTechPurged(faction, tech) : false;
          const prereqs = layers[tech.prereqs.length] ?? [];
          const element: TechTreeElement = {
            id: tech.id,
            name: tech.name,
            filled: ownedTechs.has(tech.id),
            color: isPurged ? "#555" : getTechTypeColor(tech.type),
            purged: isPurged,
          };
          prereqs.push(element);
          prereqs.sort((a, _) => {
            const aTech = techs[a.id];
            if (!aTech) {
              return -1;
            }
            if (aTech.expansion === "POK") {
              return 1;
            }
            return -1;
          });
          layers[tech.prereqs.length] = prereqs;
        });
      break;
    }
  }

  return (
    <TechTreeContent
      factionId={factionId}
      layers={layers}
      style={style}
      rowStyle={rowStyle}
      viewOnly={viewOnly}
    />
  );
}

interface DummyTech {
  filled: boolean;
  id: TechId;
}

export function DummyTechTree({}) {
  const techsByPrereq: Record<number, DummyTech[]> = {
    0: [
      {
        filled: false,
        id: "Plasma Scoring",
      },
      {
        filled: true,
        id: "AI Development Algorithm",
      },
    ],
    1: [
      {
        filled: true,
        id: "Magen Defense Grid",
      },
      {
        filled: false,
        id: "Self Assembly Routines",
      },
    ],
    2: [
      {
        filled: false,
        id: "Duranium Armor",
      },
    ],
    3: [
      {
        filled: false,
        id: "Assault Cannon",
      },
    ],
  };

  const color = getTechTypeColor("GREEN");

  return (
    <div className={styles.TechTree}>
      {objectEntries(techsByPrereq).map(([num, techs]) => {
        return (
          <div key={num} className={styles.TechTreeRow}>
            {techs.map((tech) => {
              const filled = tech.filled;
              return (
                <div
                  key={tech.id}
                  title={tech.id}
                  className={`${styles.TechTreeElement} ${styles.viewOnly}`}
                  style={{
                    border: `1px solid ${color}`,
                    backgroundColor: filled ? color : undefined,
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

interface TechTreeElement {
  id: TechId;
  name: string;
  color: string;
  filled: boolean;
  purged: boolean;
}

function TechTreeContent({
  factionId,
  layers,
  style = {},
  rowStyle = {},
  viewOnly,
}: {
  factionId: FactionId;
  layers: TechTreeElement[][];
  style?: CSSProperties;
  rowStyle?: CSSProperties;
  viewOnly?: boolean;
}) {
  const gameId = useGameId();

  return (
    <div className={styles.TechTree} style={style}>
      {layers.map((techs, index) => {
        // Special case for Nekro Virus faction techs
        if (techs.length === 0) {
          return (
            <div key={index} className={styles.TechTreeRow} style={rowStyle}>
              <div
                className={styles.TechTreeElement}
                title="Valefar Assimilator"
                style={{
                  border: `1px solid #ccc`,
                  cursor: "unset",
                }}
              ></div>
            </div>
          );
        }
        return (
          <div key={index} className={styles.TechTreeRow} style={rowStyle}>
            {techs.map((tech) => {
              return (
                <div
                  key={tech.id}
                  title={tech.name}
                  className={`${styles.TechTreeElement} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                  style={{
                    border: `1px solid ${tech.color}`,
                    backgroundColor:
                      tech.filled && !tech.purged ? tech.color : undefined,
                    cursor: tech.purged ? "default" : undefined,
                  }}
                  onClick={
                    viewOnly || tech.purged
                      ? undefined
                      : () => {
                          if (tech.filled) {
                            removeTechAsync(gameId, factionId, tech.id);
                          } else {
                            addTechAsync(gameId, factionId, tech.id);
                          }
                        }
                  }
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
