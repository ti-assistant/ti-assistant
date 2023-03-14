import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { SmallStrategyCard } from "../StrategyCard";
import { hasTech, lockTech, unlockTech } from "../util/api/techs";
import { resetStrategyCards, StrategyCard } from "../util/api/cards";
import { Faction, readyAllFactions } from "../util/api/factions";
import { responsivePixels } from "../util/util";
import { fetcher, poster } from "../util/api/util";
import { ObjectiveRow } from "../ObjectiveRow";
import {
  Objective,
  scoreObjective,
  unscoreObjective,
} from "../util/api/objectives";
import { Modal } from "../Modal";
import SummaryColumn from "./SummaryColumn";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv, LabeledLine } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import {
  finalizeSubState,
  hideSubStateObjective,
  revealSubStateObjective,
  scoreSubStateObjective,
  SubState,
  unscoreSubStateObjective,
} from "../util/api/subState";
import { startNextRound } from "./AgendaPhase";
import { GameState, StateUpdateData } from "../util/api/state";
import { Agenda } from "../util/api/agendas";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { getInitiativeForFaction } from "../util/helpers";
import { FullFactionSymbol } from "../FactionCard";
import { NumberedItem } from "../NumberedItem";
import { Selector } from "../Selector";
import { LockedButtons } from "../LockedButton";

function InfoContent({ children }: PropsWithChildren) {
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        minWidth: responsivePixels(320),
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {children}
    </div>
  );
}

export function MiddleColumn() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
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
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function scoreObj(factionName: string, objectiveName: string) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, objectiveName);
    scoreSubStateObjective(gameid, factionName, objectiveName);
  }
  function unscoreObj(factionName: string, objectiveName: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, objectiveName);
    unscoreSubStateObjective(gameid, factionName, objectiveName);
  }

  const orderedStrategyCards = Object.values(strategyCards)
    .filter((card) => card.faction)
    .sort((a, b) => a.order - b.order);
  const filteredStrategyCards = orderedStrategyCards.filter((card, index) => {
    return (
      card.faction &&
      orderedStrategyCards.findIndex(
        (othercard) => card.faction === othercard.faction
      ) === index
    );
  });
  const numberOfActionCards: {
    1: Faction[];
    2: Faction[];
    3: Faction[];
  } = { 1: [], 2: [], 3: [] };
  Object.values(filteredStrategyCards).forEach((card) => {
    if (!factions || !card.faction) {
      return;
    }
    let number: 1 | 2 | 3 = 1;
    const faction = factions[card.faction];
    if (!faction) {
      return;
    }
    if (hasTech(faction, "Neural Motivator")) {
      number = 2;
    }
    if (card.faction === "Yssaril Tribes") {
      number = 3;
    }
    numberOfActionCards[number].push(faction);
  });
  const numberOfCommandTokens: {
    2: Faction[];
    3: Faction[];
    4: Faction[];
  } = { 2: [], 3: [], 4: [] };
  Object.values(filteredStrategyCards).forEach((card) => {
    if (!factions || !card.faction) {
      return;
    }
    const faction = factions[card.faction];
    if (!faction) {
      return;
    }
    let number: 2 | 3 | 4 = 2;
    if (card.faction === "Federation of Sol") {
      if (hasTech(faction, "Hyper Metabolism")) {
        number = 4;
      } else {
        number = 3;
      }
    } else if (hasTech(faction, "Hyper Metabolism")) {
      number = 3;
    }
    numberOfCommandTokens[number].push(faction);
  });

  if (!objectives || !factions) {
    return null;
  }
  const subStateObjective = (subState.objectives ?? [])[0];

  let innerContent = (
    <div className="flexColumn" style={{ width: "100%" }}>
      {!subStateObjective ? (
        <LabeledDiv label="Score Objectives" noBlur={true}>
          <div
            className="flexColumn"
            style={{
              justifyContent: "space-evenly",
              alignItems: "stretch",
              gap: 0,
              width: "100%",
            }}
          >
            {filteredStrategyCards.map((card) => {
              const availableObjectives = Object.values(
                objectives ?? {}
              ).filter((objective) => {
                if (!card.faction) {
                  return null;
                }
                return (
                  objective.selected &&
                  (objective.type === "STAGE ONE" ||
                    objective.type === "STAGE TWO") &&
                  !(objective.scorers ?? []).includes(card.faction)
                );
              });
              const secrets = Object.values(objectives ?? {}).filter(
                (objective) => {
                  if (!card.faction) {
                    return null;
                  }
                  return (
                    objective.type === "SECRET" &&
                    !(objective.scorers ?? []).includes(card.faction) &&
                    objective.phase === "STATUS"
                  );
                }
              );
              if (!factions || !card.faction) {
                return null;
              }
              const factionColor = getFactionColor(factions[card.faction]);
              const factionName = getFactionName(factions[card.faction]);
              const scoredPublics = (
                ((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []
              ).filter((objective) => {
                const objectiveObj = objectives
                  ? objectives[objective]
                  : undefined;
                if (!objectiveObj) {
                  return false;
                }
                return (
                  objectiveObj.type === "STAGE ONE" ||
                  objectiveObj.type === "STAGE TWO"
                );
              });
              const scoredSecrets = (
                ((subState.factions ?? {})[card.faction] ?? {}).objectives ?? []
              ).filter((objective) => {
                const objectiveObj = objectives
                  ? objectives[objective]
                  : undefined;
                if (!objectiveObj) {
                  return false;
                }
                return objectiveObj.type === "SECRET";
              });
              return (
                <div
                  key={card.name}
                  style={{ width: "100%", position: "relative" }}
                >
                  <LabeledLine label={factionName} color={factionColor} />
                  <div
                    className="flexRow"
                    style={{
                      justifyContent: "space-between",
                      height: responsivePixels(36),
                    }}
                  >
                    {!scoredPublics[0] && availableObjectives.length === 0 ? (
                      <div
                        className="smallFont"
                        style={{ textAlign: "center", width: "40%" }}
                      >
                        No unscored Public Objectives
                      </div>
                    ) : (
                      <div
                        className="flexColumn smallFont"
                        style={{
                          width: "40%",
                          alignItems: scoredPublics[0]
                            ? "flex-start"
                            : "flex-end",
                        }}
                      >
                        <div style={{ width: "fit-content" }}>
                          <Selector
                            options={availableObjectives.map((obj) => obj.name)}
                            selectedItem={scoredPublics[0]}
                            hoverMenuLabel="Public"
                            toggleItem={(objectiveName, add) => {
                              if (!card.faction) {
                                return;
                              }
                              if (add) {
                                scoreObj(card.faction, objectiveName);
                              } else {
                                unscoreObj(card.faction, objectiveName);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="flexColumn"
                      style={{
                        position: "absolute",
                        zIndex: -1,
                        width: "100%",
                      }}
                    >
                      <div
                        className="flexRow"
                        style={{
                          position: "relative",
                          opacity: 0.5,
                          top: responsivePixels(2),
                          width: responsivePixels(40),
                          height: responsivePixels(40),
                        }}
                      >
                        <FullFactionSymbol faction={factionName} />
                      </div>
                    </div>
                    <div
                      className="flexColumn smallFont"
                      style={{ width: "40%", alignItems: "flex-start" }}
                    >
                      <div style={{ width: "fit-content" }}>
                        <Selector
                          options={secrets.map((obj) => obj.name)}
                          selectedItem={scoredSecrets[0]}
                          hoverMenuLabel="Secret"
                          toggleItem={(objectiveName, add) => {
                            if (!card.faction) {
                              return;
                            }
                            if (add) {
                              scoreObj(card.faction, objectiveName);
                            } else {
                              unscoreObj(card.faction, objectiveName);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </LabeledDiv>
      ) : (
        <React.Fragment>
          <LabeledDiv label="Draw Action Cards">
            <div
              className="flexRow"
              style={{
                justifyContent: "space-evenly",
                alignItems: "stretch",
                flexWrap: "wrap",
                paddingTop: responsivePixels(2),
              }}
            >
              {Object.entries(numberOfActionCards).map(
                ([number, localFactions]) => {
                  const num = parseInt(number);
                  if (localFactions.length === 0) {
                    return null;
                  }
                  let displayNum = num;
                  if (
                    num === 3 &&
                    factions["Yssaril Tribes"] &&
                    !hasTech(factions["Yssaril Tribes"], "Neural Motivator")
                  ) {
                    displayNum = 2;
                  }
                  return (
                    <div
                      key={num}
                      className="flexColumn"
                      style={{
                        alignItems: "flex-start",
                      }}
                    >
                      <LabeledDiv
                        label={`${displayNum}${
                          num === 3 ? " (Discard 1)" : ""
                        }`}
                      >
                        <div
                          className="flexRow"
                          style={{ justifyContent: "flex-start" }}
                        >
                          {localFactions.map((faction) => {
                            return (
                              <div
                                key={faction.name}
                                className="flexRow"
                                style={{
                                  position: "relative",
                                  width: responsivePixels(32),
                                  height: responsivePixels(32),
                                }}
                              >
                                <FullFactionSymbol faction={faction.name} />
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    </div>
                  );
                }
              )}
            </div>
          </LabeledDiv>
          <LabeledDiv label="Gain Command Tokens and Redistribute">
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                paddingTop: responsivePixels(2),
              }}
            >
              {Object.entries(numberOfCommandTokens).map(
                ([number, localFactions]) => {
                  const num = parseInt(number);
                  if (localFactions.length === 0) {
                    return null;
                  }
                  return (
                    <div
                      key={num}
                      className="flexColumn"
                      style={{ alignItems: "flex-start" }}
                    >
                      <LabeledDiv label={`${num}`}>
                        <div
                          className="flexRow"
                          style={{
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                          }}
                        >
                          {" "}
                          {localFactions.map((faction) => {
                            return (
                              <div
                                key={faction.name}
                                className="flexRow"
                                style={{
                                  position: "relative",
                                  width: responsivePixels(32),
                                  height: responsivePixels(32),
                                }}
                              >
                                <FullFactionSymbol faction={faction.name} />
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    </div>
                  );
                }
              )}
            </div>
          </LabeledDiv>
          {/* <LabeledDiv label="Return Strategy Cards">
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                paddingTop: responsivePixels(4),
              }}
            >
              <Selector
                hoverMenuLabel="Political Stability"
                selectedLabel="Political Stability - do not return strategy card(s)"
                options={Object.keys(factions)}
                selectedItem={subState["Political Stability"]}
                toggleItem={(itemName, add) => {
                  if (!gameid) {
                    return;
                  }
                  if (add) {
                    setSubStateOther(gameid, "Political Stability", itemName);
                  } else {
                    setSubStateOther(gameid, "Political Stability", undefined);
                  }
                }}
              />
            </div>
          </LabeledDiv> */}
        </React.Fragment>
      )}
    </div>
  );

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setInfoModal({ show: false })}
        visible={infoModal.show}
        title={infoModal.title}
      >
        <InfoContent>{infoModal.content}</InfoContent>
      </Modal>
      <div className="flexColumn" style={{ width: "100%" }}>
        {innerContent}
      </div>
    </React.Fragment>
  );
}

export function advanceToAgendaPhase(gameid: string, subState: SubState) {
  finalizeSubState(gameid, subState);
  const data: StateUpdateData = {
    action: "ADVANCE_PHASE",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = "AGENDA";
        updatedState.activeplayer = state.speaker;
        updatedState.agendaUnlocked = true;

        return updatedState;
      },
      revalidate: false,
    }
  );

  resetStrategyCards(gameid);
  readyAllFactions(gameid);
}

export function statusPhaseComplete(subState: SubState) {
  return (subState.objectives ?? []).length === 1;
}

export default function StatusPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
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
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function showInfoModal(title: string, content: ReactNode) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  function nextPhase(skipAgenda = false) {
    if (!gameid) {
      return;
    }
    if (!skipAgenda) {
      advanceToAgendaPhase(gameid, subState);
      return;
    }
    startNextRound(gameid, subState);
  }

  interface Ability {
    name: string;
    description: string;
  }

  function hasStartOfStatusPhaseAbilities() {
    for (const ability of Object.values(getStartOfStatusPhaseAbilities())) {
      if (ability.length > 0) {
        return true;
      }
    }
    return false;
  }

  function getStartOfStatusPhaseAbilities(): Record<string, Ability[]> {
    if (!factions) {
      return {};
    }
    let abilities: Record<string, Ability[]> = {};
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.name === "Arborec") {
        factionAbilities.push({
          name: "Mitosis",
          description:
            "Place 1 Infantry from your reinforcements on any planet you control",
        });
      }
      if (hasTech(faction, "Wormhole Generator")) {
        factionAbilities.push({
          name: "Wormhole Generator",
          description:
            "Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
        });
      }
      if (factionAbilities.length > 0) {
        abilities[faction.name] = factionAbilities;
      }
    }
    return abilities;
  }

  function hasEndOfStatusPhaseAbilities() {
    for (const ability of Object.values(getEndOfStatusPhaseAbilities())) {
      if (ability.length > 0) {
        return true;
      }
    }
    return false;
  }

  function getEndOfStatusPhaseAbilities() {
    if (!factions || !agendas) {
      return {};
    }
    let abilities: Record<string, Ability[]> = {};
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.name === "Federation of Sol") {
        factionAbilities.push({
          name: "Flagship: Genesis",
          description:
            "If your flagship is on the game board, place 1 Infantry from your reinforcements in its system's space area",
        });
      }
      if (hasTech(faction, "Bioplasmosis")) {
        factionAbilities.push({
          name: "Bioplasmosis",
          description:
            "You may remove any number of Infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems",
        });
      }
      const ministerOfPolicy = agendas["Minister of Policy"];
      if (
        ministerOfPolicy &&
        ministerOfPolicy.resolved &&
        ministerOfPolicy.target == faction.name
      ) {
        factionAbilities.push({
          name: "Minister of Policy",
          description:
            ministerOfPolicy.passedText ?? ministerOfPolicy.description,
        });
      }
      if (factionAbilities.length > 0) {
        abilities[faction.name] = factionAbilities;
      }
    }
    return abilities;
  }

  const round = state?.round ?? 1;
  const orderedStrategyCards = Object.values(strategyCards)
    .filter((card) => card.faction)
    .sort((a, b) => a.order - b.order);

  const cardsByFaction: Record<string, StrategyCard[]> = {};
  orderedStrategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    if (!cardsByFaction[card.faction]) {
      cardsByFaction[card.faction] = [];
    }
    cardsByFaction[card.faction]?.push(card);
  });

  const subStateObjective = (subState.objectives ?? [])[0];
  const subStateObjectiveObj = (objectives ?? {})[subStateObjective ?? ""];
  const type = round < 4 ? "STAGE ONE" : "STAGE TWO";
  const availableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      return objective.type === type && !objective.selected;
    }
  );
  function addObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    revealSubStateObjective(gameid, objectiveName);
  }

  function removeObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    hideSubStateObjective(gameid, objectiveName);
  }

  const nextPhaseButtons = [];
  if (!state?.agendaUnlocked) {
    nextPhaseButtons.push({
      text: "Start Next Round",
      onClick: () => nextPhase(true),
    });
  }
  nextPhaseButtons.push({
    text: "Advance to Agenda Phase",
    onClick: () => nextPhase(false),
  });

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setInfoModal({ show: false })}
        visible={infoModal.show}
        title={infoModal.title}
        level={2}
      >
        <InfoContent>{infoModal.content}</InfoContent>
      </Modal>
      {/* <div
        className="flexRow"
        style={{
          gap: responsivePixels(20),
          height: "100svh",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      > */}
      <ol
        className="flexColumn largeFont"
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          boxSizing: "border-box",
          height: "100svh",
          margin: 0,
          paddingLeft: responsivePixels(20),
        }}
      >
        {!hasStartOfStatusPhaseAbilities() ? null : (
          <NumberedItem>
            <ClientOnlyHoverMenu
              label="
            Start of Status Phase Abilities"
            >
              <div
                className="flexColumn"
                style={{ padding: responsivePixels(8) }}
              >
                {Object.entries(getStartOfStatusPhaseAbilities())
                  .sort((a, b) => {
                    if (!factions) {
                      return 0;
                    }
                    const initiativeA = getInitiativeForFaction(
                      strategyCards,
                      a[0]
                    );
                    const initiativeB = getInitiativeForFaction(
                      strategyCards,
                      b[0]
                    );
                    if (initiativeA > initiativeB) {
                      return 1;
                    }
                    return -1;
                  })
                  .map(([factionName, abilities]) => {
                    if (!factions) {
                      return null;
                    }
                    return (
                      <LabeledDiv
                        key={factionName}
                        label={getFactionName(factions[factionName])}
                        color={getFactionColor(factions[factionName])}
                      >
                        <div
                          className="flexColumn"
                          style={{ alignItems: "flex-start" }}
                        >
                          {abilities.map((ability) => {
                            return (
                              <div key={ability.name} className="flexRow">
                                {ability.name}
                                <div
                                  className="popupIcon"
                                  onClick={() =>
                                    showInfoModal(
                                      ability.name,
                                      ability.description
                                    )
                                  }
                                >
                                  &#x24D8;
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    );
                  })}
              </div>
            </ClientOnlyHoverMenu>
          </NumberedItem>
        )}
        <NumberedItem>Score Objectives</NumberedItem>
        <NumberedItem>
          <div className="largeFont">
            {subStateObjectiveObj ? (
              <LabeledDiv
                label={`Revealed Stage ${round < 4 ? "I" : "II"} Objective`}
              >
                <ObjectiveRow
                  objective={subStateObjectiveObj}
                  removeObjective={() => removeObj(subStateObjectiveObj.name)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <LabeledDiv
                label={`Speaker: ${getFactionName(
                  (factions ?? {})[state?.speaker ?? ""]
                )}`}
                color={getFactionColor((factions ?? {})[state?.speaker ?? ""])}
                style={{ width: "100%" }}
              >
                <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                  {(subState.objectives ?? []).map((objective) => {
                    const objectiveObj = (objectives ?? {})[objective];
                    if (!objectiveObj) {
                      return null;
                    }
                    return (
                      <ObjectiveRow
                        key={objective}
                        objective={objectiveObj}
                        removeObjective={() => removeObj(objective)}
                        viewing={true}
                      />
                    );
                  })}
                  <Selector
                    hoverMenuLabel={`Reveal one Stage ${
                      round > 3 ? "II" : "I"
                    } objective`}
                    selectedItem={(subState.objectives ?? [])[0]}
                    options={Object.values(availableObjectives)
                      .filter((objective) => {
                        return (
                          objective.type ===
                          (round > 3 ? "STAGE TWO" : "STAGE ONE")
                        );
                      })
                      .map((obj) => obj.name)}
                    toggleItem={(objectiveName, add) => {
                      if (add) {
                        addObj(objectiveName);
                      } else {
                        removeObj(objectiveName);
                      }
                    }}
                  />
                </div>
              </LabeledDiv>
            )}{" "}
          </div>
        </NumberedItem>
        <NumberedItem>Draw Action Cards</NumberedItem>
        <NumberedItem>Remove Command Tokens</NumberedItem>
        <NumberedItem>Gain and Redistribute Tokens</NumberedItem>
        <NumberedItem>Ready Cards</NumberedItem>
        <NumberedItem>Repair Units</NumberedItem>
        <NumberedItem>Return Strategy Cards</NumberedItem>
        {!hasEndOfStatusPhaseAbilities() ? null : (
          <NumberedItem>
            <ClientOnlyHoverMenu label="End of Status Phase Abilities">
              <div
                className="flexColumn"
                style={{ padding: responsivePixels(8) }}
              >
                {Object.entries(getEndOfStatusPhaseAbilities())
                  .sort((a, b) => {
                    if (!factions) {
                      return 0;
                    }
                    const initiativeA = getInitiativeForFaction(
                      strategyCards,
                      a[0]
                    );
                    const initiativeB = getInitiativeForFaction(
                      strategyCards,
                      b[0]
                    );
                    if (initiativeA > initiativeB) {
                      return 1;
                    }
                    return -1;
                  })
                  .map(([factionName, abilities]) => {
                    if (!factions) {
                      return null;
                    }
                    return (
                      <LabeledDiv
                        key={factionName}
                        label={getFactionName(factions[factionName])}
                        color={getFactionColor(factions[factionName])}
                      >
                        <div
                          className="flexColumn"
                          style={{ width: "100%", alignItems: "flex-start" }}
                        >
                          {abilities.map((ability) => {
                            return (
                              <div key={ability.name} className="flexRow">
                                {ability.name}
                                <div
                                  className="popupIcon"
                                  onClick={() =>
                                    showInfoModal(
                                      ability.name,
                                      ability.description
                                    )
                                  }
                                >
                                  &#x24D8;
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    );
                  })}
              </div>
            </ClientOnlyHoverMenu>
          </NumberedItem>
        )}
      </ol>
      <div
        className="flexColumn"
        style={{
          width: "100%",
          height: "100svh",
          justifyContent: "center",
        }}
      >
        <MiddleColumn />
        <LockedButtons
          unlocked={statusPhaseComplete(subState)}
          buttons={nextPhaseButtons}
        />
      </div>
      {/* </div> */}
    </React.Fragment>
  );
}
