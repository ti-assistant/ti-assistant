import Image from "next/image";
import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { GameIdContext } from "../context/Context";
import {
  useActionLog,
  useFactions,
  useGameState,
  useObjectives,
  useOptions,
} from "../context/dataHooks";
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
import { objectiveTypeString } from "../util/strings";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import Modal from "./Modal/Modal";
import styles from "./ObjectivePanel.module.scss";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "./ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "./Selector/Selector";
import { Optional } from "../util/types/types";

function GridHeader({ children }: PropsWithChildren) {
  return (
    <div
      className="flexColumn"
      style={{
        height: "100%",
        justifyContent: "flex-end",
        fontSize: "14px",
        minWidth: "62px",
        maxWidth: "92px",
        padding: `0 ${"2px"}`,
        whiteSpace: "normal",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "84px", height: "100%" }}>{children}</div>
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
        maxWidth: "800px",
        width: "100%",
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
      }}
    >
      {objective.description}
    </div>
  );
}

function ObjectiveColumn({
  gameId,
  objective,
  factions,
  orderedFactionIds,
  options,
}: {
  gameId: string;
  objective: Objective;
  factions: Partial<Record<FactionId, Faction>>;
  orderedFactionIds: FactionId[];
  options: Options;
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const numScorers = (objective.scorers ?? []).length;

  const description = options["display-objective-description"];

  return (
    <>
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={<div style={{ fontSize: "40px" }}>{objective.name}</div>}
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
            gap: "2px",
            position: "relative",
            fontFamily: description ? "Myriad Pro" : undefined,
            fontSize: description ? "12px" : undefined,
          }}
        >
          {numScorers === 0 ? (
            <div
              className="icon clickable negative"
              onClick={() => {
                if (!gameId) {
                  return;
                }
                hideObjectiveAsync(gameId, objective.id);
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
              style={{ paddingRight: "8px" }}
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
              if (!gameId) {
                return;
              }
              if (scoredObjective) {
                unscoreObjectiveAsync(gameId, factionId, objective.id);
              } else {
                scoreObjectiveAsync(gameId, factionId, objective.id);
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

function SecretModalContent({
  factionId,
  gameId,
}: {
  factionId: FactionId;
  gameId: string;
}) {
  const objectives = useObjectives();

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
        padding: "8px",
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
              if (!gameId) {
                return;
              }
              unscoreObjectiveAsync(gameId, factionId, secret.id);
            }}
          />
        );
      })}
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {scoredSecrets.length < 6 ? (
          <ObjectiveSelectHoverMenu
            action={(gameId, objectiveId) =>
              scoreObjectiveAsync(gameId, factionId, objectiveId)
            }
            fontSize="14px"
            label={
              <FormattedMessage
                id="zlpl9F"
                defaultMessage="Score Secret Objective"
                description="Message telling a player to score a secret objective."
              />
            }
            objectives={availableSecrets}
            perColumn={10}
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

export default function ObjectivePanel() {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
  const state = useGameState();

  const intl = useIntl();

  const [factionId, setFactionId] = useState<FactionId>("Vuil'raith Cabal");
  const [secretModal, setSecretModal] = useState(false);

  const includesPoK = (options.expansions ?? []).includes("POK");

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
  const custodiansScorer = (custodiansToken?.scorers ??
    [])[0] as Optional<FactionId>;

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
    if (!gameId) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdateAsync(gameId, factionId, value);
  }

  return (
    <>
      <Modal
        title={
          getFactionName((factions ?? {})[factionId]) +
          " " +
          intl.formatMessage({
            id: "QrrIrN",
            description: "The title of secret objectives.",
            defaultMessage: "Secrets",
          })
        }
        closeMenu={() => setSecretModal(false)}
        visible={!!secretModal}
      >
        <SecretModalContent factionId={factionId} gameId={gameId} />
      </Modal>
      <div className="tabletOnly">
        <div className={styles.objectiveGrid}>
          <CollapsibleSection
            title={
              <FormattedMessage
                id="R06tnh"
                description="A label for a selector specifying the number of victory points required."
                defaultMessage="Victory Points"
              />
            }
            openedByDefault
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: "18px",
              paddingBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  padding: "8px",
                  paddingBottom: 0,
                  gap: "8px",
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
                          fontSize: "28px",
                          width: "100%",
                        }}
                      >
                        {VPs > 0 ? (
                          <div
                            className="arrowDown"
                            onClick={() => manualVpAdjust(false, name)}
                          ></div>
                        ) : (
                          <div style={{ width: "12px" }}></div>
                        )}
                        <div className="flexRow" style={{ width: "24px" }}>
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
                fontSize: "18px",
                paddingBottom: "8px",
              }}
            >
              <div
                className={`flexColumn ${styles.collapsibleRow}`}
                style={{
                  display: "flex",
                  marginLeft: "8px",
                  width: "min-content",
                  flexDirection: "column",
                  alignItems: "stretch",
                  overflow: "visible",
                }}
              >
                <Selector
                  options={remainingStageOneObjectives}
                  hoverMenuLabel={objectiveTypeString("STAGE ONE", intl)}
                  renderButton={(itemId, itemName, toggleItem) => {
                    return (
                      <button
                        key={itemId}
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          toggleItem(itemId, true);
                        }}
                      >
                        {itemName}
                      </button>
                    );
                  }}
                  toggleItem={(objectiveId, add) => {
                    if (!gameId) {
                      return;
                    }
                    if (add) {
                      revealObjectiveAsync(gameId, objectiveId);
                    } else {
                      hideObjectiveAsync(gameId, objectiveId);
                    }
                  }}
                />
                <Selector
                  options={remainingStageTwoObjectives}
                  hoverMenuLabel={objectiveTypeString("STAGE TWO", intl)}
                  renderButton={(itemId, itemName, toggleItem) => {
                    return (
                      <button
                        key={itemId}
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          toggleItem(itemId, true);
                        }}
                      >
                        {itemName}
                      </button>
                    );
                  }}
                  toggleItem={(objectiveId, add) => {
                    if (!gameId) {
                      return;
                    }
                    if (add) {
                      revealObjectiveAsync(gameId, objectiveId);
                    } else {
                      hideObjectiveAsync(gameId, objectiveId);
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
                  width: "72px",
                  height: "72px",
                }}
              >
                <Image
                  src={`/images/custodians.png`}
                  alt={`Custodians Token`}
                  fill
                  style={{ objectFit: "contain" }}
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
                      if (!gameId) {
                        return;
                      }
                      if (custodiansScorer) {
                        unscoreObjectiveAsync(
                          gameId,
                          custodiansScorer,
                          "Custodians Token"
                        );
                      }
                      if (factionId) {
                        scoreObjectiveAsync(
                          gameId,
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
                title={objectiveTypeString("STAGE ONE", intl)}
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
                                  if (!gameId) {
                                    return;
                                  }
                                  hideObjectiveAsync(gameId, objective.id);
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
                                  if (!gameId) {
                                    return;
                                  }
                                  if (scoredObjective) {
                                    unscoreObjectiveAsync(
                                      gameId,
                                      factionId,
                                      objective.id
                                    );
                                  } else {
                                    scoreObjectiveAsync(
                                      gameId,
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
                title={objectiveTypeString("STAGE TWO", intl)}
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
                                  if (!gameId) {
                                    return;
                                  }
                                  hideObjectiveAsync(gameId, objective.id);
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
                                  if (!gameId) {
                                    return;
                                  }
                                  if (scoredObjective) {
                                    unscoreObjectiveAsync(
                                      gameId,
                                      factionId,
                                      objective.id
                                    );
                                  } else {
                                    scoreObjectiveAsync(
                                      gameId,
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
              title={
                <FormattedMessage
                  id="QrrIrN"
                  description="The title of secret objectives."
                  defaultMessage="Secrets"
                />
              }
              color="red"
              style={{
                width: "100%",
                height: "fit-content",
                fontSize: "18px",
                paddingBottom: "8px",
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
                              boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                              width: "24px",
                              height: "24px",
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
              title={
                <FormattedMessage
                  id="eGEjSH"
                  description="The title of points granted from using Imperial."
                  defaultMessage="Imperial Points"
                />
              }
              style={{
                width: "100%",
                height: "fit-content",
                fontSize: "18px",
                paddingBottom: "8px",
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
                              height: "16px",
                              width: "16px",
                              border: `${"1px"} solid #333`,
                              borderRadius: "100%",
                              fontSize: "12px",
                              backgroundColor: "#222",
                              boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                              cursor: "pointer",
                              zIndex: 2,
                            }}
                            onClick={() => {
                              if (!gameId) {
                                return;
                              }
                              unscoreObjectiveAsync(
                                gameId,
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
                            border: `${"1px"} solid #333`,
                            fontWeight: "bold",
                            borderRadius: "100%",
                            height: "16px",
                            width: "16px",
                            fontSize: "12px",
                            backgroundColor: "#222",
                            boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={() => {
                            if (!gameId) {
                              return;
                            }
                            scoreObjectiveAsync(
                              gameId,
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
                            boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                            width: "24px",
                            height: "24px",
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
            title={
              <FormattedMessage
                id="Objectives.Support for the Throne.Title"
                description="Title of Objective: Support for the Throne"
                defaultMessage="Support for the Throne"
              />
            }
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: "18px",
              paddingBottom: "8px",
            }}
          >
            <div className={`flexRow ${styles.collapsibleRow}`}>
              <div className={`flexRow ${styles.objRow}`}>
                {orderedFactionIds.map((id) => {
                  const scorers =
                    (supportForTheThrone?.keyedScorers ?? {})[id] ?? [];
                  const scorer = scorers[0] as Optional<FactionId>;
                  return (
                    <div key={id}>
                      <FactionSelectRadialMenu
                        key={id}
                        factions={orderedFactionIds}
                        invalidFactions={[id]}
                        selectedFaction={scorer}
                        onSelect={(factionId) => {
                          if (!gameId) {
                            return;
                          }
                          if (scorer) {
                            unscoreObjectiveAsync(
                              gameId,
                              scorer,
                              "Support for the Throne",
                              id
                            );
                          }
                          if (factionId) {
                            scoreObjectiveAsync(
                              gameId,
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
            title={
              <FormattedMessage
                id="nxPdWZ"
                description="The title of a section for assorted victory points."
                defaultMessage="Other Victory Points"
              />
            }
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: "18px",
              paddingBottom: "8px",
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
                  gameId={gameId}
                  objective={imperialRider}
                  orderedFactionNames={orderedFactionIds}
                  numScorers={includesPoK ? 2 : 1}
                  info="Can be scored 2x due to The Codex"
                />
                <SimpleScorable
                  gameId={gameId}
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
                    gameId={gameId}
                    objective={shardOfTheThrone}
                    orderedFactionNames={orderedFactionIds}
                  />
                  <SimpleScorable
                    gameId={gameId}
                    objective={tomb}
                    orderedFactionNames={orderedFactionIds}
                  />
                </div>
              ) : null}
              <SimpleScorable
                gameId={gameId}
                objective={holyPlanet}
                orderedFactionNames={orderedFactionIds}
                numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed."
              />
              {!includesPoK ? (
                <SimpleScorable
                  gameId={gameId}
                  objective={shardOfTheThrone}
                  orderedFactionNames={orderedFactionIds}
                  numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                  info="Can be scored 2x due to Miscount Disclosed"
                />
              ) : null}
              <SimpleScorable
                gameId={gameId}
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
                      style={{ fontSize: "14px" }}
                      onClick={() => {
                        if (!gameId) {
                          return;
                        }
                        if (mutinyDirection === "[For]") {
                          setObjectivePointsAsync(gameId, "Mutiny", -1);
                        } else {
                          setObjectivePointsAsync(gameId, "Mutiny", 1);
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
                            if (!gameId) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjectiveAsync(
                                gameId,
                                factionId,
                                mutiny.id
                              );
                            } else {
                              scoreObjectiveAsync(gameId, factionId, mutiny.id);
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
                            if (!gameId) {
                              return;
                            }
                            if (scoredObjective) {
                              unscoreObjectiveAsync(gameId, factionId, seed.id);
                            } else {
                              scoreObjectiveAsync(gameId, factionId, seed.id);
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
          padding: "8px",
          paddingLeft: (options["game-variant"] ?? "normal").startsWith(
            "alliance"
          )
            ? "24px"
            : "8px",
          height: "100%",
          gap: "24px",
          isolation: "isolate",
          backgroundColor: "#222",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "grid",
            rowGap: "4px",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            minHeight: 0,
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${numRows}, 2fr)`,
          }}
        >
          {/* TODO: Move to options menu */}
          <button
            onClick={() => {
              if (!gameId) {
                return;
              }
              changeOptionAsync(
                gameId,
                "display-objective-description",
                !displayDescription
              );
            }}
            style={{
              fontSize: "16px",
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            {displayDescription ? (
              <FormattedMessage
                id="entq4x"
                description="Text on a button that will display titles."
                defaultMessage="Display Titles"
              />
            ) : (
              <FormattedMessage
                id="e1q7sg"
                description="Text on a button that will display descriptions."
                defaultMessage="Display Descriptions"
              />
            )}
          </button>
          {orderedFactionIds.map((name, index) => {
            return (
              <div
                key={name}
                className="flexColumn"
                style={{
                  justifyContent: "center",
                  padding: `0 ${"8px"}`,
                  height: "100%",
                  position: "relative",
                  borderRadius: "5px",
                  border: `${"2px"} solid ${getFactionColor(
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
                      padding: `0 ${"4px"}`,
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
              padding: `0 ${"8px"}`,
            }}
          >
            <FormattedMessage
              id="PzyYtG"
              description="Shortened version of Victory Points."
              defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
              values={{ count: 2 }}
            />
          </div>
          {orderedFactionIds.map((name) => {
            return (
              <div
                key={name}
                className="flexRow"
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "24px",
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
              paddingTop: "36px",
            }}
          >
            <LabeledDiv
              label={
                <FormattedMessage
                  id="6L07nG"
                  description="Text telling the user to reveal an objective."
                  defaultMessage="Reveal Objective"
                />
              }
              noBlur={true}
              style={{
                flexDirection: "row",
                width: "min-content",
                alignItems: "stretch",
                gridRow: "1 / 2",
                fontSize: "14px",
              }}
            >
              <ObjectiveSelectHoverMenu
                action={revealObjectiveAsync}
                label={objectiveTypeString("STAGE ONE", intl)}
                objectives={remainingStageOneObjectives}
                fontSize="14px"
              />
              <ObjectiveSelectHoverMenu
                action={revealObjectiveAsync}
                label={objectiveTypeString("STAGE TWO", intl)}
                objectives={remainingStageTwoObjectives}
                fontSize="14px"
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
                gameId={gameId}
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
              fontSize: "80px",
            }}
          >
            <div
              className="flexRow"
              style={{
                border: `${"5px"} solid red`,
                width: "60px",
                height: "60px",
                borderRadius: "100%",
                fontSize: "44px",
              }}
            >
              <FormattedMessage
                id="2HJ0k5"
                description="The letter used to identify secret objectives."
                defaultMessage="S"
              />
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
              borderLeft: `${"1px"} solid orange`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: "-68px",
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${"4px"}`,
                color: "orange",
                whiteSpace: "nowrap",
              }}
            >
              {objectiveTypeString("STAGE ONE", intl)}
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
              borderLeft: `${"1px"} solid royalblue`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: "-72px",
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${"4px"}`,
                color: "royalblue",
                whiteSpace: "nowrap",
              }}
            >
              {objectiveTypeString("STAGE TWO", intl)}
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
              borderLeft: `${"1px"} solid red`,
              borderRight: `${"1px"} solid grey`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                marginBottom: "-68px",
                transform: "rotate(270deg)",
                transformOrigin: "left center",
                backgroundColor: "#222",
                padding: `0 ${"4px"}`,
                color: "red",
              }}
            >
              <FormattedMessage
                id="QrrIrN"
                description="The title of secret objectives."
                defaultMessage="Secrets"
              />
            </div>
          </div>
          {selectedStageTwoObjectives.map((objective) => {
            return (
              <ObjectiveColumn
                key={objective.id}
                gameId={gameId}
                objective={objective}
                factions={factions ?? {}}
                orderedFactionIds={orderedFactionIds}
                options={options}
              />
            );
          })}
          <GridHeader>
            <FormattedMessage
              id="QrrIrN"
              description="The title of secret objectives."
              defaultMessage="Secrets"
            />
          </GridHeader>
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
                  padding: `0 ${"8px"}`,
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
                      boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                      width: "24px",
                      height: "24px",
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
            gap: "8px",
            paddingBottom: "4px",
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
                width: "72px",
                height: "72px",
              }}
            >
              <Image
                src={`/images/custodians.png`}
                alt={`Custodians Token`}
                fill
                style={{ objectFit: "contain" }}
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
                    if (!gameId) {
                      return;
                    }
                    if (custodiansScorer) {
                      unscoreObjectiveAsync(
                        gameId,
                        custodiansScorer,
                        "Custodians Token"
                      );
                    }
                    if (factionId) {
                      scoreObjectiveAsync(
                        gameId,
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
            label={
              <FormattedMessage
                id="Objectives.Support for the Throne.Title"
                description="Title of Objective: Support for the Throne"
                defaultMessage="Support for the Throne"
              />
            }
            style={{ gridColumn: "3 / 9" }}
          >
            <div
              className="flexRow"
              style={{ justifyContent: "space-evenly", width: "100%" }}
            >
              {orderedFactionIds.map((factionId) => {
                const scorers =
                  (supportForTheThrone?.keyedScorers ?? {})[factionId] ?? [];
                const scorer = scorers[0] as Optional<FactionId>;
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
                        if (!gameId) {
                          return;
                        }
                        if (scorer) {
                          unscoreObjectiveAsync(
                            gameId,
                            scorer,
                            "Support for the Throne",
                            factionId
                          );
                        }
                        if (selectedFactionId) {
                          scoreObjectiveAsync(
                            gameId,
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
            label={
              <FormattedMessage
                id="eGEjSH"
                description="The title of points granted from using Imperial."
                defaultMessage="Imperial Points"
              />
            }
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
                      width: "36px",
                      height: "36px",
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
                          height: "16px",
                          width: "16px",
                          border: `${"1px"} solid #333`,
                          borderRadius: "100%",
                          fontSize: "12px",
                          backgroundColor: "#222",
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        onClick={() => {
                          if (!gameId) {
                            return;
                          }
                          unscoreObjectiveAsync(
                            gameId,
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
                        border: `${"1px"} solid #333`,
                        fontWeight: "bold",
                        borderRadius: "100%",
                        height: "16px",
                        width: "16px",
                        fontSize: "12px",
                        backgroundColor: "#222",
                        boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                      onClick={() => {
                        if (!gameId) {
                          return;
                        }
                        scoreObjectiveAsync(gameId, faction, "Imperial Point");
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
                        boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                        width: "24px",
                        height: "24px",
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
              gameId={gameId}
              objective={imperialRider}
              orderedFactionNames={orderedFactionIds}
              numScorers={includesPoK ? 2 : 1}
              info="Can be scored 2x due to The Codex"
            />
          </div>
          {includesPoK ? (
            <LabeledDiv
              noBlur={true}
              label={
                <FormattedMessage
                  id="pPpzkR"
                  description="The title of relic cards."
                  defaultMessage="Relics"
                />
              }
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
                  gameId={gameId}
                  objective={shardOfTheThrone}
                  orderedFactionNames={orderedFactionIds}
                />
                <SimpleScorable
                  gameId={gameId}
                  objective={tomb}
                  orderedFactionNames={orderedFactionIds}
                />
              </div>
            </LabeledDiv>
          ) : null}
          <LabeledDiv
            noBlur={true}
            label={
              <FormattedMessage
                id="hMWeZX"
                description="Agendas that apply a continuing effect to the game."
                defaultMessage="Laws"
              />
            }
            style={{
              flexDirection: "row",
              gridColumn: includesPoK ? "6/8" : "3/ 8",
              width: "100%",
              height: "100%",
            }}
          >
            <SimpleScorable
              gameId={gameId}
              objective={holyPlanet}
              orderedFactionNames={orderedFactionIds}
              numScorers={!shardScorers[1] && !crownScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            {!includesPoK ? (
              <SimpleScorable
                gameId={gameId}
                objective={shardOfTheThrone}
                orderedFactionNames={orderedFactionIds}
                numScorers={!holyPlanetScorers[1] && !crownScorers[1] ? 2 : 1}
                info="Can be scored 2x due to Miscount Disclosed"
              />
            ) : null}
            <SimpleScorable
              gameId={gameId}
              objective={crown}
              orderedFactionNames={orderedFactionIds}
              numScorers={!holyPlanetScorers[1] && !shardScorers[1] ? 2 : 1}
              info="Can be scored 2x due to Miscount Disclosed."
            />
            <SimpleScorable
              gameId={gameId}
              objective={politicalCensure}
              orderedFactionNames={orderedFactionIds}
            />
          </LabeledDiv>
          <LabeledDiv
            noBlur={true}
            label={
              <FormattedMessage
                id="t6v2oN"
                description="Agenda cards that do not have an ongoing effect."
                defaultMessage="Directives"
              />
            }
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
                    style={{ fontSize: "14px" }}
                    onClick={() => {
                      if (!gameId) {
                        return;
                      }
                      if (mutinyDirection === "[For]") {
                        setObjectivePointsAsync(gameId, "Mutiny", -1);
                      } else {
                        setObjectivePointsAsync(gameId, "Mutiny", 1);
                      }
                    }}
                  >
                    {mutinyDirection === "[For]"
                      ? `[${intl.formatMessage({
                          id: "ymJxS0",
                          defaultMessage: "For",
                          description: "Outcome choosing to pass a law.",
                        })}]`
                      : `[${intl.formatMessage({
                          id: "SOC2Bh",
                          defaultMessage: "Against",
                          description: "Outcome choosing to vote down a law.",
                        })}]`}
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
                          if (!gameId) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjectiveAsync(gameId, factionId, mutiny.id);
                          } else {
                            scoreObjectiveAsync(gameId, factionId, mutiny.id);
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
                          if (!gameId) {
                            return;
                          }
                          if (scoredObjective) {
                            unscoreObjectiveAsync(gameId, factionId, seed.id);
                          } else {
                            scoreObjectiveAsync(gameId, factionId, seed.id);
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
  gameId,
  objective,
  orderedFactionNames,
  numScorers = 1,
  info,
}: {
  gameId: string;
  objective: Optional<Objective>;
  orderedFactionNames: FactionId[];
  numScorers?: number;
  info?: string;
}) {
  const factions = useFactions();

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
        title={<div style={{ fontSize: "40px" }}>{objective.name}</div>}
        level={2}
      >
        <div
          className="flexRow myriadPro"
          style={{
            boxSizing: "border-box",
            maxWidth: "800px",
            width: "100%",
            minWidth: "320px",
            padding: "4px",
            whiteSpace: "pre-line",
            textAlign: "center",
            fontSize: "32px",
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
            selectedFaction={objectiveScorers[0] as Optional<FactionId>}
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
              selectedFaction={objectiveScorers[1] as Optional<FactionId>}
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
                  style={{ marginLeft: "0px", color: "#999" }}
                  onClick={() => setShowInfoModal(true)}
                >
                  &#x24D8;
                </div>
              }
              borderColor={
                objectiveScorers[1]
                  ? getFactionColor(factions[objectiveScorers[1]])
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
