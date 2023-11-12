import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Selector } from "../Selector";
import {
  ActionLogContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  StateContext,
} from "../context/Context";
import {
  changeOptionAsync,
  hideObjectiveAsync,
  manualVPUpdateAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  setObjectivePointsAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { BLACK_BORDER_GLOW } from "../util/borderGlow";
import { computeVPs, getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import Modal from "./Modal/Modal";
import styles from "./ObjectivePanel.module.scss";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";

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
  orderedFactionIds,
  options,
}: {
  objective: Objective;
  factions: Partial<Record<FactionId, Faction>>;
  orderedFactionIds: FactionId[];
  options: Options;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [showInfoModal, setShowInfoModal] = useState(false);

  const numScorers = (objective.scorers ?? []).length;

  const description = options["display-objective-description"];

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
            fontFamily: description ? "Myriad Pro" : undefined,
            fontSize: description ? responsivePixels(12) : undefined,
          }}
        >
          {numScorers === 0 ? (
            <div
              className="icon clickable negative"
              onClick={() => {
                if (!gameid) {
                  return;
                }
                hideObjectiveAsync(gameid, objective.id);
              }}
            >
              &#x2715;
            </div>
          ) : null}
          {description ? (
            <div
              style={{
                display: "flex",
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {objective.description}
            </div>
          ) : (
            objective.name
          )}
          {description ? null : (
            <div
              className="popupIcon"
              style={{ paddingRight: responsivePixels(8) }}
              onClick={() => setShowInfoModal(true)}
            >
              &#x24D8;
            </div>
          )}
        </div>
      </GridHeader>
      {orderedFactionIds.map((factionId) => {
        const scoredObjective = objective.scorers?.includes(factionId);
        return (
          <div
            key={factionId}
            className={`flexRow ${styles.selected} ${styles.factionGridIconWrapper}`}
            onClick={() => {
              if (!gameid) {
                return;
              }
              if (scoredObjective) {
                unscoreObjectiveAsync(gameid, factionId, objective.id);
              } else {
                scoreObjectiveAsync(gameid, factionId, objective.id);
              }
            }}
          >
            <div
              className={`
  ${styles.factionIcon} ${scoredObjective ? styles.selected : ""}`}
              style={
                {
                  "--color": getFactionColor((factions ?? {})[factionId]),
                } as ExtendedCSS
              }
            >
              <FactionIcon factionId={factionId} size="100%" />
            </div>
          </div>
        );
      })}
    </>
  );
}

function SecretModalContent({ factionId }: { factionId: FactionId }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const objectives = useContext(ObjectiveContext);

  const secrets = Object.values(objectives ?? {}).filter(
    (objective) => objective.type === "SECRET"
  );

  const scoredSecrets = secrets.filter((secret) =>
    (secret.scorers ?? []).includes(factionId)
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
              unscoreObjectiveAsync(gameid, factionId, secret.id);
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
            options={availableSecrets.map((secret) => secret.id)}
            toggleItem={(itemId) => {
              if (!gameid) {
                return;
              }
              scoreObjectiveAsync(gameid, factionId, itemId);
            }}
          />
        ) : null}
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
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const state = useContext(StateContext);

  const [factionId, setFactionId] = useState<FactionId>("Vuil'raith Cabal");
  const [secretModal, setSecretModal] = useState(false);

  const includesPoK = ((options ?? {}).expansions ?? []).includes("POK");

  if (state && !factionId) {
    if (state.activeplayer && state.activeplayer !== "None") {
      setFactionId(state.activeplayer);
    } else {
      setFactionId(state.speaker);
    }
    return null;
  }

  let orderedFactions = Object.values(factions ?? {}).sort((a, b) => {
    if (a.mapPosition < b.mapPosition) {
      return -1;
    }
    return 1;
  });

  if ((options["game-variant"] ?? "normal").startsWith("alliance")) {
    orderedFactions = orderedFactions.sort((a, b) => {
      if (!a.alliancePartner || !b.alliancePartner) {
        return 0;
      }

      // If same alliance, sort normally.
      if (a.alliancePartner === b.name || b.alliancePartner === a.name) {
        if (a.name < b.name) {
          return -1;
        }
        return 1;
      }

      // If different alliance, sort by earliest partner.
      let aName = a.name < a.alliancePartner ? a.name : a.alliancePartner;
      let bName = b.name < b.alliancePartner ? b.name : b.alliancePartner;
      if (aName < bName) {
        return -1;
      }
      return 1;
    });
  }

  let orderedFactionIds = orderedFactions.map((faction) => faction.id);

  if (orderedFactionIds.length === 0) {
    orderedFactionIds = [
      "Ghosts of Creuss",
      "Mentak Coalition",
      "Nekro Virus",
      "Sardakk N'orr",
      "Vuil'raith Cabal",
      "Yin Brotherhood",
    ];
  }

  const revealOrder: Partial<Record<ObjectiveId, number>> = {};
  let order = 1;
  [...(actionLog ?? [])]
    .reverse()
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .forEach((logEntry) => {
      const objectiveId = (logEntry.data as RevealObjectiveData).event
        .objective;
      revealOrder[objectiveId] = order;
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

  const secretsByFaction: Partial<Record<FactionId, Objective[]>> = {};
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
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
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
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
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
  const selectedObjectives = new Set<ObjectiveId>();
  selectedStageOneObjectives.forEach((objective) => {
    selectedObjectives.add(objective.id);
  });
  selectedStageTwoObjectives.forEach((objective) => {
    selectedObjectives.add(objective.id);
  });

  const numStageOneObjectives = selectedStageOneObjectives.length;
  const numStageTwoObjectives = selectedStageTwoObjectives.length;

  const numRows = orderedFactionIds.length + 1;

  const custodiansToken = (objectives ?? {})["Custodians Token"];
  const custodiansScorer = (custodiansToken?.scorers ?? [])[0] as
    | FactionId
    | undefined;

  const supportForTheThrone = (objectives ?? {})["Support for the Throne"];

  const shardOfTheThrone = (objectives ?? {})["Shard of the Throne"];
  const shardScorers = shardOfTheThrone?.scorers ?? [];

  const tomb = (objectives ?? {})["Tomb + Crown of Emphidia"];

  const politicalCensure = (objectives ?? {})["Political Censure"];

  const holyPlanet = (objectives ?? {})["Holy Planet of Ixth"];
  const holyPlanetScorers = holyPlanet?.scorers ?? [];

  const crown = (objectives ?? {})["The Crown of Emphidia"];
  const crownScorers = crown?.scorers ?? [];

  const imperialRider = (objectives ?? {})["Imperial Rider"];

  const seed = (objectives ?? {})["Seed of an Empire"];

  const mutiny = (objectives ?? {})["Mutiny"];
  const mutinyDirection = mutiny?.points === 1 ? "[For]" : "[Against]";

  const displayDescription = options["display-objective-description"];

  function manualVpAdjust(increase: boolean, factionId: FactionId) {
    if (!gameid) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdateAsync(gameid, factionId, value);
  }

  return (
    <>
      <Modal
        title={getFactionName((factions ?? {})[factionId]) + " Secrets"}
        closeMenu={() => setSecretModal(false)}
        visible={!!secretModal}
      >
        <SecretModalContent factionId={factionId} />
      </Modal>
      <div className="tabletOnly">
        <div className={styles.objectiveGrid}>
          <CollapsibleSection
            title="Victory Points"
            openedByDefault
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: responsivePixels(18),
              paddingBottom: responsivePixels(8),
            }}
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
                {orderedFactionIds.map((name, index) => {
                  const faction = (factions ?? {})[name];
                  const VPs = computeVPs(
                    factions ?? {},
                    name,
                    objectives ?? {}
                  );
                  return (
                    <LabeledDiv
                      key={index}
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
                        <FactionIcon factionId={name} size="90%" />
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
            <CollapsibleSection
              title="Reveal Objective"
              openedByDefault
              style={{
                width: "100%",
                height: "fit-content",
                fontSize: responsivePixels(18),
                paddingBottom: responsivePixels(8),
              }}
            >
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
                  options={remainingStageOneObjectives.map((obj) => obj.id)}
                  hoverMenuLabel="Stage I"
                  toggleItem={(objectiveId, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      revealObjectiveAsync(gameid, objectiveId);
                    } else {
                      hideObjectiveAsync(gameid, objectiveId);
                    }
                  }}
                />
                <Selector
                  options={remainingStageTwoObjectives.map((obj) => obj.id)}
                  hoverMenuLabel="Stage II"
                  toggleItem={(objectiveId, add) => {
                    if (!gameid) {
                      return;
                    }
                    if (add) {
                      revealObjectiveAsync(gameid, objectiveId);
                    } else {
                      hideObjectiveAsync(gameid, objectiveId);
                    }
                  }}
                />
              </div>
            </CollapsibleSection>
            <div className="flexRow" style={{ width: "95%" }}>
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
                    factions={orderedFactionIds}
                    selectedFaction={custodiansScorer}
                    onSelect={(factionId) => {
                      if (!gameid) {
                        return;
                      }
                      if (custodiansScorer) {
                        unscoreObjectiveAsync(
                          gameid,
                          custodiansScorer,
                          "Custodians Token"
                        );
                      }
                      if (factionId) {
                        scoreObjectiveAsync(
                          gameid,
                          factionId,
                          "Custodians Token"
                        );
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
                style={{ width: "100%" }}
              >
                <div className="flexColumn">
                  {selectedStageOneObjectives.map((objective) => {
                    if (!objective) {
                      return (
                        <>
                          <GridHeader>???</GridHeader>
                          {orderedFactionIds.map((name) => {
                            return <div key={name}></div>;
                          })}
                        </>
                      );
                    }
                    return (
                      <React.Fragment key={objective.id}>
                        <ObjectiveRow
                          objective={objective}
                          hideScorers
                          removeObjective={
                            (objective.scorers ?? []).length === 0
                              ? () => {
                                  if (!gameid) {
                                    return;
                                  }
                                  hideObjectiveAsync(gameid, objective.id);
                                }
                              : undefined
                          }
                        />
                        <div
                          className={styles.factionIconRow}
                          style={
                            {
                              "--num-factions": orderedFactionIds.length,
                            } as NumFactionsCSS
                          }
                        >
                          {orderedFactionIds.map((factionId) => {
                            const scoredObjective = (
                              objective.scorers ?? []
                            ).includes(factionId);
                            return (
                              <div
                                key={factionId}
                                className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                                onClick={() => {
                                  if (!gameid) {
                                    return;
                                  }
                                  if (scoredObjective) {
                                    unscoreObjectiveAsync(
                                      gameid,
                                      factionId,
                                      objective.id
                                    );
                                  } else {
                                    scoreObjectiveAsync(
                                      gameid,
                                      factionId,
                                      objective.id
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
                                        (factions ?? {})[factionId]
                                      ),
                                    } as ExtendedCSS
                                  }
                                >
                                  <FactionIcon
                                    factionId={factionId}
                                    size="100%"
                                  />
                                </div>
                              </div>
                            );
                          })}
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
                style={{ width: "100%" }}
              >
                <div className="flexColumn">
                  {selectedStageTwoObjectives.map((objective) => {
                    if (!objective) {
                      return (
                        <>
                          <GridHeader>???</GridHeader>
                          {orderedFactionIds.map((name) => {
                            return <div key={name}></div>;
                          })}
                        </>
                      );
                    }
                    return (
                      <React.Fragment key={objective.id}>
                        <ObjectiveRow
                          objective={objective}
                          hideScorers
                          removeObjective={
                            (objective.scorers ?? []).length === 0
                              ? () => {
                                  if (!gameid) {
                                    return;
                                  }
                                  hideObjectiveAsync(gameid, objective.id);
                                }
                              : undefined
                          }
                        />
                        <div
                          className={styles.factionIconRow}
                          style={
                            {
                              "--num-factions": orderedFactionIds.length,
                            } as NumFactionsCSS
                          }
                        >
                          {Object.values(orderedFactionIds).map((factionId) => {
                            const scoredObjective = (
                              objective.scorers ?? []
                            ).includes(factionId);
                            return (
                              <div
                                key={factionId}
                                className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                                onClick={() => {
                                  if (!gameid) {
                                    return;
                                  }
                                  if (scoredObjective) {
                                    unscoreObjectiveAsync(
                                      gameid,
                                      factionId,
                                      objective.id
                                    );
                                  } else {
                                    scoreObjectiveAsync(
                                      gameid,
                                      factionId,
                                      objective.id
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
                                        (factions ?? {})[factionId]
                                      ),
                                    } as ExtendedCSS
                                  }
                                >
                                  <FactionIcon
                                    factionId={factionId}
                                    size="100%"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </CollapsibleSection>
            )}
            <CollapsibleSection
              title="Secrets"
              color="red"
              style={{
                width: "100%",
                height: "fit-content",
                fontSize: responsivePixels(18),
                paddingBottom: responsivePixels(8),
              }}
            >
              <div className="flexRow" style={{ width: "100%" }}>
                <div
                  className="flexRow"
                  style={{ padding: "0 8px 0 4px", width: "100%" }}
                >
                  {orderedFactionIds.map((name) => {
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
                          setFactionId(name);
                          setSecretModal(true);
                        }}
                      >
                        <FactionIcon factionId={name} size="100%" />
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
            <CollapsibleSection
              title="Imperial Points"
              style={{
                width: "100%",
                height: "fit-content",
                fontSize: responsivePixels(18),
                paddingBottom: responsivePixels(8),
              }}
            >
              <div className="flexRow" style={{ width: "100%" }}>
                <div
                  className="flexRow"
                  style={{ padding: "0 8px 0 4px", width: "100%" }}
                >
                  {orderedFactionIds.map((faction) => {
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
                              unscoreObjectiveAsync(
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
                            scoreObjectiveAsync(
                              gameid,
                              faction,
                              "Imperial Point"
                            );
                          }}
                        >
                          +
                        </div>
                        <FactionIcon factionId={faction} size="100%" />
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
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: responsivePixels(18),
              paddingBottom: responsivePixels(8),
            }}
          >
            <div className={`flexRow ${styles.collapsibleRow}`}>
              <div className={`flexRow ${styles.objRow}`}>
                {orderedFactionIds.map((id) => {
                  const scorers =
                    (supportForTheThrone?.keyedScorers ?? {})[id] ?? [];
                  const scorer = scorers[0] as FactionId | undefined;
                  return (
                    <div key={id}>
                      <FactionSelectRadialMenu
                        key={id}
                        factions={orderedFactionIds}
                        invalidFactions={[id]}
                        selectedFaction={scorer}
                        onSelect={(factionId) => {
                          if (!gameid) {
                            return;
                          }
                          if (scorer) {
                            unscoreObjectiveAsync(
                              gameid,
                              scorer,
                              "Support for the Throne",
                              id
                            );
                          }
                          if (factionId) {
                            scoreObjectiveAsync(
                              gameid,
                              factionId,
                              "Support for the Throne",
                              id
                            );
                          }
                        }}
                        tag={<FactionIcon factionId={id} size="100%" />}
                        tagBorderColor={getFactionColor((factions ?? {})[id])}
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
          <CollapsibleSection
            title="Other Victory Points"
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: responsivePixels(18),
              paddingBottom: responsivePixels(8),
            }}
          >
            <div
              className={"flexColumn " + styles.collapsibleRow}
              style={{ width: "100%" }}
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
                  objective={imperialRider}
                  orderedFactionNames={orderedFactionIds}
                  numScorers={includesPoK ? 2 : 1}
                  info="Can be scored 2x due to The Codex"
                />
                <SimpleScorable
                  objective={politicalCensure}
                  orderedFactionNames={orderedFactionIds}
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
                    orderedFactionNames={orderedFactionIds}
                  />
                  <SimpleScorable
                    objective={tomb}
                    orderedFactionNames={orderedFactionIds}
                  />
                </div>
              ) : null}
              <SimpleScorable
                objective={holyPlanet}
                orderedFactionNames={orderedFactionIds}
                numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed."
              />
              {!includesPoK ? (
                <SimpleScorable
                  objective={shardOfTheThrone}
                  orderedFactionNames={orderedFactionIds}
                  numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                  info="Can be scored 2x due to Miscount Disclosed"
                />
              ) : null}
              <SimpleScorable
                objective={crown}
                orderedFactionNames={orderedFactionIds}
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
                          setObjectivePointsAsync(gameid, "Mutiny", -1);
                        } else {
                          setObjectivePointsAsync(gameid, "Mutiny", 1);
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
                        "--num-factions": orderedFactionIds.length,
                      } as NumFactionsCSS
                    }
                  >
                    {Object.values(orderedFactionIds).map((factionId) => {
                      const scoredObjective = (mutiny?.scorers ?? []).includes(
                        factionId
                      );
                      return (
                        <div
                          key={factionId}
                          className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjectiveAsync(
                                gameid,
                                factionId,
                                mutiny.id
                              );
                            } else {
                              scoreObjectiveAsync(gameid, factionId, mutiny.id);
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
                                  (factions ?? {})[factionId]
                                ),
                              } as ExtendedCSS
                            }
                          >
                            <FactionIcon factionId={factionId} size="100%" />
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
                        "--num-factions": orderedFactionIds.length,
                      } as NumFactionsCSS
                    }
                  >
                    {Object.values(orderedFactionIds).map((factionId) => {
                      const scoredObjective = (seed?.scorers ?? []).includes(
                        factionId
                      );
                      return (
                        <div
                          key={factionId}
                          className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjectiveAsync(gameid, factionId, seed.id);
                            } else {
                              scoreObjectiveAsync(gameid, factionId, seed.id);
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
                                  (factions ?? {})[factionId]
                                ),
                              } as ExtendedCSS
                            }
                          >
                            <FactionIcon factionId={factionId} size="100%" />
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
          paddingLeft: (options["game-variant"] ?? "normal").startsWith(
            "alliance"
          )
            ? responsivePixels(24)
            : undefined,
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
          {orderedFactionIds.map((name, index) => {
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
                  // overflow: "hidden",
                }}
              >
                {(options["game-variant"] ?? "normal").startsWith("alliance") &&
                index % 2 !== 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "-4px",
                      transform: "rotate(270deg)",
                      transformOrigin: "left bottom",
                      backgroundColor: "#222",
                      padding: `0 ${responsivePixels(4)}`,
                    }}
                  >
                    Alliance
                  </div>
                ) : null}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    opacity: 0.5,
                    zIndex: -1,
                  }}
                >
                  <FactionIcon factionId={name} size="100%" />
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

          {orderedFactionIds.map((name) => {
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
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button
              onClick={() => {
                if (!gameid) {
                  return;
                }
                changeOptionAsync(
                  gameid,
                  "display-objective-description",
                  !displayDescription
                );
              }}
              style={{
                fontSize: responsivePixels(16),
              }}
            >
              Display {displayDescription ? "Titles" : "Descriptions"}
            </button>
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
                options={remainingStageOneObjectives.map((obj) => obj.id)}
                hoverMenuLabel="Stage I"
                toggleItem={(objectiveId, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    revealObjectiveAsync(gameid, objectiveId);
                  } else {
                    hideObjectiveAsync(gameid, objectiveId);
                  }
                }}
              />
              <Selector
                options={remainingStageTwoObjectives.map((obj) => obj.id)}
                hoverMenuLabel="Stage II"
                toggleItem={(objectiveId, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    revealObjectiveAsync(gameid, objectiveId);
                  } else {
                    hideObjectiveAsync(gameid, objectiveId);
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
                  {orderedFactionIds.map((name) => {
                    return <div key={name}></div>;
                  })}
                </>
              );
            }
            return (
              <ObjectiveColumn
                key={objective.id}
                objective={objective}
                factions={factions ?? {}}
                orderedFactionIds={orderedFactionIds}
                options={options}
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
                marginBottom: responsivePixels(-68),
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
                marginBottom: responsivePixels(-72),
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
                marginBottom: responsivePixels(-68),
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
                key={objective.id}
                objective={objective}
                factions={factions ?? {}}
                orderedFactionIds={orderedFactionIds}
                options={options}
              />
            );
          })}
          <GridHeader>Secrets</GridHeader>
          {orderedFactionIds.map((name) => {
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
                  setFactionId(name);
                  setSecretModal(true);
                }}
              >
                <FactionIcon factionId={name} size="80%" />
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
                  factions={orderedFactionIds}
                  selectedFaction={custodiansScorer}
                  onSelect={(factionId) => {
                    if (!gameid) {
                      return;
                    }
                    if (custodiansScorer) {
                      unscoreObjectiveAsync(
                        gameid,
                        custodiansScorer,
                        "Custodians Token"
                      );
                    }
                    if (factionId) {
                      scoreObjectiveAsync(
                        gameid,
                        factionId,
                        "Custodians Token"
                      );
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
              {orderedFactionIds.map((factionId) => {
                const scorers =
                  (supportForTheThrone?.keyedScorers ?? {})[factionId] ?? [];
                const scorer = scorers[0] as FactionId | undefined;
                return (
                  <div
                    key={factionId}
                    style={{
                      position: "relative",
                      width: "fit-content",
                      height: "100%",
                    }}
                  >
                    <FactionSelectRadialMenu
                      key={factionId}
                      factions={orderedFactionIds}
                      invalidFactions={orderedFactions
                        .filter(
                          (faction) =>
                            faction.id === factionId ||
                            faction.alliancePartner === factionId
                        )
                        .map((faction) => faction.id)}
                      selectedFaction={scorer}
                      onSelect={(selectedFactionId) => {
                        if (!gameid) {
                          return;
                        }
                        if (scorer) {
                          unscoreObjectiveAsync(
                            gameid,
                            scorer,
                            "Support for the Throne",
                            factionId
                          );
                        }
                        if (selectedFactionId) {
                          scoreObjectiveAsync(
                            gameid,
                            selectedFactionId,
                            "Support for the Throne",
                            factionId
                          );
                        }
                      }}
                      tag={<FactionIcon factionId={factionId} size="100%" />}
                      tagBorderColor={getFactionColor(
                        (factions ?? {})[factionId]
                      )}
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
              {orderedFactionIds.map((faction) => {
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
                          unscoreObjectiveAsync(
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
                        scoreObjectiveAsync(gameid, faction, "Imperial Point");
                      }}
                    >
                      +
                    </div>
                    <FactionIcon factionId={faction} size="100%" />
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
              orderedFactionNames={orderedFactionIds}
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
                  orderedFactionNames={orderedFactionIds}
                />
                <SimpleScorable
                  objective={tomb}
                  orderedFactionNames={orderedFactionIds}
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
              orderedFactionNames={orderedFactionIds}
              numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            {!includesPoK ? (
              <SimpleScorable
                objective={shardOfTheThrone}
                orderedFactionNames={orderedFactionIds}
                numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed"
              />
            ) : null}
            <SimpleScorable
              objective={crown}
              orderedFactionNames={orderedFactionIds}
              numScorers={!holyPlanetScorers[1] && !shardScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            <SimpleScorable
              objective={politicalCensure}
              orderedFactionNames={orderedFactionIds}
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
                        setObjectivePointsAsync(gameid, "Mutiny", -1);
                      } else {
                        setObjectivePointsAsync(gameid, "Mutiny", 1);
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
                      "--num-factions": orderedFactionIds.length,
                    } as NumFactionsCSS
                  }
                >
                  {Object.values(orderedFactionIds).map((factionId) => {
                    const scoredObjective = (mutiny?.scorers ?? []).includes(
                      factionId
                    );
                    return (
                      <div
                        key={factionId}
                        className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjectiveAsync(gameid, factionId, mutiny.id);
                          } else {
                            scoreObjectiveAsync(gameid, factionId, mutiny.id);
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
                                (factions ?? {})[factionId]
                              ),
                            } as ExtendedCSS
                          }
                        >
                          <FactionIcon factionId={factionId} size="100%" />
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
                      "--num-factions": orderedFactionIds.length,
                    } as NumFactionsCSS
                  }
                >
                  {Object.values(orderedFactionIds).map((factionId) => {
                    const scoredObjective = (seed?.scorers ?? []).includes(
                      factionId
                    );
                    return (
                      <div
                        key={factionId}
                        className={`flexRow ${styles.selected} ${styles.factionIconWrapper}`}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjectiveAsync(gameid, factionId, seed.id);
                          } else {
                            scoreObjectiveAsync(gameid, factionId, seed.id);
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
                                (factions ?? {})[factionId]
                              ),
                            } as ExtendedCSS
                          }
                        >
                          <FactionIcon factionId={factionId} size="100%" />
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
  orderedFactionNames: FactionId[];
  numScorers?: number;
  info?: string;
}) {
  const router = useRouter();
  const { game: gameId }: { game?: string } = router.query;
  const factions = useContext(FactionContext);

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
            selectedFaction={objectiveScorers[0] as FactionId | undefined}
            factions={orderedFactionNames}
            onSelect={(factionId) => {
              if (!gameId) {
                return;
              }
              if (objectiveScorers[0]) {
                unscoreObjectiveAsync(
                  gameId,
                  objectiveScorers[0],
                  objective.id
                );
              }
              if (factionId) {
                scoreObjectiveAsync(gameId, factionId, objective.id);
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
              selectedFaction={objectiveScorers[1] as FactionId | undefined}
              factions={orderedFactionNames}
              onSelect={(factionId) => {
                if (!gameId) {
                  return;
                }
                if (objectiveScorers[1]) {
                  unscoreObjectiveAsync(
                    gameId,
                    objectiveScorers[1],
                    objective.id
                  );
                }
                if (factionId) {
                  scoreObjectiveAsync(gameId, factionId, objective.id);
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
