import { useRouter } from "next/router";
import { TechRow, WrappedTechIcon } from "../TechRow";
import { Faction } from "../util/api/factions";
import { Tech, TechType, hasTech, isTechReplaced } from "../util/api/techs";
import { getTechTypeColor, sortTechs } from "../util/techs";
import { FullFactionSymbol } from "../FactionCard";
import { responsivePixels } from "../util/util";
import React, { CSSProperties, useState } from "react";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { Selector } from "../Selector";
import styles from "./TechPanel.module.scss";
import { useGameData } from "../data/GameData";
import { addTech, removeTech } from "../util/api/addTech";

function FactionTechSection({ openedByDefault }: { openedByDefault: boolean }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "techs"]);
  const factions = gameData.factions;
  const techs = gameData.techs;

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.faction && !!(factions ?? {})[tech.faction]
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions ?? {});
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const nekroFactionTechs = Object.keys(
    (factions ?? {})["Nekro Virus"]?.techs ?? {}
  ).filter((tech) => {
    const techObj = (techs ?? {})[tech];
    if (!techObj) {
      return false;
    }
    return !!techObj.faction;
  });
  const availableNekroTechs = Object.entries(techs ?? {})
    .filter(([techId, tech]) => {
      const isResearched = orderedFactions.reduce((isResearched, faction) => {
        return isResearched || hasTech(faction, tech.name);
      }, false);
      return (
        isResearched &&
        tech.faction &&
        !!(factions ?? {})[tech.faction] &&
        !nekroFactionTechs.includes(techId) &&
        techId !== "IIHQ Modernization"
      );
    })
    .map(([_, tech]) => tech.name);

  return (
    <div className={styles.factionTechsColumn}>
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        Faction Techs
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {orderedFactions.map((faction) => {
            const factionTechs = typedTechs.filter(
              (tech) => tech.faction === faction.name
            );

            return (
              <LabeledDiv
                key={faction.name}
                label={getFactionName(faction)}
                color={getFactionColor(faction)}
                noBlur
                opts={{ fixedWidth: true }}
              >
                <div
                  className="flexRow"
                  style={{
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "90%",
                      position: "absolute",
                      aspectRatio: 1,
                      opacity: 0.3,
                    }}
                  >
                    <FullFactionSymbol faction={faction.name} />
                  </div>
                </div>
                <div
                  className="flexColumn"
                  style={{
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {faction.name === "Nekro Virus" ? (
                    <>
                      <Selector
                        buttonStyle={{ fontSize: responsivePixels(14) }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs}
                        toggleItem={(techName, add) => {
                          if (!gameid) {
                            return;
                          }
                          if (add) {
                            addTech(gameid, faction.name, techName);
                          } else {
                            removeTech(gameid, faction.name, techName);
                          }
                        }}
                        renderItem={(techName) => {
                          const tech = (techs ?? {})[techName];
                          if (!tech || !gameid) {
                            return null;
                          }
                          return (
                            <div
                              className={
                                styles.factionTechRow + " " + styles.selected
                              }
                              onClick={() =>
                                removeTech(gameid, faction.name, techName)
                              }
                            >
                              <TechRow
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechs[0]}
                      />
                      <Selector
                        buttonStyle={{ fontSize: responsivePixels(14) }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs}
                        toggleItem={(techName, add) => {
                          if (!gameid) {
                            return;
                          }
                          if (add) {
                            addTech(gameid, faction.name, techName);
                          } else {
                            removeTech(gameid, faction.name, techName);
                          }
                        }}
                        renderItem={(techName) => {
                          const tech = (techs ?? {})[techName];
                          if (!tech || !gameid) {
                            return null;
                          }
                          return (
                            <div
                              className={
                                styles.factionTechRow + " " + styles.selected
                              }
                              onClick={() =>
                                removeTech(gameid, faction.name, techName)
                              }
                            >
                              <TechRow
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechs[1]}
                      />
                    </>
                  ) : (
                    factionTechs.map((tech) => {
                      const factionHasTech = hasTech(faction, tech.name);
                      return (
                        <div
                          key={tech.name}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (factionHasTech) {
                              removeTech(gameid, faction.name, tech.name);
                            } else {
                              addTech(gameid, faction.name, tech.name);
                            }
                          }}
                          style={{ maxWidth: "100%" }}
                        >
                          <TechRow
                            className={
                              styles.factionTechRow +
                              " " +
                              (factionHasTech ? styles.selected : "")
                            }
                            tech={tech}
                            opts={{
                              hideSymbols: true,
                              hideIcon: true,
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </LabeledDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const TECH_TITLES: Record<TechType, string> = {
  BLUE: "Propulsion",
  GREEN: "Biotic",
  YELLOW: "Cybernetic",
  RED: "Warfare",
  UPGRADE: "Unit Upgrades",
};

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

function TechUpdateRow({
  tech,
  orderedFactions,
}: {
  tech: Tech;
  orderedFactions: Faction[];
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const numFactions = orderedFactions.length;

  const isResearched = orderedFactions.reduce((isResearched, faction) => {
    return isResearched || hasTech(faction, tech.name);
  }, false);

  return (
    <React.Fragment>
      <TechRow tech={tech} opts={{ hideSymbols: true, fade: !isResearched }} />
      <div
        className={styles.factionIconRow}
        style={
          {
            "--num-factions": numFactions,
          } as NumFactionsCSS
        }
      >
        {Object.values(orderedFactions).map((faction) => {
          const factionHasTech = hasTech(faction, tech.name);
          if (isTechReplaced(faction.name, tech.name)) {
            return <div key={faction.name}></div>;
          }
          return (
            <div
              key={faction.name}
              className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                if (factionHasTech) {
                  removeTech(gameid, faction.name, tech.name);
                } else {
                  addTech(gameid, faction.name, tech.name);
                }
              }}
            >
              <div
                className={`
                  ${styles.factionIcon} ${
                  factionHasTech ? styles.selected : ""
                }`}
                style={
                  {
                    "--color": getFactionColor(faction),
                  } as ExtendedCSS
                }
              >
                <FullFactionSymbol faction={faction.name} />
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function TechSection({
  type,
  openedByDefault = false,
}: {
  type: TechType;
  openedByDefault?: boolean;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "techs"]);
  const factions = gameData.factions;
  const techs = gameData.techs;

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === type && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions ?? {});
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <div
      className={styles.techColumn}
      style={
        {
          "--color": getTechTypeColor(type),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <WrappedTechIcon type={type} size={20} />
        {TECH_TITLES[type]}
        <WrappedTechIcon type={type} size={20} />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.name}
                tech={tech}
                orderedFactions={orderedFactions}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UpgradeTechSection({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "techs"]);
  const factions = gameData.factions;
  const techs = gameData.techs;

  const [collapsed, setCollapsed] = useState(true);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === "UPGRADE" && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions ?? {});
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <div className={`${styles.techColumn} ${styles.lastColumn}`}>
      <div
        className="centered largeFont"
        onClick={() => setCollapsed(!collapsed)}
      >
        {TECH_TITLES["UPGRADE"]}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.name}
                tech={tech}
                orderedFactions={orderedFactions}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TechPanel({}) {
  return (
    <div className={styles.techGrid}>
      <FactionTechSection openedByDefault />
      <TechSection type="BLUE" />
      <TechSection type="GREEN" />
      <TechSection type="RED" />
      <TechSection type="YELLOW" />
      <UpgradeTechSection />
    </div>
  );
}
