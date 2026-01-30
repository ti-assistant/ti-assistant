import React, { CSSProperties, use } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ModalContext } from "../../../context/contexts";
import { useGameId, useOptions, useViewOnly } from "../../../context/dataHooks";
import {
  useManualFactionVPs,
  useOrderedFactionIds,
  useScoredFactionVPs,
} from "../../../context/gameDataHooks";
import {
  useObjectiveRevealOrder,
  useObjectives,
} from "../../../context/objectiveDataHooks";
import {
  hideObjectiveAsync,
  manualVPUpdateAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  setObjectivePointsAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { getColorForFaction } from "../../../util/factions";
import { objectiveTypeString } from "../../../util/strings";
import { rem } from "../../../util/util";
import { CollapsibleSection } from "../../CollapsibleSection";
import FactionComponents from "../../FactionComponents/FactionComponents";
import FactionName from "../../FactionComponents/FactionName";
import FactionIcon from "../../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../LabeledDiv/LabeledDiv";
import { ModalContent } from "../../Modal/Modal";
import ObjectiveRow from "../../ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "../../Selector/Selector";
import styles from "../ObjectivePanel.module.scss";
import CustodiansToken from "./CustodiansToken";
import GridHeader from "./GridHeader";
import ScorableFactionIcon from "./ScorableFactionIcon";
import SimpleScorable from "./SimpleScorable";
import Styx from "./Styx";

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

export default function MobileObjectiveGrid() {
  const gameId = useGameId();
  const intl = useIntl();
  const objectives = useObjectives();
  const options = useOptions();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const revealOrder = useObjectiveRevealOrder();
  const viewOnly = useViewOnly();

  const { openModal } = use(ModalContext);

  const totalWar = (options.events ?? []).includes("Total War");

  const objectiveArray = Object.values(objectives);

  const stageOneObjectives: Objective[] = objectiveArray.filter(
    (obj) => obj.type === "STAGE ONE",
  );
  const stageTwoObjectives: Objective[] = objectiveArray.filter(
    (obj) => obj.type === "STAGE TWO",
  );
  const secretObjectives = objectiveArray.filter(
    (obj) => obj.type === "SECRET",
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
    (obj) => !obj.selected,
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
    (obj) => !obj.selected,
  );
  const remainingSecretObjectives = secretObjectives.filter(
    (obj) => !obj.selected,
  );

  const includesPoK = options.expansions.includes("POK");
  const includesTE = options.expansions.includes("THUNDERS EDGE");

  const mutiny = objectives["Mutiny"];
  const mutinyDirection = mutiny?.points === 1 ? "[For]" : "[Against]";

  const seed = objectives["Seed of an Empire"];
  const supportForTheThrone = objectives["Support for the Throne"];

  return (
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
          fontSize: rem(18),
          paddingBottom: rem(8),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
            padding: rem(8),
            paddingBottom: 0,
            gap: rem(8),
            isolation: "isolate",
          }}
        >
          {orderedFactionIds.map((factionId) => {
            return <FactionNameAndVPs key={factionId} factionId={factionId} />;
          })}
        </div>
      </CollapsibleSection>
      <div
        className={styles.custodians}
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: viewOnly ? undefined : "repeat(2, 1fr)",
          width: "100%",
        }}
      >
        {viewOnly ? null : (
          <CollapsibleSection
            title="Reveal Objective"
            openedByDefault
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: rem(18),
              paddingBottom: rem(8),
            }}
          >
            <div
              className={`flexColumn ${styles.collapsibleRow}`}
              style={{
                display: "flex",
                margin: `0 ${rem(8)}`,
                width: "min-content",
                flexDirection: "column",
                alignItems: "stretch",
                overflow: "visible",
              }}
            >
              <Selector
                options={remainingStageOneObjectives}
                hoverMenuLabel={objectiveTypeString("STAGE ONE", intl)}
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
                options={remainingSecretObjectives}
                hoverMenuLabel={"Secret (as Public)"}
                itemsPerColumn={10}
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
        )}
        <div
          className="flexRow"
          style={{
            width: "95%",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: rem(16),
          }}
        >
          <CustodiansToken />
          <Styx />
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
                        (objective.scorers ?? []).length === 0 && !viewOnly
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
                        return (
                          <ScorableFactionIcon
                            key={factionId}
                            factionId={factionId}
                            objective={objective}
                          />
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
                        (objective.scorers ?? []).length === 0 && !viewOnly
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
                        return (
                          <ScorableFactionIcon
                            key={factionId}
                            factionId={factionId}
                            objective={objective}
                          />
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
            fontSize: rem(18),
            paddingBottom: rem(8),
          }}
        >
          <div className="flexRow" style={{ width: "100%" }}>
            <div
              className="flexRow"
              style={{ padding: `0 ${rem(8)} 0 ${rem(4)}`, width: "100%" }}
            >
              {orderedFactionIds.map((name) => {
                const factionSecrets = secretsByFaction[name] ?? [];
                return (
                  <div
                    key={name}
                    className="flexRow"
                    style={{
                      cursor: viewOnly ? undefined : "pointer",
                      position: "relative",
                      width: "100%",
                      aspectRatio: 1,
                    }}
                    onClick={
                      viewOnly
                        ? undefined
                        : () => {
                            openModal(
                              <ModalContent
                                title={
                                  <>
                                    <FactionComponents.Name factionId={name} />{" "}
                                    <FormattedMessage
                                      id="QrrIrN"
                                      description="The title of secret objectives."
                                      defaultMessage="Secrets"
                                    />
                                  </>
                                }
                              >
                                <SecretModalContent
                                  factionId={name}
                                  gameId={gameId}
                                />
                              </ModalContent>,
                            );
                          }
                    }
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
                          backgroundColor: "var(--light-bg)",
                          borderRadius: "100%",
                          marginLeft: "44%",
                          marginTop: "44%",
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          width: rem(24),
                          height: rem(24),
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
            fontSize: rem(18),
            paddingBottom: rem(8),
          }}
        >
          <div className="flexRow" style={{ width: "100%" }}>
            <div
              className="flexRow"
              style={{ padding: `0 ${rem(8)} 0 ${rem(4)}`, width: "100%" }}
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
                    {!viewOnly && imperialPoints > 0 ? (
                      <div
                        className="hiddenButton flexRow"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: rem(-4),
                          fontFamily: "Myriad Pro",
                          fontWeight: "bold",
                          height: rem(16),
                          width: rem(16),
                          border: `${"1px"} solid #333`,
                          borderRadius: "100%",
                          fontSize: rem(12),
                          backgroundColor: "var(--light-bg)",
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        onClick={
                          viewOnly
                            ? undefined
                            : () => {
                                unscoreObjectiveAsync(
                                  gameId,
                                  faction,
                                  "Imperial Point",
                                );
                              }
                        }
                      >
                        -
                      </div>
                    ) : null}
                    {viewOnly ? null : (
                      <div
                        className="hiddenButton flexRow"
                        style={{
                          position: "absolute",
                          right: 0,
                          top: rem(-4),
                          fontFamily: "Myriad Pro",
                          border: `${"1px"} solid #333`,
                          fontWeight: "bold",
                          borderRadius: "100%",
                          height: rem(16),
                          width: rem(16),
                          fontSize: rem(12),
                          backgroundColor: "var(--light-bg)",
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        onClick={
                          viewOnly
                            ? undefined
                            : () => {
                                scoreObjectiveAsync(
                                  gameId,
                                  faction,
                                  "Imperial Point",
                                );
                              }
                        }
                      >
                        +
                      </div>
                    )}
                    <FactionIcon factionId={faction} size="100%" />
                    <div
                      className="flexRow"
                      style={{
                        position: "absolute",
                        backgroundColor: "var(--light-bg)",
                        borderRadius: "100%",
                        marginLeft: "60%",
                        marginTop: "60%",
                        boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                        width: rem(24),
                        height: rem(24),
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
        {totalWar ? (
          <CollapsibleSection
            title={
              <FormattedMessage
                id="Objectives.Total War.Title"
                description="Title of Objective: Total War"
                defaultMessage="Total War"
              />
            }
            style={{
              width: "100%",
              height: "fit-content",
              fontSize: rem(18),
              paddingBottom: rem(8),
            }}
          >
            <div className="flexRow" style={{ width: "100%" }}>
              <div
                className="flexRow"
                style={{
                  padding: `0 ${rem(8)} 0 ${rem(4)}`,
                  width: "100%",
                }}
              >
                {orderedFactionIds.map((faction) => {
                  const totalWarPoints = (
                    (objectives ?? {})["Total War"]?.scorers ?? []
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
                      {!viewOnly && totalWarPoints > 0 ? (
                        <div
                          className="hiddenButton flexRow"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: rem(-4),
                            fontFamily: "Myriad Pro",
                            fontWeight: "bold",
                            height: rem(16),
                            width: rem(16),
                            border: `${"1px"} solid #333`,
                            borderRadius: "100%",
                            fontSize: rem(12),
                            backgroundColor: "var(--light-bg)",
                            boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={
                            viewOnly
                              ? undefined
                              : () => {
                                  unscoreObjectiveAsync(
                                    gameId,
                                    faction,
                                    "Total War",
                                  );
                                }
                          }
                        >
                          -
                        </div>
                      ) : null}
                      {viewOnly ? null : (
                        <div
                          className="hiddenButton flexRow"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: rem(-4),
                            fontFamily: "Myriad Pro",
                            border: `${"1px"} solid #333`,
                            fontWeight: "bold",
                            borderRadius: "100%",
                            height: rem(16),
                            width: rem(16),
                            fontSize: rem(12),
                            backgroundColor: "var(--light-bg)",
                            boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={
                            viewOnly
                              ? undefined
                              : () => {
                                  scoreObjectiveAsync(
                                    gameId,
                                    faction,
                                    "Total War",
                                  );
                                }
                          }
                        >
                          +
                        </div>
                      )}
                      <FactionIcon factionId={faction} size="100%" />
                      <div
                        className="flexRow"
                        style={{
                          position: "absolute",
                          backgroundColor: "var(--light-bg)",
                          borderRadius: "100%",
                          marginLeft: "60%",
                          marginTop: "60%",
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          width: rem(24),
                          height: rem(24),
                          zIndex: 2,
                        }}
                      >
                        {totalWarPoints}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleSection>
        ) : null}
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
          fontSize: rem(18),
          paddingBottom: rem(8),
        }}
      >
        <div className={`flexRow ${styles.collapsibleRow}`}>
          <div className={`flexRow ${styles.objRow}`}>
            {orderedFactionIds.map((id) => {
              const scorers =
                (supportForTheThrone?.keyedScorers ?? {})[id] ?? [];
              const scorer = scorers[0];
              return (
                <div key={id}>
                  <FactionSelectRadialMenu
                    key={id}
                    factions={orderedFactionIds}
                    invalidFactions={[id]}
                    selectedFaction={scorer}
                    onSelect={(factionId) => {
                      if (scorer) {
                        unscoreObjectiveAsync(
                          gameId,
                          scorer,
                          "Support for the Throne",
                          id,
                        );
                      }
                      if (factionId) {
                        scoreObjectiveAsync(
                          gameId,
                          factionId,
                          "Support for the Throne",
                          id,
                        );
                      }
                    }}
                    tag={<FactionIcon factionId={id} size="100%" />}
                    tagBorderColor={getColorForFaction(id)}
                    borderColor={
                      scorer ? getColorForFaction(scorer) : undefined
                    }
                    viewOnly={viewOnly}
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
          fontSize: rem(18),
          paddingBottom: rem(8),
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
              objectiveId="Imperial Rider"
              orderedFactionIds={orderedFactionIds}
              info="Can be scored multiple times via The Codex, Ral Nel's Breakthrough, and Garbozia's ability."
            />
            <SimpleScorable
              objectiveId="Political Censure"
              orderedFactionIds={orderedFactionIds}
            />
          </div>
          {includesPoK || includesTE ? (
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
                objectiveId="Shard of the Throne"
                orderedFactionIds={orderedFactionIds}
              />
              <SimpleScorable
                objectiveId="Tomb + Crown of Emphidia"
                orderedFactionIds={orderedFactionIds}
              />
            </div>
          ) : null}
          <SimpleScorable
            objectiveId="Holy Planet of Ixth"
            orderedFactionIds={orderedFactionIds}
            info="Can be scored 2x due to Miscount Disclosed."
          />
          {!includesPoK ? (
            <SimpleScorable
              objectiveId="Shard of the Throne"
              orderedFactionIds={orderedFactionIds}
              info="Can be scored 2x due to Miscount Disclosed"
            />
          ) : null}
          <SimpleScorable
            objectiveId="The Crown of Emphidia"
            orderedFactionIds={orderedFactionIds}
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
                {viewOnly ? (
                  mutinyDirection === "[For]" ? (
                    `[${intl.formatMessage({
                      id: "ymJxS0",
                      defaultMessage: "For",
                      description: "Outcome choosing to pass a law.",
                    })}]`
                  ) : (
                    `[${intl.formatMessage({
                      id: "SOC2Bh",
                      defaultMessage: "Against",
                      description: "Outcome choosing to vote down a law.",
                    })}]`
                  )
                ) : (
                  <button
                    style={{ fontSize: rem(14) }}
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
                )}
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
                  return (
                    <ScorableFactionIcon
                      key={factionId}
                      factionId={factionId}
                      objective={mutiny}
                    />
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
                  return (
                    <ScorableFactionIcon
                      key={factionId}
                      factionId={factionId}
                      objective={seed}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

function FactionNameAndVPs({ factionId }: { factionId: FactionId }) {
  const gameId = useGameId();
  const manualVPs = useManualFactionVPs(factionId);
  const scoredVPs = useScoredFactionVPs(factionId);
  const viewOnly = useViewOnly();

  const VPs = manualVPs + scoredVPs;

  return (
    <LabeledDiv
      label={<FactionName factionId={factionId} />}
      color={getColorForFaction(factionId)}
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
        <FactionIcon factionId={factionId} size="90%" />
      </div>
      <div
        className="flexRow"
        style={{
          justifyContent: "center",
          fontSize: rem(28),
          width: "100%",
        }}
      >
        {!viewOnly && VPs > 0 ? (
          <div
            className="arrowDown"
            onClick={() => manualVPUpdateAsync(gameId, factionId, -1)}
          ></div>
        ) : (
          <div style={{ width: rem(12) }}></div>
        )}
        <div className="flexRow" style={{ width: rem(24) }}>
          {VPs}
        </div>
        {!viewOnly ? (
          <div
            className="arrowUp"
            onClick={() => manualVPUpdateAsync(gameId, factionId, 1)}
          ></div>
        ) : (
          <div style={{ width: rem(12) }}></div>
        )}
      </div>
    </LabeledDiv>
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
  const viewOnly = useViewOnly();

  const secrets = Object.values(objectives ?? {}).filter(
    (objective) => objective.type === "SECRET",
  );

  const scoredSecrets = secrets.filter((secret) =>
    (secret.scorers ?? []).includes(factionId),
  );
  const availableSecrets = secrets
    .filter((secret) => (secret.scorers ?? []).length === 0)
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    });

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        padding: rem(8),
        alignItems: "center",
      }}
    >
      {scoredSecrets.map((secret) => {
        return (
          <ObjectiveRow
            key={secret.name}
            objective={secret}
            hideScorers={true}
            removeObjective={
              viewOnly
                ? undefined
                : () => {
                    if (!gameId) {
                      return;
                    }
                    unscoreObjectiveAsync(gameId, factionId, secret.id);
                  }
            }
          />
        );
      })}
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {scoredSecrets.length < 6 && !viewOnly ? (
          <ObjectiveSelectHoverMenu
            action={(gameId, objectiveId) =>
              scoreObjectiveAsync(gameId, factionId, objectiveId)
            }
            fontSize={rem(14)}
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
