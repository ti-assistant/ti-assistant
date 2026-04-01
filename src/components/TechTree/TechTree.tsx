"use client";

import { CSSProperties, use } from "react";
import { ModalContext } from "../../context/contexts";
import {
  useAbilities,
  useOptions,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import { useFaction } from "../../context/factionDataHooks";
import { Techs } from "../../context/techDataHooks";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { getReplacementTech, isTechPurged } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { Optional } from "../../util/types/types";
import { objectEntries, rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import { ModalContent } from "../Modal/Modal";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";
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

const UPGRADE_UNIT_ORDER: Partial<Record<UnitType, number>> = {
  Flagship: 0,
  "War Sun": 1,
  Cruiser: 2,
  Dreadnought: 3,
  Destroyer: 4,
  Mech: 5,
  PDS: 6,
  Carrier: 7,
  Fighter: 8,
  Infantry: 9,
  "Space Dock": 10,
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
  const options = useOptions();
  let style: CSSProperties;
  let rowStyle: CSSProperties;
  const layers: TechTreeElement[][] = [];
  const tfGame = options.expansions.includes("TWILIGHTS FALL");
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
            (tech.faction === factionId || ownedTechs.has(tech.id)),
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
            color: isPurged
              ? "var(--passed-text)"
              : getTechTypeColor(tech.type),
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
      const color = "var(--foreground-color)";
      if (tfGame) {
        return <TFUpgradeTree factionId={factionId} />;
      }
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
          color: isPurged ? "var(--passed-text)" : color,
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
      if (tfGame) {
        return <TFAbilityTree factionId={factionId} type={type} />;
      }
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
            color: isPurged
              ? "var(--passed-text)"
              : getTechTypeColor(tech.type),
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

function TFUpgradeTree({ factionId }: { factionId: FactionId }) {
  const viewOnly = useViewOnly();
  const upgrades = useUpgrades();
  let style: CSSProperties;
  let rowStyle: CSSProperties;
  const layers: UpgradeElement[][] = [];
  const upgradesByUnitType: Partial<Record<UnitType, TFUnitUpgrade[]>> =
    Object.values(upgrades).reduce(
      (obj: Partial<Record<UnitType, TFUnitUpgrade[]>>, upgrade) => {
        const group = obj[upgrade.unitType] ?? [];
        group.push(upgrade);
        obj[upgrade.unitType] = group;
        return obj;
      },
      {},
    );
  const sortedUpgrades = objectEntries(upgradesByUnitType).sort((a, b) => {
    return (UPGRADE_UNIT_ORDER[a[0]] ?? 0) - (UPGRADE_UNIT_ORDER[b[0]] ?? 0);
  });
  let level = 0;
  for (const [type, upgrades] of sortedUpgrades) {
    let owned: Optional<TFUnitUpgrade>;
    let allTaken = true;
    for (const upgrade of upgrades) {
      if (!upgrade.owner) {
        allTaken = false;
      }
      if (upgrade.owner === factionId) {
        allTaken = false;
        owned = upgrade;
        break;
      }
    }
    const row = layers[level] ?? [];
    row.push({
      allTaken,
      owned,
      unitType: type,
    });
    layers[level] = row;
    if (type === "Flagship" || type === "PDS" || type === "Cruiser") {
      level++;
    }
  }

  style = {
    justifyContent: "flex-start",
    gap: rem(2),
  };
  rowStyle = { justifyContent: "flex-start", paddingBottom: 0 };
  return (
    <UpgradeTreeContent
      layers={layers}
      style={style}
      rowStyle={rowStyle}
      viewOnly={viewOnly}
    />
  );
}

function TFAbilityTree({
  factionId,
  type,
}: {
  factionId: FactionId;
  type: TechType;
}) {
  const abilities = useAbilities();
  let style: CSSProperties = {
    justifyContent: "center",
  };
  let rowStyle: CSSProperties;
  const layers: TFAbility[][] = [];
  const sortedAbilities = Object.values(abilities)
    .filter((ability) => ability.type === type && ability.owner === factionId)
    .sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
  let level = 0;
  for (const ability of sortedAbilities) {
    const row = layers[level] ?? [];
    row.push(ability);
    layers[level] = row;
    if (row.length % 2 === 0) {
      level++;
    }
  }

  style = {
    justifyContent: "center",
    gap: rem(2),
    minWidth: rem(10),
  };
  rowStyle = { paddingBottom: 0 };
  return (
    <AbilityTreeContent
      layers={layers}
      style={style}
      rowStyle={rowStyle}
      type={type}
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
  const dataUpdate = useDataUpdate();

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
                  border: `1px solid var(--foreground-color)`,
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
                            dataUpdate(
                              Events.RemoveTechEvent(factionId, tech.id),
                            );
                          } else {
                            dataUpdate(Events.AddTechEvent(factionId, tech.id));
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

interface UpgradeElement {
  unitType: UnitType;
  owned?: TFUnitUpgrade;
  allTaken: boolean;
}

function UpgradeTreeContent({
  layers,
  style = {},
  rowStyle = {},
  viewOnly,
}: {
  layers: UpgradeElement[][];
  style?: CSSProperties;
  rowStyle?: CSSProperties;
  viewOnly?: boolean;
}) {
  const { openModal } = use(ModalContext);

  return (
    <div className={styles.TechTree} style={style}>
      {layers.map((upgrades, index) => {
        return (
          <div key={index} className={styles.TechTreeRow} style={rowStyle}>
            {upgrades.map((upgrade) => {
              return (
                <div
                  key={upgrade.unitType}
                  title={upgrade.owned?.name}
                  className={`${styles.TechTreeElement} ${
                    !upgrade.owned ? styles.viewOnly : ""
                  }`}
                  style={{
                    border: `1px solid ${upgrade.allTaken ? "var(--passed-text)" : "var(--foreground-color)"}`,
                    backgroundColor: !!upgrade.owned
                      ? "var(--foreground-color)"
                      : undefined,
                  }}
                  onClick={
                    !upgrade.owned
                      ? undefined
                      : () => {
                          if (!upgrade.owned) {
                            return;
                          }
                          openModal(
                            <ModalContent
                              title={
                                <div
                                  className="flexRow"
                                  style={{ fontSize: rem(40), gap: rem(20) }}
                                >
                                  {upgrade.owned.name}
                                  <UnitIcon
                                    type={upgrade.unitType}
                                    size="1em"
                                  />
                                </div>
                              }
                            >
                              <div className={styles.infoContent}>
                                <div
                                  className="myriadPro flexColumn"
                                  style={{
                                    width: "100%",
                                    padding: rem(4),
                                    whiteSpace: "pre-line",
                                    textAlign: "center",
                                    fontSize: rem(32),
                                    gap: rem(32),
                                  }}
                                >
                                  <FormattedDescription
                                    description={upgrade.owned.description}
                                  />
                                  <div
                                    className="flexColumn"
                                    style={{ width: "100%" }}
                                  >
                                    {upgrade.owned.abilities.length > 0 ? (
                                      <div
                                        className={styles.UpgradeTechAbilities}
                                        style={{
                                          whiteSpace: "nowrap",
                                          fontFamily: "var(--main-font)",
                                          paddingLeft: rem(8),
                                          rowGap: rem(2),
                                          width: "100%",
                                        }}
                                      >
                                        {upgrade.owned.abilities.map(
                                          (ability) => {
                                            return (
                                              <div key={ability}>
                                                {ability.toUpperCase()}
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    ) : null}
                                    <UnitStats
                                      stats={upgrade.owned.stats}
                                      type={upgrade.unitType}
                                      className={styles.UnitStats}
                                    />
                                  </div>
                                </div>
                              </div>
                            </ModalContent>,
                          );
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

function AbilityTreeContent({
  layers,
  style = {},
  rowStyle = {},
  type,
}: {
  layers: TFAbility[][];
  style?: CSSProperties;
  rowStyle?: CSSProperties;
  type: TechType;
}) {
  const { openModal } = use(ModalContext);

  const color = getTechTypeColor(type);

  return (
    <div className={styles.TechTree} style={style}>
      {layers.map((abilities, index) => {
        return (
          <div key={index} className={styles.TechTreeRow} style={rowStyle}>
            {abilities.map((ability) => {
              return (
                <div
                  key={ability.id}
                  title={ability.name}
                  className={styles.TechTreeElement}
                  style={{
                    border: `1px solid ${color}`,
                    backgroundColor: color,
                  }}
                  onClick={() => {
                    openModal(
                      <ModalContent
                        title={
                          <div
                            className="flexRow"
                            style={{ fontSize: rem(40), gap: rem(20) }}
                          >
                            {ability.name}
                          </div>
                        }
                      >
                        <div className={styles.infoContent}>
                          <div
                            className="myriadPro flexColumn"
                            style={{
                              width: "100%",
                              padding: rem(4),
                              whiteSpace: "pre-line",
                              textAlign: "center",
                              fontSize: rem(32),
                              gap: rem(32),
                            }}
                          >
                            <FormattedDescription
                              description={ability.description}
                            />
                          </div>
                        </div>
                      </ModalContent>,
                    );
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
