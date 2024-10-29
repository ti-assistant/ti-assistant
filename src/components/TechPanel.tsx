import React, { CSSProperties, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TechRow } from "../TechRow";
import { GameIdContext } from "../context/Context";
import { useFactions, useTechs } from "../context/dataHooks";
import { addTechAsync, removeTechAsync } from "../dynamic/api";
import { hasTech, isTechReplaced } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { techTypeString } from "../util/strings";
import { getTechTypeColor, sortTechs } from "../util/techs";
import { objectKeys, rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import { Selector } from "./Selector/Selector";
import TechIcon from "./TechIcon/TechIcon";
import styles from "./TechPanel.module.scss";
import TechSelectHoverMenu from "./TechSelectHoverMenu/TechSelectHoverMenu";
import { FullTechSummary } from "./TechSummary/TechSummary";

function FactionTechSection({
  openedByDefault,
  viewOnly,
}: {
  openedByDefault: boolean;
  viewOnly?: boolean;
}) {
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const techs = useTechs();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs).filter(
    (tech) => tech.faction && !!factions[tech.faction]
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
  orderedFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const nekroFactionTechIds = Object.keys(factions["Nekro Virus"]?.techs ?? {})
    .filter((id) => {
      const techId = id as TechId;
      const techObj = (techs ?? {})[techId];
      if (!techObj) {
        return false;
      }
      return !!techObj.faction;
    })
    .map((id) => id as TechId);
  const availableNekroTechs = Object.values(techs ?? {}).filter((tech) => {
    const isResearched = orderedFactions.reduce((isResearched, faction) => {
      return isResearched || hasTech(faction, tech.id);
    }, false);
    return (
      isResearched &&
      tech.faction &&
      !!factions[tech.faction] &&
      tech.id !== "IIHQ Modernization"
    );
  });

  return (
    <div className={styles.factionTechsColumn}>
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FormattedMessage
          id="yctdL8"
          defaultMessage="Faction Techs"
          description="Header for a section listing out various faction technologies."
        />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {orderedFactions.map((faction) => {
            const factionTechs = typedTechs.filter(
              (tech) => tech.faction === faction.id
            );

            return (
              <LabeledDiv
                key={faction.id}
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
                    <FactionIcon factionId={faction.id} size="100%" />
                  </div>
                </div>
                <div
                  className="flexColumn"
                  style={{
                    gap: rem(4),
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {faction.id === "Nekro Virus" ? (
                    <>
                      <Selector
                        buttonStyle={{ fontSize: rem(14) }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[1]
                        )}
                        toggleItem={(techId, add) => {
                          if (viewOnly) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, faction.id, techId);
                          } else {
                            removeTechAsync(gameId, faction.id, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          const tech = (techs ?? {})[techId];
                          if (!tech || !gameId) {
                            return null;
                          }
                          return (
                            <div
                              onClick={
                                viewOnly
                                  ? undefined
                                  : () =>
                                      removeTechAsync(
                                        gameId,
                                        faction.id,
                                        techId
                                      )
                              }
                            >
                              <TechRow
                                className={`${styles.factionTechRow} ${
                                  styles.selected
                                } ${viewOnly ? styles.viewOnly : ""}`}
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[0]}
                      />
                      <Selector
                        buttonStyle={{ fontSize: rem(14) }}
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[0]
                        )}
                        toggleItem={(techId, add) => {
                          if (viewOnly) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, faction.id, techId);
                          } else {
                            removeTechAsync(gameId, faction.id, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          const tech = (techs ?? {})[techId];
                          if (!tech || !gameId) {
                            return null;
                          }
                          return (
                            <div
                              onClick={
                                viewOnly
                                  ? undefined
                                  : () =>
                                      removeTechAsync(
                                        gameId,
                                        faction.id,
                                        techId
                                      )
                              }
                            >
                              <TechRow
                                className={`${styles.factionTechRow} ${
                                  styles.selected
                                } ${viewOnly ? styles.viewOnly : ""}`}
                                tech={tech}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[1]}
                      />
                    </>
                  ) : (
                    factionTechs.map((tech) => {
                      const factionHasTech = hasTech(faction, tech.id);
                      return (
                        <div
                          key={tech.id}
                          onClick={() => {
                            if (viewOnly) {
                              return;
                            }
                            if (factionHasTech) {
                              removeTechAsync(gameId, faction.id, tech.id);
                            } else {
                              addTechAsync(gameId, faction.id, tech.id);
                            }
                          }}
                          style={{ maxWidth: "100%" }}
                        >
                          <TechRow
                            className={`${styles.factionTechRow} ${
                              factionHasTech ? styles.selected : ""
                            } ${viewOnly ? styles.viewOnly : ""}`}
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

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

function TechUpdateRow({
  tech,
  orderedFactions,
  viewOnly,
}: {
  tech: Tech;
  orderedFactions: Faction[];
  viewOnly?: boolean;
}) {
  const gameId = useContext(GameIdContext);

  const numFactions = orderedFactions.length;

  const isResearched = orderedFactions.reduce((isResearched, faction) => {
    return isResearched || hasTech(faction, tech.id);
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
          const factionHasTech = hasTech(faction, tech.id);
          if (isTechReplaced(faction.id, tech.id)) {
            return <div key={faction.id}></div>;
          }
          return (
            <div
              key={faction.id}
              className={`flexRow ${styles.selected} ${
                styles.factionIconWrapper
              } ${viewOnly ? styles.viewOnly : ""}`}
              onClick={() => {
                if (viewOnly) {
                  return;
                }
                if (factionHasTech) {
                  removeTechAsync(gameId, faction.id, tech.id);
                } else {
                  addTechAsync(gameId, faction.id, tech.id);
                }
              }}
            >
              <div
                className={`
                  ${styles.factionIcon} ${
                  factionHasTech ? styles.selected : ""
                } ${viewOnly ? styles.viewOnly : ""}`}
                style={
                  {
                    "--color": getFactionColor(faction),
                  } as ExtendedCSS
                }
              >
                <FactionIcon factionId={faction.id} size="100%" />
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
  viewOnly,
}: {
  type: TechType;
  openedByDefault?: boolean;
  viewOnly?: boolean;
}) {
  const factions = useFactions();
  const techs = useTechs();
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === type && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
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
        <TechIcon type={type} size={20} />
        {techTypeString(type, intl)}
        <TechIcon type={type} size={20} />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.id}
                tech={tech}
                orderedFactions={orderedFactions}
                viewOnly={viewOnly}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UpgradeTechSection({ viewOnly }: { viewOnly?: boolean }) {
  const factions = useFactions();
  const techs = useTechs();
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(true);

  const typedTechs = Object.values(techs ?? {}).filter(
    (tech) => tech.type === "UPGRADE" && !tech.faction
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions);
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
        {techTypeString("UPGRADE", intl)}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {typedTechs.map((tech) => {
            return (
              <TechUpdateRow
                key={tech.id}
                tech={tech}
                orderedFactions={orderedFactions}
                viewOnly={viewOnly}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TechsByFaction({
  factionId,
  openedByDefault,
  viewOnly,
}: {
  factionId: FactionId;
  openedByDefault: boolean;
  viewOnly?: boolean;
}) {
  const factions = useFactions();
  const techs = useTechs();
  const gameId = useContext(GameIdContext);
  const intl = useIntl();

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const factionTechs = objectKeys(faction.techs ?? {})
    .map((techId) => techs[techId])
    .filter((tech) => !!tech) as Tech[];

  sortTechs(factionTechs);

  function getResearchableTechs(faction: Faction) {
    if (faction.id === "Nekro Virus") {
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((id) => {
          const techId = id as TechId;
          if (!hasTech(faction, techId)) {
            nekroTechs.add(techId);
          }
        });
      });
      return Array.from(nekroTechs).map(
        (techId) => (techs ?? {})[techId] as Tech
      );
    }
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.id)) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }

  return (
    <CollapsibleSection
      title={
        <div
          className="flexRow"
          style={{ justifyContent: "center", fontSize: rem(18) }}
        >
          <FactionIcon factionId={factionId} size={20} />
          {getFactionName(faction)}
          <FactionIcon factionId={factionId} size={20} />
        </div>
      }
      openedByDefault={openedByDefault}
    >
      <div
        className="flexColumn"
        style={{
          position: "relative",
          height: "100%",
          justifyContent: "flex-start",
        }}
      >
        <div
          className="flexRow"
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            userSelect: "none",
            zIndex: 0,
          }}
        >
          <FactionIcon factionId={factionId} size={120} />
        </div>
        <div
          className="flexRow"
          style={{
            width: "100%",
            zIndex: 1,
          }}
        >
          <FullTechSummary
            techs={factionTechs}
            factionId={factionId}
            viewOnly={viewOnly}
          />
        </div>
        <div className={styles.factionTechList}>
          {factionTechs.map((tech) => {
            return (
              <TechRow
                key={tech.id}
                tech={tech}
                removeTech={
                  viewOnly
                    ? undefined
                    : (techId) => {
                        removeTechAsync(gameId, factionId, techId);
                      }
                }
                opts={{ hideSymbols: true }}
              />
            );
          })}
        </div>
        {viewOnly ? null : (
          <div
            className="flexRow"
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: rem(8),
              width: "100%",
            }}
          >
            <TechSelectHoverMenu
              factionId={factionId}
              label={intl.formatMessage({
                id: "3qIvsL",
                description: "Label on a hover menu used to research tech.",
                defaultMessage: "Research Tech",
              })}
              techs={getResearchableTechs(faction)}
              selectTech={(tech) => {
                addTechAsync(gameId, factionId, tech.id);
              }}
            />
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

interface TechGridProperties extends CSSProperties {
  "--num-columns": number;
}

export default function TechPanel({
  byFaction,
  viewOnly,
}: {
  byFaction: boolean;
  viewOnly?: boolean;
}) {
  const factions = useFactions();

  const orderedFactions = objectKeys(factions).sort((a, b) => (a < b ? -1 : 1));
  const techGridProperties: TechGridProperties = {
    "--num-columns": byFaction ? Math.ceil(orderedFactions.length / 2) : 4,
  };
  return (
    <div className={styles.techGrid} style={techGridProperties}>
      {byFaction ? (
        orderedFactions.map((factionId, index) => {
          return (
            <TechsByFaction
              key={factionId}
              factionId={factionId}
              openedByDefault={index === 0}
              viewOnly={viewOnly}
            />
          );
        })
      ) : (
        <>
          <FactionTechSection openedByDefault viewOnly={viewOnly} />
          <TechSection type="GREEN" viewOnly={viewOnly} />
          <TechSection type="BLUE" viewOnly={viewOnly} />
          <TechSection type="YELLOW" viewOnly={viewOnly} />
          <TechSection type="RED" viewOnly={viewOnly} />
          <UpgradeTechSection viewOnly={viewOnly} />
        </>
      )}
    </div>
  );
}
