import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useState,
} from "react";
import { FullFactionSymbol } from "../FactionCard";
import { computeVPs } from "../FactionSummary";
import { BLACK_BORDER_GLOW, LabeledDiv } from "../LabeledDiv";
import { Modal } from "../Modal";
import { ObjectiveRow } from "../ObjectiveRow";
import { Selector } from "../Selector";
import { useGameData } from "../data/GameData";
import { Faction } from "../util/api/factions";
import { manualVPUpdate } from "../util/api/manualVPUpdate";
import { Objective } from "../util/api/objectives";
import { hideObjective, revealObjective } from "../util/api/revealObjective";
import { scoreObjective, unscoreObjective } from "../util/api/scoreObjective";
import { setObjectivePoints } from "../util/api/setObjectivePoints";
import { getFactionColor, getFactionName } from "../util/factions";
import { RevealObjectiveData } from "../util/model/revealObjective";
import { responsiveNegativePixels, responsivePixels } from "../util/util";
import {
  // FactionSelectRadialMenu,
  FactionSelectRadialMenu,
} from "./FactionSelect";
import styles from "./ObjectivePanel.module.scss";

function GridHeader({ children }: PropsWithChildren) {
  return (
    <div
      className="flexColumn"
      style={{
        height: "100%",
        justifyContent: "flex-end",
        fontSize: responsivePixels(14),
        minWidth: responsivePixels(62),
        maxWidth: responsivePixels(92),
        padding: `0 ${responsivePixels(2)}`,
        whiteSpace: "normal",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: responsivePixels(84), height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

interface InfoContentProps {
  objective: Objective;
}
function InfoContent({ objective }: InfoContentProps) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        maxWidth: responsivePixels(800),
        width: "100%",
        minWidth: responsivePixels(320),
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {objective.description}
    </div>
  );
}

function ObjectiveColumn({
  objective,
  factions,
  orderedFactionNames,
}: {
  objective: Objective;
  factions: Record<string, Faction>;
  orderedFactionNames: string[];
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  function scoreObj(
    objectiveName: string,
    factionName: string,
    score: boolean
  ) {
    if (!gameid) {
      return;
    }
    if (score) {
      scoreObjective(gameid, factionName, objectiveName);
    } else {
      unscoreObjective(gameid, factionName, objectiveName);
    }
  }
  const [showInfoModal, setShowInfoModal] = useState(false);

  const numScorers = (objective.scorers ?? []).length;

  return (
    <>
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={
          <div style={{ fontSize: responsivePixels(40) }}>{objective.name}</div>
        }
        level={2}
      >
        <InfoContent objective={objective} />
      </Modal>
      <GridHeader>
        <div
          className="flexColumn"
          style={{
            height: "100%",
            justifyContent: "space-between",
            gap: responsivePixels(2),
            position: "relative",
          }}
        >
          {numScorers === 0 ? (
            <div
              className="icon clickable negative"
              onClick={() => {
                if (!gameid) {
                  return;
                }
                hideObjective(gameid, objective.name);
              }}
            >
              &#x2715;
            </div>
          ) : null}
          {objective.name}
          <div
            className="popupIcon"
            style={{ paddingRight: responsivePixels(8) }}
            onClick={() => setShowInfoModal(true)}
          >
            &#x24D8;
          </div>
        </div>
      </GridHeader>
      {orderedFactionNames.map((factionName) => {
        const scoredObjective = objective.scorers?.includes(factionName);
        return (
          <div
            key={factionName}
            className={`flexRow ${styles.selected} ${styles.factionGridIconWrapper}`}
            onClick={() => {
              if (!gameid) {
                return;
              }
              if (scoredObjective) {
                unscoreObjective(gameid, factionName, objective.name);
              } else {
                scoreObjective(gameid, factionName, objective.name);
              }
            }}
          >
            <div
              className={`
  ${styles.factionIcon} ${scoredObjective ? styles.selected : ""}`}
              style={
                {
                  "--color": getFactionColor((factions ?? {})[factionName]),
                } as ExtendedCSS
              }
            >
              <FullFactionSymbol faction={factionName} />
            </div>
          </div>
        );
      })}
    </>
  );
}

function SecretModalContent({ faction }: { faction: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["objectives"]);
  const objectives = gameData.objectives;

  const secrets = Object.values(objectives ?? {}).filter(
    (objective) => objective.type === "SECRET"
  );

  const scoredSecrets = secrets.filter((secret) =>
    (secret.scorers ?? []).includes(faction)
  );
  const availableSecrets = secrets.filter(
    (secret) => (secret.scorers ?? []).length === 0
  );

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        padding: responsivePixels(8),
        alignItems: "center",
      }}
    >
      {scoredSecrets.map((secret) => {
        return (
          <ObjectiveRow
            key={secret.name}
            objective={secret}
            hideScorers={true}
            removeObjective={() => {
              if (!gameid) {
                return;
              }
              unscoreObjective(gameid, faction, secret.name);
            }}
          />
        );
      })}
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {scoredSecrets.length < 6 ? (
          <Selector
            hoverMenuLabel="Score Secret Objective"
            options={availableSecrets.map((secret) => secret.name)}
            toggleItem={(itemName) => {
              if (!gameid) {
                return;
              }
              scoreObjective(gameid, faction, itemName);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function CollapsibleSection({
  openedByDefault = false,
  className,
  title,
  color = "#eee",
  children,
}: PropsWithChildren<{
  openedByDefault?: boolean;
  color?: string;
  className?: string;
  title: ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(!openedByDefault);

  return (
    <div
      className={styles.column + " " + className}
      style={{ borderColor: color }}
    >
      <div
        className={styles.objectiveTitle}
        onClick={() => setCollapsed(!collapsed)}
        style={{ color: color }}
      >
        {title}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

export function ObjectivePanel({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "factions",
    "objectives",
    "options",
    "state",
  ]);
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const options = gameData.options;
  const state = gameData.state;

  const [factionName, setFactionName] = useState("");
  const [secretModal, setSecretModal] = useState(false);

  const includesPoK = ((options ?? {}).expansions ?? []).includes("POK");

  if (state && factionName === "") {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionName(state.activeplayer);
    } else {
      setFactionName(state.speaker);
    }
    return null;
  }

  const orderedFactionNames = Object.keys(factions ?? {}).sort();

  const revealOrder: Record<string, number> = {};
  let order = 1;
  [...(gameData.actionLog ?? [])]
    .reverse()
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .forEach((logEntry) => {
      const objectiveName = (logEntry.data as RevealObjectiveData).event
        .objective;
      revealOrder[objectiveName] = order;
      ++order;
    });

  const sortedObjectives = Object.values(objectives ?? {});

  const stageOneObjectives: Objective[] = sortedObjectives.filter(
    (obj) => obj.type === "STAGE ONE"
  );
  const stageTwoObjectives: Objective[] = sortedObjectives.filter(
    (obj) => obj.type === "STAGE TWO"
  );
  const secretObjectives = sortedObjectives.filter(
    (obj) => obj.type === "SECRET"
  );

  const secretsByFaction: Record<string, Objective[]> = {};
  for (const secret of secretObjectives) {
    for (const scorer of secret.scorers ?? []) {
      const faction = secretsByFaction[scorer] ?? [];
      faction.push(secret);
      secretsByFaction[scorer] = faction;
    }
  }

  const selectedStageOneObjectives = stageOneObjectives
    .filter((obj) => obj && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.name];
      const bRevealOrder = revealOrder[b.name];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });
  const remainingStageOneObjectives = stageOneObjectives.filter(
    (obj) => !obj.selected
  );
  const selectedStageTwoObjectives = stageTwoObjectives
    .filter((obj) => obj && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.name];
      const bRevealOrder = revealOrder[b.name];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });
  const remainingStageTwoObjectives = stageTwoObjectives.filter(
    (obj) => !obj.selected
  );
  const selectedObjectives = new Set<string>();
  selectedStageOneObjectives.forEach((objective) => {
    selectedObjectives.add(objective.name);
  });
  selectedStageTwoObjectives.forEach((objective) => {
    selectedObjectives.add(objective.name);
  });

  const numStageOneObjectives = selectedStageOneObjectives.length;
  const numStageTwoObjectives = selectedStageTwoObjectives.length;

  const numRows = Object.keys(factions ?? {}).length + 1;

  const custodiansToken = (objectives ?? {})["Custodians Token"];
  const custodiansScorer = (custodiansToken?.scorers ?? [])[0];

  const supportForTheThrone = (objectives ?? {})["Support for the Throne"];

  const shardOfTheThrone = (objectives ?? {})["Shard of the Throne"];
  const shardScorers = shardOfTheThrone?.scorers ?? [];

  const tomb = (objectives ?? {})["Tomb + Crown of Emphidia"];

  const politicalCensure = (objectives ?? {})["Political Censure"];

  const holyPlanet = (objectives ?? {})["Holy Planet of Ixth"];
  const holyPlanetScorers = holyPlanet?.scorers ?? [];

  const crown = (objectives ?? {})["Crown of Emphidia"];
  const crownScorers = crown?.scorers ?? [];

  const imperialRider = (objectives ?? {})["Imperial Rider"];

  const seed = (objectives ?? {})["Seed of an Empire"];

  const mutiny = (objectives ?? {})["Mutiny"];
  const mutinyDirection = mutiny?.points === 1 ? "[For]" : "[Against]";

  function manualVpAdjust(increase: boolean, factionName: string) {
    if (!gameid) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdate(gameid, factionName, value);
  }

  return (
    <>
      <Modal
        title={getFactionName((factions ?? {})[factionName]) + " Secrets"}
        closeMenu={() => setSecretModal(false)}
        visible={!!secretModal}
      >
        <SecretModalContent faction={factionName} />
      </Modal>
      <div className="tabletOnly">
        <div className={styles.objectiveGrid}>
          <CollapsibleSection
            title="Victory Points"
            openedByDefault
            className={styles.victoryPoints}
          >
            <div>
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  padding: responsivePixels(8),
                  paddingBottom: 0,
                  gap: responsivePixels(8),
                  isolation: "isolate",
                }}
              >
                {orderedFactionNames.map((name) => {
                  const faction = (factions ?? {})[name];
                  const VPs = computeVPs(
                    factions ?? {},
                    name,
                    objectives ?? {}
                  );
                  return (
                    <LabeledDiv
                      key={name}
                      label={getFactionName(faction)}
                      color={getFactionColor(faction)}
                      opts={{ fixedWidth: true }}
                    >
                      <div
                        className="flexRow"
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          opacity: 0.75,
                          zIndex: -1,
                          left: 0,
                          top: 0,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            height: "90%",
                            aspectRatio: 1,
                          }}
                        >
                          <FullFactionSymbol faction={name} />
                        </div>
                      </div>
                      <div
                        key={name}
                        className="flexRow"
                        style={{
                          justifyContent: "center",
                          fontSize: responsivePixels(28),
                          width: "100%",
                        }}
                      >
                        {VPs > 0 ? (
                          <div
                            className="arrowDown"
                            onClick={() => manualVpAdjust(false, name)}
                          ></div>
                        ) : (
                          <div style={{ width: responsivePixels(12) }}></div>
                        )}
                        <div
                          className="flexRow"
                          style={{ width: responsivePixels(24) }}
                        >
                          {VPs}
                        </div>
                        <div
                          className="arrowUp"
                          onClick={() => manualVpAdjust(true, name)}
                        ></div>
                      </div>
                    </LabeledDiv>
                  );
                })}
              </div>
            </div>
          </CollapsibleSection>
          <div
            className={styles.custodians}
            style={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(2, 1fr)",
              width: "100%",
            }}
          >
            <CollapsibleSection title="Reveal Objective" openedByDefault>
              <div
                className={`flexColumn ${styles.collapsibleRow}`}
                style={{
                  display: "flex",
                  marginLeft: responsivePixels(8),
                  width: "min-content",
                  flexDirection: "column",
                  alignItems: "stretch",
                  overflow: "visible",
                }}
              >
                <Selector
                  options={remainingStageOneObjectives.map((obj) => obj.name)}
                  hoverMenuLabel="Stage I"
                  toggleItem={(objectiveName, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      // revealSubStateObjective(gameid, objectiveName);
                      revealObjective(gameid, objectiveName);
                    } else {
                      hideObjective(gameid, objectiveName);
                    }
                  }}
                />
                <Selector
                  options={remainingStageTwoObjectives.map((obj) => obj.name)}
                  hoverMenuLabel="Stage II"
                  toggleItem={(objectiveName, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      // revealSubStateObjective(gameid, objectiveName);
                      revealObjective(gameid, objectiveName);
                    } else {
                      hideObjective(gameid, objectiveName);
                    }
                  }}
                />
              </div>
            </CollapsibleSection>
            <div className="flexRow" style={{ width: "100%" }}>
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  alignItems: "flex-start",
                  width: responsivePixels(72),
                  height: responsivePixels(72),
                }}
              >
                <Image
                  src={`/images/custodians.png`}
                  alt={`Custodians Token`}
                  layout="fill"
                  objectFit="contain"
                />
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    marginLeft: "72%",
                    marginTop: "44%",
                  }}
                >
                  <FactionSelectRadialMenu
                    options={orderedFactionNames}
                    selectedFaction={custodiansScorer}
                    onSelect={async (factionName) => {
                      if (!gameid) {
                        return;
                      }
                      if (custodiansScorer) {
                        unscoreObjective(
                          gameid,
                          custodiansScorer,
                          "Custodians Token"
                        );
                      }
                      if (factionName) {
                        scoreObjective(gameid, factionName, "Custodians Token");
                      }
                    }}
                    borderColor={
                      custodiansScorer
                        ? getFactionColor((factions ?? {})[custodiansScorer])
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={"flexColumn " + styles.objectiveSection}>
            {selectedStageOneObjectives.length === 0 ? null : (
              <CollapsibleSection
                title="Stage I"
                color="orange"
                className={styles.stageOne}
              >
                <div className="flexColumn">
                  {selectedStageOneObjectives.map((objective) => {
                    if (!objective) {
                      return (
                        <>
                          <GridHeader>???</GridHeader>
                          {orderedFactionNames.map((name) => {
                            return <div key={name}></div>;
                          })}
                        </>
                      );
                    }
                    return (
                      <React.Fragment key={objective.name}>
                        <ObjectiveRow
                          objective={objective}
                          hideScorers
                          removeObjective={
                            (objective.scorers ?? []).length === 0
                              ? () => {
                                  if (!gameid) {
                                    return;
                                  }
                                  // hideSubStateObjective(gameid, objective.name);
                                  hideObjective(gameid, objective.name);
                                }
                              : undefined
                          }
                        />
                        <div
                          className={styles.factionIconRow}
                          style={
                            {
                              "--num-factions": orderedFactionNames.length,
                            } as NumFactionsCSS
                          }
                        >
                          {Object.values(orderedFactionNames).map(
                            (factionName) => {
                              const scoredObjective = (
                                objective.scorers ?? []
                              ).includes(factionName);
                              return (
                                <div
                                  key={factionName}
                                  className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                                  onClick={() => {
                                    if (!gameid) {
                                      return;
                                    }
                                    if (scoredObjective) {
                                      unscoreObjective(
                                        gameid,
                                        factionName,
                                        objective.name
                                      );
                                    } else {
                                      scoreObjective(
                                        gameid,
                                        factionName,
                                        objective.name
                                      );
                                    }
                                  }}
                                >
                                  <div
                                    className={`
                        ${styles.factionIcon} ${
                                      scoredObjective ? styles.selected : ""
                                    }`}
                                    style={
                                      {
                                        "--color": getFactionColor(
                                          (factions ?? {})[factionName]
                                        ),
                                      } as ExtendedCSS
                                    }
                                  >
                                    <FullFactionSymbol faction={factionName} />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </CollapsibleSection>
            )}
            {selectedStageTwoObjectives.length === 0 ? null : (
              <CollapsibleSection
                title="Stage II"
                color="royalblue"
                className={styles.stageTwo}
              >
                <div className="flexColumn">
                  {selectedStageTwoObjectives.map((objective) => {
                    if (!objective) {
                      return (
                        <>
                          <GridHeader>???</GridHeader>
                          {orderedFactionNames.map((name) => {
                            return <div key={name}></div>;
                          })}
                        </>
                      );
                    }
                    return (
                      <React.Fragment key={objective.name}>
                        <ObjectiveRow
                          objective={objective}
                          hideScorers
                          removeObjective={
                            (objective.scorers ?? []).length === 0
                              ? () => {
                                  if (!gameid) {
                                    return;
                                  }
                                  // hideSubStateObjective(gameid, objective.name);
                                  hideObjective(gameid, objective.name);
                                }
                              : undefined
                          }
                        />
                        <div
                          className={styles.factionIconRow}
                          style={
                            {
                              "--num-factions": orderedFactionNames.length,
                            } as NumFactionsCSS
                          }
                        >
                          {Object.values(orderedFactionNames).map(
                            (factionName) => {
                              const scoredObjective = (
                                objective.scorers ?? []
                              ).includes(factionName);
                              return (
                                <div
                                  key={factionName}
                                  className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                                  onClick={() => {
                                    if (!gameid) {
                                      return;
                                    }
                                    if (scoredObjective) {
                                      unscoreObjective(
                                        gameid,
                                        factionName,
                                        objective.name
                                      );
                                    } else {
                                      scoreObjective(
                                        gameid,
                                        factionName,
                                        objective.name
                                      );
                                    }
                                  }}
                                >
                                  <div
                                    className={`
                            ${styles.factionIcon} ${
                                      scoredObjective ? styles.selected : ""
                                    }`}
                                    style={
                                      {
                                        "--color": getFactionColor(
                                          (factions ?? {})[factionName]
                                        ),
                                      } as ExtendedCSS
                                    }
                                  >
                                    <FullFactionSymbol faction={factionName} />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </CollapsibleSection>
            )}
            <CollapsibleSection title="Secrets" color="red">
              <div className="flexRow" style={{ width: "100%" }}>
                <div
                  className="flexRow"
                  style={{ padding: "0 8px 0 4px", width: "100%" }}
                >
                  {orderedFactionNames.map((name) => {
                    const factionSecrets = secretsByFaction[name] ?? [];
                    return (
                      <div
                        key={name}
                        className="flexRow"
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          width: "100%",
                          aspectRatio: 1,
                        }}
                        onClick={() => {
                          setFactionName(name);
                          setSecretModal(true);
                        }}
                      >
                        <div
                          className="flexRow"
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: 1,
                          }}
                        >
                          <FullFactionSymbol faction={name} />
                        </div>
                        <div
                          className="flexRow"
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <div
                            className="flexRow"
                            style={{
                              position: "absolute",
                              backgroundColor: "#222",
                              borderRadius: "100%",
                              marginLeft: "44%",
                              marginTop: "44%",
                              boxShadow: `${responsivePixels(
                                1
                              )} ${responsivePixels(1)} ${responsivePixels(
                                4
                              )} black`,
                              width: responsivePixels(24),
                              height: responsivePixels(24),
                              zIndex: 2,
                            }}
                          >
                            {factionSecrets.length}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Imperial Points">
              <div className="flexRow" style={{ width: "100%" }}>
                <div
                  className="flexRow"
                  style={{ padding: "0 8px 0 4px", width: "100%" }}
                >
                  {orderedFactionNames.map((faction) => {
                    const imperialPoints = (
                      (objectives ?? {})["Imperial Point"]?.scorers ?? []
                    ).filter((name) => name === faction).length;
                    return (
                      <div
                        key={faction}
                        className="flexRow hiddenButtonParent"
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: 1,
                        }}
                      >
                        {imperialPoints > 0 ? (
                          <div
                            className="hiddenButton flexRow"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: -4,
                              fontFamily: "Myriad Pro",
                              fontWeight: "bold",
                              height: responsivePixels(16),
                              width: responsivePixels(16),
                              border: `${responsivePixels(1)} solid #333`,
                              borderRadius: "100%",
                              fontSize: responsivePixels(12),
                              backgroundColor: "#222",
                              boxShadow: `${responsivePixels(
                                1
                              )} ${responsivePixels(1)} ${responsivePixels(
                                4
                              )} black`,
                              cursor: "pointer",
                              zIndex: 2,
                            }}
                            onClick={() => {
                              if (!gameid) {
                                return;
                              }
                              unscoreObjective(
                                gameid,
                                faction,
                                "Imperial Point"
                              );
                            }}
                          >
                            -
                          </div>
                        ) : null}
                        <div
                          className="hiddenButton flexRow"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: -4,
                            fontFamily: "Myriad Pro",
                            border: `${responsivePixels(1)} solid #333`,
                            fontWeight: "bold",
                            borderRadius: "100%",
                            height: responsivePixels(16),
                            width: responsivePixels(16),
                            fontSize: responsivePixels(12),
                            backgroundColor: "#222",
                            boxShadow: `${responsivePixels(
                              1
                            )} ${responsivePixels(1)} ${responsivePixels(
                              4
                            )} black`,
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            scoreObjective(gameid, faction, "Imperial Point");
                          }}
                        >
                          +
                        </div>
                        <FullFactionSymbol faction={faction} />
                        <div
                          className="flexRow"
                          style={{
                            position: "absolute",
                            backgroundColor: "#222",
                            borderRadius: "100%",
                            marginLeft: "60%",
                            marginTop: "60%",
                            boxShadow: `${responsivePixels(
                              1
                            )} ${responsivePixels(1)} ${responsivePixels(
                              4
                            )} black`,
                            width: responsivePixels(24),
                            height: responsivePixels(24),
                            zIndex: 2,
                          }}
                        >
                          {imperialPoints}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>
          </div>
          <CollapsibleSection
            title="Support for the Throne"
            className={styles.supportForTheThrone}
          >
            <div className={`flexRow ${styles.collapsibleRow}`}>
              <div className={`flexRow ${styles.objRow}`}>
                {orderedFactionNames.map((name) => {
                  const scorers =
                    (supportForTheThrone?.keyedScorers ?? {})[name] ?? [];
                  const scorer = scorers[0];
                  return (
                    <div key={name}>
                      <FactionSelectRadialMenu
                        key={name}
                        options={orderedFactionNames.filter(
                          (faction) => faction !== name
                        )}
                        selectedFaction={scorer}
                        onSelect={(factionName) => {
                          if (!gameid) {
                            return;
                          }
                          if (scorer) {
                            unscoreObjective(
                              gameid,
                              scorer,
                              "Support for the Throne",
                              name
                            );
                          }
                          if (factionName) {
                            scoreObjective(
                              gameid,
                              factionName,
                              "Support for the Throne",
                              name
                            );
                          }
                        }}
                        tag={<FullFactionSymbol faction={name} />}
                        tagBorderColor={getFactionColor((factions ?? {})[name])}
                        borderColor={
                          scorer
                            ? getFactionColor((factions ?? {})[scorer])
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Other Victory Points">
            <div
              className={"flexColumn " + styles.collapsibleRow}
              style={{ width: "100%", height: "auto" }}
            >
              {/* <div className="flexColumn" style={{ gridColumn: "1 / 3" }}> */}

              <div
                className="flexRow"
                style={{
                  height: "100%",
                  gap: 0,
                  width: "100%",
                  alignItems: "flex-start",
                }}
              >
                <SimpleScorable
                  objective={imperialRider}
                  orderedFactionNames={orderedFactionNames}
                  numScorers={includesPoK ? 2 : 1}
                  info="Can be scored 2x due to The Codex"
                />
                <SimpleScorable
                  objective={politicalCensure}
                  orderedFactionNames={orderedFactionNames}
                />
              </div>
              {includesPoK ? (
                <div
                  className="flexRow"
                  style={{
                    height: "100%",
                    gap: 0,
                    width: "100%",
                    alignItems: "flex-start",
                  }}
                >
                  <SimpleScorable
                    objective={shardOfTheThrone}
                    orderedFactionNames={orderedFactionNames}
                  />
                  <SimpleScorable
                    objective={tomb}
                    orderedFactionNames={orderedFactionNames}
                  />
                </div>
              ) : null}
              <SimpleScorable
                objective={holyPlanet}
                orderedFactionNames={orderedFactionNames}
                numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed."
              />
              {!includesPoK ? (
                <SimpleScorable
                  objective={shardOfTheThrone}
                  orderedFactionNames={orderedFactionNames}
                  numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                  info="Can be scored 2x due to Miscount Disclosed"
                />
              ) : null}
              <SimpleScorable
                objective={crown}
                orderedFactionNames={orderedFactionNames}
                numScorers={!holyPlanetScorers[1] && !shardScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed."
              />
              {!mutiny ? null : (
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    className="flexRow"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <ObjectiveRow objective={mutiny} hideScorers />
                    <button
                      style={{ fontSize: responsivePixels(14) }}
                      onClick={() => {
                        if (!gameid) {
                          return;
                        }
                        if (mutinyDirection === "[For]") {
                          setObjectivePoints(gameid, "Mutiny", -1);
                        } else {
                          setObjectivePoints(gameid, "Mutiny", 1);
                        }
                      }}
                    >
                      {mutinyDirection}
                    </button>
                  </div>
                  <div
                    className={styles.factionIconRow}
                    style={
                      {
                        "--num-factions": orderedFactionNames.length,
                      } as NumFactionsCSS
                    }
                  >
                    {Object.values(orderedFactionNames).map((factionName) => {
                      const scoredObjective = (mutiny?.scorers ?? []).includes(
                        factionName
                      );
                      return (
                        <div
                          key={factionName}
                          className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjective(
                                gameid,
                                factionName,
                                mutiny.name
                              );
                            } else {
                              scoreObjective(gameid, factionName, mutiny.name);
                            }
                          }}
                        >
                          <div
                            className={`
                ${styles.factionIcon} ${
                              scoredObjective ? styles.selected : ""
                            }`}
                            style={
                              {
                                "--color": getFactionColor(
                                  (factions ?? {})[factionName]
                                ),
                              } as ExtendedCSS
                            }
                          >
                            <FullFactionSymbol faction={factionName} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!seed ? null : (
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  <ObjectiveRow objective={seed} hideScorers />
                  <div
                    className={styles.factionIconRow}
                    style={
                      {
                        "--num-factions": orderedFactionNames.length,
                      } as NumFactionsCSS
                    }
                  >
                    {Object.values(orderedFactionNames).map((factionName) => {
                      const scoredObjective = (seed?.scorers ?? []).includes(
                        factionName
                      );
                      return (
                        <div
                          key={factionName}
                          className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjective(gameid, factionName, seed.name);
                            } else {
                              scoreObjective(gameid, factionName, seed.name);
                            }
                          }}
                        >
                          <div
                            className={`
                ${styles.factionIcon} ${
                              scoredObjective ? styles.selected : ""
                            }`}
                            style={
                              {
                                "--color": getFactionColor(
                                  (factions ?? {})[factionName]
                                ),
                              } as ExtendedCSS
                            }
                          >
                            <FullFactionSymbol faction={factionName} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
      </div>
      <div
        className="flexColumn nonTablet"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          padding: responsivePixels(8),
          height: "100%",
          gap: responsivePixels(24),
          isolation: "isolate",
          backgroundColor: "#222",
          borderRadius: responsivePixels(8),
        }}
      >
        <div
          style={{
            position: "relative",
            display: "grid",
            rowGap: responsivePixels(4),
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            minHeight: 0,
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${numRows}, 2fr)`,
          }}
        >
          {orderedFactionNames.map((name) => {
            return (
              <div
                key={name}
                className="flexColumn"
                style={{
                  justifyContent: "center",
                  padding: `0 ${responsivePixels(8)}`,
                  height: "100%",
                  position: "relative",
                  borderRadius: responsivePixels(5),
                  border: `${responsivePixels(2)} solid ${getFactionColor(
                    (factions ?? {})[name]
                  )}`,
                  boxShadow:
                    getFactionColor((factions ?? {})[name]) === "Black"
                      ? BLACK_BORDER_GLOW
                      : undefined,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    opacity: 0.5,
                    zIndex: -1,
                  }}
                >
                  <FullFactionSymbol faction={name} />
                </div>
                {getFactionName((factions ?? {})[name])}
              </div>
            );
          })}
          <div
            className="flexColumn"
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "flex-end",
              padding: `0 ${responsivePixels(8)}`,
            }}
          >
            VPs
          </div>

          {orderedFactionNames.map((name) => {
            return (
              <div
                key={name}
                className="flexRow"
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: responsivePixels(24),
                }}
              >
                {computeVPs(factions ?? {}, name, objectives ?? {})}
              </div>
            );
          })}
          <div
            className="flexColumn"
            style={{
              gridColumn: "1 / 2",
              gridRow: "1 / 2",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <LabeledDiv
              label="Reveal Objective"
              noBlur={true}
              style={{
                flexDirection: "row",
                width: "min-content",
                alignItems: "stretch",
                gridRow: "1 / 2",
              }}
            >
              <Selector
                options={remainingStageOneObjectives.map((obj) => obj.name)}
                hoverMenuLabel="Stage I"
                toggleItem={(objectiveName, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    // revealSubStateObjective(gameid, objectiveName);
                    revealObjective(gameid, objectiveName);
                  } else {
                    hideObjective(gameid, objectiveName);
                  }
                }}
              />
              <Selector
                options={remainingStageTwoObjectives.map((obj) => obj.name)}
                hoverMenuLabel="Stage II"
                toggleItem={(objectiveName, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    // revealSubStateObjective(gameid, objectiveName);
                    revealObjective(gameid, objectiveName);
                  } else {
                    hideObjective(gameid, objectiveName);
                  }
                }}
              />
            </LabeledDiv>
          </div>
          {selectedStageOneObjectives.map((objective) => {
            if (!objective) {
              return (
                <>
                  <GridHeader>???</GridHeader>
                  {orderedFactionNames.map((name) => {
                    return <div key={name}></div>;
                  })}
                </>
              );
            }
            return (
              <ObjectiveColumn
                key={objective.name}
                objective={objective}
                factions={factions ?? {}}
                orderedFactionNames={orderedFactionNames}
              />
            );
          })}
          <div
            className="flexRow"
            style={{
              position: "absolute",
              width: "100%",
              zIndex: -1,
              opacity: 0.5,
              height: "100%",
              gridColumn: `${
                3 + numStageOneObjectives + numStageTwoObjectives
              } / ${3 + numStageOneObjectives + numStageTwoObjectives + 1}`,
              gridRow: "1 / 2",
              borderRadius: "100%",
              fontSize: responsivePixels(80),
            }}
          >
            <div
              className="flexRow"
              style={{
                border: `${responsivePixels(5)} solid red`,
                width: responsivePixels(60),
                height: responsivePixels(60),
                borderRadius: "100%",
                fontSize: responsivePixels(44),
              }}
            >
              S
            </div>
          </div>
          <div
            className="flexRow"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "100%",
              height: "100%",
              gridColumn: `3 / ${numStageOneObjectives + 3}`,
              gridRow: `2 / ${numRows + 1}`,
              borderLeft: `${responsivePixels(1)} solid orange`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: responsiveNegativePixels(-68),
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${responsivePixels(4)}`,
                color: "orange",
                whiteSpace: "nowrap",
              }}
            >
              Stage I
            </div>
          </div>
          <div
            className="flexRow"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "100%",
              height: "100%",
              gridColumn: `${numStageOneObjectives + 3} / ${
                numStageOneObjectives + numStageTwoObjectives + 3
              }`,
              gridRow: `2 / ${numRows + 1}`,
              borderLeft: `${responsivePixels(1)} solid royalblue`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: responsiveNegativePixels(-72),
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${responsivePixels(4)}`,
                color: "royalblue",
                whiteSpace: "nowrap",
              }}
            >
              Stage II
            </div>
          </div>
          <div
            className="flexRow"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "100%",
              height: "100%",
              gridColumn: `${
                numStageOneObjectives + numStageTwoObjectives + 3
              } / ${numStageOneObjectives + numStageTwoObjectives + 4}`,
              gridRow: `2 / ${numRows + 1}`,
              borderLeft: `${responsivePixels(1)} solid red`,
              borderRight: `${responsivePixels(1)} solid grey`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: responsiveNegativePixels(-68),
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${responsivePixels(4)}`,
                color: "red",
              }}
            >
              Secrets
            </div>
          </div>
          {selectedStageTwoObjectives.map((objective) => {
            return (
              <ObjectiveColumn
                key={objective.name}
                objective={objective}
                factions={factions ?? {}}
                orderedFactionNames={orderedFactionNames}
              />
            );
          })}
          <GridHeader>Secrets</GridHeader>
          {orderedFactionNames.map((name) => {
            const factionSecrets = secretsByFaction[name] ?? [];
            return (
              <div
                key={name}
                className="flexRow"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  padding: `0 ${responsivePixels(8)}`,
                }}
                onClick={() => {
                  setFactionName(name);
                  setSecretModal(true);
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    height: "80%",
                    width: "80%",
                  }}
                >
                  <FullFactionSymbol faction={name} />
                </div>
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "absolute",
                      backgroundColor: "#222",
                      borderRadius: "100%",
                      marginLeft: "44%",
                      marginTop: "44%",
                      boxShadow: `${responsivePixels(1)} ${responsivePixels(
                        1
                      )} ${responsivePixels(4)} black`,
                      width: responsivePixels(24),
                      height: responsivePixels(24),
                      zIndex: 2,
                    }}
                  >
                    {factionSecrets.length}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: responsivePixels(8),
            paddingBottom: responsivePixels(4),
            width: "100%",
          }}
        >
          <div
            className="flexRow"
            style={{ gridColumn: "1 / 3", width: "100%", height: "100%" }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                alignItems: "flex-start",
                width: responsivePixels(72),
                height: responsivePixels(72),
              }}
            >
              <Image
                src={`/images/custodians.png`}
                alt={`Custodians Token`}
                layout="fill"
                objectFit="contain"
              />
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  marginLeft: "72%",
                  marginTop: "44%",
                }}
              >
                <FactionSelectRadialMenu
                  options={orderedFactionNames}
                  selectedFaction={custodiansScorer}
                  onSelect={async (factionName) => {
                    if (!gameid) {
                      return;
                    }
                    if (custodiansScorer) {
                      unscoreObjective(
                        gameid,
                        custodiansScorer,
                        "Custodians Token"
                      );
                    }
                    if (factionName) {
                      scoreObjective(gameid, factionName, "Custodians Token");
                    }
                  }}
                  borderColor={
                    custodiansScorer
                      ? getFactionColor((factions ?? {})[custodiansScorer])
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
          <LabeledDiv
            noBlur={true}
            label="Support for the Throne"
            style={{ gridColumn: "3 / 9" }}
          >
            <div
              className="flexRow"
              style={{ justifyContent: "space-evenly", width: "100%" }}
            >
              {orderedFactionNames.map((name) => {
                const scorers =
                  (supportForTheThrone?.keyedScorers ?? {})[name] ?? [];
                const scorer = scorers[0];
                return (
                  <div
                    key={name}
                    style={{
                      position: "relative",
                      width: "fit-content",
                      height: "100%",
                    }}
                  >
                    <FactionSelectRadialMenu
                      key={name}
                      options={orderedFactionNames.filter(
                        (faction) => faction !== name
                      )}
                      selectedFaction={scorer}
                      onSelect={(factionName) => {
                        if (!gameid) {
                          return;
                        }
                        if (scorer) {
                          unscoreObjective(
                            gameid,
                            scorer,
                            "Support for the Throne",
                            name
                          );
                        }
                        if (factionName) {
                          scoreObjective(
                            gameid,
                            factionName,
                            "Support for the Throne",
                            name
                          );
                        }
                      }}
                      tag={<FullFactionSymbol faction={name} />}
                      tagBorderColor={getFactionColor((factions ?? {})[name])}
                      borderColor={
                        scorer
                          ? getFactionColor((factions ?? {})[scorer])
                          : undefined
                      }
                    />
                  </div>
                );
              })}
            </div>
          </LabeledDiv>
          <LabeledDiv
            noBlur={true}
            label="Imperial Points"
            style={{ gridColumn: "9 / 13" }}
          >
            <div className="flexRow" style={{ width: "100%", height: "100%" }}>
              {orderedFactionNames.map((faction) => {
                const imperialPoints = (
                  (objectives ?? {})["Imperial Point"]?.scorers ?? []
                ).filter((name) => name === faction).length;
                return (
                  <div
                    key={faction}
                    className="flexRow hiddenButtonParent"
                    style={{
                      position: "relative",
                      width: responsivePixels(36),
                      height: responsivePixels(36),
                    }}
                  >
                    {imperialPoints > 0 ? (
                      <div
                        className="hiddenButton flexRow"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: -4,
                          fontFamily: "Myriad Pro",
                          fontWeight: "bold",
                          height: responsivePixels(16),
                          width: responsivePixels(16),
                          border: `${responsivePixels(1)} solid #333`,
                          borderRadius: "100%",
                          fontSize: responsivePixels(12),
                          backgroundColor: "#222",
                          boxShadow: `${responsivePixels(1)} ${responsivePixels(
                            1
                          )} ${responsivePixels(4)} black`,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          unscoreObjective(gameid, faction, "Imperial Point");
                        }}
                      >
                        -
                      </div>
                    ) : null}
                    <div
                      className="hiddenButton flexRow"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: -4,
                        fontFamily: "Myriad Pro",
                        border: `${responsivePixels(1)} solid #333`,
                        fontWeight: "bold",
                        borderRadius: "100%",
                        height: responsivePixels(16),
                        width: responsivePixels(16),
                        fontSize: responsivePixels(12),
                        backgroundColor: "#222",
                        boxShadow: `${responsivePixels(1)} ${responsivePixels(
                          1
                        )} ${responsivePixels(4)} black`,
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                      onClick={() => {
                        if (!gameid) {
                          return;
                        }
                        scoreObjective(gameid, faction, "Imperial Point");
                      }}
                    >
                      +
                    </div>
                    <FullFactionSymbol faction={faction} />
                    <div
                      className="flexRow"
                      style={{
                        position: "absolute",
                        backgroundColor: "#222",
                        borderRadius: "100%",
                        marginLeft: "60%",
                        marginTop: "60%",
                        boxShadow: `${responsivePixels(1)} ${responsivePixels(
                          1
                        )} ${responsivePixels(4)} black`,
                        width: responsivePixels(24),
                        height: responsivePixels(24),
                        zIndex: 2,
                      }}
                    >
                      {imperialPoints}
                    </div>
                  </div>
                );
              })}
            </div>
          </LabeledDiv>
          <div className="flexColumn" style={{ gridColumn: "1 / 3" }}>
            <SimpleScorable
              objective={imperialRider}
              orderedFactionNames={orderedFactionNames}
              numScorers={includesPoK ? 2 : 1}
              info="Can be scored 2x due to The Codex"
            />
          </div>
          {includesPoK ? (
            <LabeledDiv
              noBlur={true}
              label="Relics"
              style={{ width: "100%", height: "100%", gridColumn: "3 / 6" }}
            >
              <div
                className="flexRow"
                style={{
                  height: "100%",
                  gap: 0,
                  width: "100%",
                  alignItems: "flex-start",
                }}
              >
                <SimpleScorable
                  objective={shardOfTheThrone}
                  orderedFactionNames={orderedFactionNames}
                />
                <SimpleScorable
                  objective={tomb}
                  orderedFactionNames={orderedFactionNames}
                />
              </div>
            </LabeledDiv>
          ) : null}
          <LabeledDiv
            noBlur={true}
            label="Laws"
            style={{
              flexDirection: "row",
              gridColumn: includesPoK ? "6/8" : "3/ 8",
              width: "100%",
              height: "100%",
            }}
          >
            <SimpleScorable
              objective={holyPlanet}
              orderedFactionNames={orderedFactionNames}
              numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            {!includesPoK ? (
              <SimpleScorable
                objective={shardOfTheThrone}
                orderedFactionNames={orderedFactionNames}
                numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed"
              />
            ) : null}
            <SimpleScorable
              objective={crown}
              orderedFactionNames={orderedFactionNames}
              numScorers={!holyPlanetScorers[1] && !shardScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            <SimpleScorable
              objective={politicalCensure}
              orderedFactionNames={orderedFactionNames}
            />
          </LabeledDiv>
          <LabeledDiv
            noBlur={true}
            label="Directives"
            style={{
              gridColumn: includesPoK ? "8 / 13" : " 8 / 13",
              width: "100%",
              height: "100%",
              padding: 0,
            }}
          >
            {!mutiny ? null : (
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                <div
                  className="flexRow"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <ObjectiveRow objective={mutiny} hideScorers />
                  <button
                    style={{ fontSize: responsivePixels(14) }}
                    onClick={() => {
                      if (!gameid) {
                        return;
                      }
                      if (mutinyDirection === "[For]") {
                        setObjectivePoints(gameid, "Mutiny", -1);
                      } else {
                        setObjectivePoints(gameid, "Mutiny", 1);
                      }
                    }}
                  >
                    {mutinyDirection}
                  </button>
                </div>
                <div
                  className={styles.factionIconRow}
                  style={
                    {
                      "--num-factions": orderedFactionNames.length,
                    } as NumFactionsCSS
                  }
                >
                  {Object.values(orderedFactionNames).map((factionName) => {
                    const scoredObjective = (mutiny?.scorers ?? []).includes(
                      factionName
                    );
                    return (
                      <div
                        key={factionName}
                        className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjective(gameid, factionName, mutiny.name);
                          } else {
                            scoreObjective(gameid, factionName, mutiny.name);
                          }
                        }}
                      >
                        <div
                          className={`
                ${styles.factionIcon} ${
                            scoredObjective ? styles.selected : ""
                          }`}
                          style={
                            {
                              "--color": getFactionColor(
                                (factions ?? {})[factionName]
                              ),
                            } as ExtendedCSS
                          }
                        >
                          <FullFactionSymbol faction={factionName} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!seed ? null : (
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                <ObjectiveRow objective={seed} hideScorers />
                <div
                  className={styles.factionIconRow}
                  style={
                    {
                      "--num-factions": orderedFactionNames.length,
                    } as NumFactionsCSS
                  }
                >
                  {Object.values(orderedFactionNames).map((factionName) => {
                    const scoredObjective = (seed?.scorers ?? []).includes(
                      factionName
                    );
                    return (
                      <div
                        key={factionName}
                        className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjective(gameid, factionName, seed.name);
                          } else {
                            scoreObjective(gameid, factionName, seed.name);
                          }
                        }}
                      >
                        <div
                          className={`
                ${styles.factionIcon} ${
                            scoredObjective ? styles.selected : ""
                          }`}
                          style={
                            {
                              "--color": getFactionColor(
                                (factions ?? {})[factionName]
                              ),
                            } as ExtendedCSS
                          }
                        >
                          <FullFactionSymbol faction={factionName} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </LabeledDiv>
        </div>
      </div>
    </>
  );
}

function SimpleScorable({
  objective,
  orderedFactionNames,
  numScorers = 1,
  info,
}: {
  objective: Objective | undefined;
  orderedFactionNames: string[];
  numScorers?: number;
  info?: string;
}) {
  const router = useRouter();
  const { game: gameId }: { game?: string } = router.query;
  const gameData = useGameData(gameId, ["factions"]);
  const factions = gameData.factions;

  const [showInfoModal, setShowInfoModal] = useState(false);
  if (!objective) {
    return null;
  }
  const objectiveScorers = objective.scorers ?? [];

  return (
    <>
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={
          <div style={{ fontSize: responsivePixels(40) }}>{objective.name}</div>
        }
        level={2}
      >
        <div
          className="flexRow myriadPro"
          style={{
            boxSizing: "border-box",
            maxWidth: responsivePixels(800),
            width: "100%",
            minWidth: responsivePixels(320),
            padding: responsivePixels(4),
            whiteSpace: "pre-line",
            textAlign: "center",
            fontSize: responsivePixels(32),
          }}
        >
          {info}
        </div>
      </Modal>
      <div
        className="flexColumn mediumFont"
        style={{
          textAlign: "center",
          whiteSpace: "normal",
          height: "100%",
          width: "100%",
        }}
      >
        {objective.name}
        <div className="flexRow">
          <FactionSelectRadialMenu
            selectedFaction={objectiveScorers[0]}
            options={orderedFactionNames}
            onSelect={(factionName) => {
              if (!gameId) {
                return;
              }
              if (objectiveScorers[0]) {
                unscoreObjective(gameId, objectiveScorers[0], objective.name);
              }
              if (factionName) {
                scoreObjective(gameId, factionName, objective.name);
              }
            }}
            borderColor={
              objectiveScorers[0]
                ? getFactionColor((factions ?? {})[objectiveScorers[0]])
                : undefined
            }
          />
          {/* TODO: Only show this if The Codex has been gained */}
          {numScorers > 1 && objectiveScorers[0] ? (
            <FactionSelectRadialMenu
              selectedFaction={objectiveScorers[1]}
              options={orderedFactionNames}
              onSelect={(factionName) => {
                if (!gameId) {
                  return;
                }
                if (objectiveScorers[1]) {
                  unscoreObjective(gameId, objectiveScorers[1], objective.name);
                }
                if (factionName) {
                  scoreObjective(gameId, factionName, objective.name);
                }
              }}
              tag={
                <div
                  className="popupIcon hoverParent"
                  style={{ paddingRight: responsivePixels(8), color: "#999" }}
                  onClick={() => setShowInfoModal(true)}
                >
                  &#x24D8;
                </div>
              }
              borderColor={
                objectiveScorers[1]
                  ? getFactionColor((factions ?? {})[objectiveScorers[1]])
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
