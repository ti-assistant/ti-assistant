import Image from "next/image";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useState } from "react";
import useSWR from "swr";
import { FullFactionSymbol } from "./FactionCard";
import { computeVPs } from "./FactionSummary";
import { ResponsiveLogo } from "./Header";
import { ClientOnlyHoverMenu, FactionSelectHoverMenu } from "./HoverMenu";
import { BLACK_BORDER_GLOW, LabeledDiv, LabeledLine } from "./LabeledDiv";
import { Modal } from "./Modal";
import { ObjectiveRow } from "./ObjectiveRow";
import { Selector } from "./Selector";
import { Faction } from "./util/api/factions";
import {
  Objective,
  scoreObjective,
  unscoreObjective,
  revealObjective,
  removeObjective,
  takeObjective,
} from "./util/api/objectives";
import { Options } from "./util/api/options";
import { GameState } from "./util/api/state";
import {
  hideSubStateObjective,
  revealSubStateObjective,
} from "./util/api/subState";
import { fetcher } from "./util/api/util";
import { getFactionColor, getFactionName } from "./util/factions";
import { responsiveNegativePixels, responsivePixels } from "./util/util";

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
                hideSubStateObjective(gameid, objective.name);
                removeObjective(gameid, undefined, objective.name);
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
      {orderedFactionNames.map((name) => {
        return (
          <div
            key={name}
            className="flexRow"
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={() => {
              scoreObj(
                objective.name,
                name,
                !objective.scorers?.includes(name)
              );
            }}
          >
            {objective.scorers?.includes(name) ? (
              <div
                style={{
                  position: "relative",
                  width: "80%",
                  height: "80%",
                }}
              >
                <FullFactionSymbol faction={name} />
              </div>
            ) : (
              <div>·</div>
            )}
          </div>
        );
      })}
    </>
  );
}

function SecretModalContent({ faction }: { faction: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

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
      style={{ width: "100%", padding: responsivePixels(8) }}
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
  );
}

export function ObjectivePanel({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const [factionName, setFactionName] = useState("");
  const [secretModal, setSecretModal] = useState(false);
  const [mutinyDirection, setMutinyDirection] = useState("[For]");

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

  const sortedObjectives = Object.values(objectives ?? {}).sort((a, b) => {
    if (!a.revealOrder && !b.revealOrder) {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    }
    if (!a.revealOrder) {
      return -1;
    }
    if (!b.revealOrder) {
      return 1;
    }
    if (a.revealOrder > b.revealOrder) {
      return 1;
    }
    return -1;
  });

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

  const selectedStageOneObjectives = stageOneObjectives.filter(
    (obj) => obj && obj.selected
  );
  const remainingStageOneObjectives = stageOneObjectives.filter(
    (obj) => !obj.selected
  );
  const selectedStageTwoObjectives = stageTwoObjectives.filter(
    (obj) => obj && obj.selected
  );
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

  return (
    <>
      <Modal
        title={getFactionName((factions ?? {})[factionName]) + " Secrets"}
        closeMenu={() => setSecretModal(false)}
        visible={!!secretModal}
      >
        <SecretModalContent faction={factionName} />
      </Modal>
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          padding: responsivePixels(8),
          height: "100%",
        }}
      >
        <div
          className="objectiveGrid"
          style={{
            position: "relative",
            display: "grid",
            rowGap: responsivePixels(4),
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            height: "66%",
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
                    revealSubStateObjective(gameid, objectiveName);
                    revealObjective(gameid, undefined, objectiveName);
                  } else {
                    removeObjective(gameid, undefined, objectiveName);
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
                    revealSubStateObjective(gameid, objectiveName);
                    revealObjective(gameid, undefined, objectiveName);
                  } else {
                    removeObjective(gameid, undefined, objectiveName);
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
                    // paddingBottom: "80%",
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
        <LabeledLine label="Other Victory Points" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: responsivePixels(8),
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
                <FactionSelectHoverMenu
                  options={orderedFactionNames}
                  selectedFaction={custodiansScorer}
                  onSelect={async (factionName) => {
                    if (!gameid) {
                      return;
                    }
                    if (factionName && custodiansScorer) {
                      takeObjective(
                        gameid,
                        "Custodians Token",
                        factionName,
                        custodiansScorer
                      );
                    } else if (custodiansScorer) {
                      await unscoreObjective(
                        gameid,
                        custodiansScorer,
                        "Custodians Token"
                      );
                    } else if (factionName) {
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
                    <FactionSelectHoverMenu
                      key={name}
                      options={orderedFactionNames.filter(
                        (faction) => faction !== name
                      )}
                      selectedFaction={scorer}
                      onSelect={(factionName) => {
                        if (!gameid) {
                          return;
                        }
                        if (scorer && factionName) {
                          takeObjective(
                            gameid,
                            factionName,
                            scorer,
                            "Support for the Throne",
                            name
                          );
                        } else if (scorer) {
                          unscoreObjective(
                            gameid,
                            scorer,
                            "Support for the Throne",
                            name
                          );
                        } else if (factionName) {
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
            }}
          >
            <div
              className="flexRow mediumFont"
              style={{
                gridColumn: "2 / 5",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                className="flexColumn"
                style={{ gap: responsivePixels(2), flexGrow: 2 }}
              >
                Mutiny{" "}
                <button
                  style={{ fontSize: responsivePixels(14) }}
                  onClick={() => {
                    if (mutinyDirection === "[For]") {
                      setMutinyDirection("[Against]");
                    } else {
                      setMutinyDirection("[For]");
                    }
                  }}
                >
                  {mutinyDirection}
                </button>
              </div>
              <div className="flexRow">
                {orderedFactionNames.map((faction) => {
                  const mutinyName =
                    mutinyDirection === "[For]"
                      ? "Mutiny (For)"
                      : "Mutiny (Against)";
                  const mutiny = (objectives ?? {})[mutinyName];
                  const applies = (mutiny?.scorers ?? []).includes(faction);
                  return (
                    <div
                      key={faction}
                      className="flexRow hiddenButtonParent"
                      style={{
                        position: "relative",
                        width: responsivePixels(32),
                        height: responsivePixels(32),
                      }}
                    >
                      <FullFactionSymbol faction={faction} />
                      <div
                        className="flexRow"
                        style={{
                          position: "absolute",
                          backgroundColor: "#222",
                          cursor: "pointer",
                          borderRadius: "100%",
                          marginLeft: "60%",
                          marginTop: "60%",
                          boxShadow: `${responsivePixels(1)} ${responsivePixels(
                            1
                          )} ${responsivePixels(4)} black`,
                          width: responsivePixels(20),
                          height: responsivePixels(20),
                          zIndex: 2,
                          color: applies ? "green" : "red",
                        }}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (applies) {
                            unscoreObjective(gameid, faction, mutinyName);
                          } else {
                            scoreObjective(gameid, faction, mutinyName);
                          }
                        }}
                      >
                        {applies ? "✓" : "⤬"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="flexRow mediumFont"
              style={{
                gridColumn: "2 / 5",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <div
                className="flexRow"
                style={{
                  whiteSpace: "normal",
                  flexGrow: 2,
                  height: "100%",
                  textAlign: "center",
                }}
              >
                Seed of an Empire
              </div>
              <div className="flexRow">
                {orderedFactionNames.map((faction) => {
                  const seed = (objectives ?? {})["Seed of an Empire"];
                  const applies = (seed?.scorers ?? []).includes(faction);
                  return (
                    <div
                      key={faction}
                      className="flexRow hiddenButtonParent"
                      style={{
                        position: "relative",
                        width: responsivePixels(32),
                        height: responsivePixels(32),
                      }}
                    >
                      <FullFactionSymbol faction={faction} />
                      <div
                        className="flexRow"
                        style={{
                          position: "absolute",
                          backgroundColor: "#222",
                          borderRadius: "100%",
                          marginLeft: "60%",
                          cursor: "pointer",
                          marginTop: "60%",
                          boxShadow: `${responsivePixels(1)} ${responsivePixels(
                            1
                          )} ${responsivePixels(4)} black`,
                          width: responsivePixels(20),
                          height: responsivePixels(20),
                          zIndex: 2,
                          color: applies ? "green" : "red",
                        }}
                        onClick={() => {
                          if (!gameid) {
                            return;
                          }
                          if (applies) {
                            unscoreObjective(
                              gameid,
                              faction,
                              "Seed of an Empire"
                            );
                          } else {
                            scoreObjective(
                              gameid,
                              faction,
                              "Seed of an Empire"
                            );
                          }
                        }}
                      >
                        {applies ? "✓" : "⤬"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* </div> */}
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
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameId ? `/api/${gameId}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
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
          gridColumn: "3 / 5",
          textAlign: "center",
          whiteSpace: "normal",
          height: "100%",
          width: "100%",
        }}
      >
        {objective.name}
        <div className="flexRow">
          <FactionSelectHoverMenu
            selectedFaction={objectiveScorers[0]}
            options={orderedFactionNames}
            onSelect={(factionName) => {
              if (!gameId) {
                return;
              }
              if (factionName && objectiveScorers[0]) {
                takeObjective(
                  gameId,
                  objective.name,
                  factionName,
                  objectiveScorers[0]
                );
              } else if (objectiveScorers[0]) {
                unscoreObjective(gameId, objectiveScorers[0], objective.name);
              } else if (factionName) {
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
            <FactionSelectHoverMenu
              selectedFaction={objectiveScorers[1]}
              options={orderedFactionNames}
              onSelect={(factionName) => {
                if (!gameId) {
                  return;
                }
                if (factionName && objectiveScorers[1]) {
                  takeObjective(
                    gameId,
                    objective.name,
                    factionName,
                    objectiveScorers[1]
                  );
                } else if (objectiveScorers[1]) {
                  unscoreObjective(gameId, objectiveScorers[1], objective.name);
                } else if (factionName) {
                  scoreObjective(gameId, factionName, objective.name);
                }
              }}
              tag={
                <div
                  className="popupIcon hoverParent"
                  style={{ paddingRight: responsivePixels(8) }}
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
