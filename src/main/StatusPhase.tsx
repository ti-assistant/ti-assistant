import { useRouter } from "next/router";
import useSWR, { mutate, useSWRConfig } from "swr";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { SmallStrategyCard } from "../StrategyCard";
import { hasTech, lockTech, unlockTech } from "../util/api/techs";
import { resetStrategyCards, StrategyCard } from "../util/api/cards";
import { Faction, readyAllFactions } from "../util/api/factions";
import { pluralize, responsivePixels } from "../util/util";
import { fetcher, poster } from "../util/api/util";
import { BasicFactionTile } from "../FactionTile";
import { ObjectiveRow } from "../ObjectiveRow";
import {
  Objective,
  scoreObjective,
  unscoreObjective,
} from "../util/api/objectives";
import { Modal } from "../Modal";
import SummaryColumn from "./SummaryColumn";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { SelectableRow } from "../SelectableRow";
import {
  finalizeSubState,
  hideSubStateObjective,
  revealSubStateObjective,
  scoreSubStateObjective,
  setSubStateOther,
  SubState,
  unscoreSubStateObjective,
} from "../util/api/subState";
import { NumberedItem } from "../NumberedItem";
import { startNextRound } from "./AgendaPhase";
import { GameState, StateUpdateData } from "../util/api/state";
import { Options } from "../util/api/options";
import { Agenda } from "../util/api/agendas";

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
  const { data: agendas = {} }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: strategyCards }: { data?: Record<string, StrategyCard> } =
    useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  if (gameid && subState && !subState.currentStep) {
    setSubStateOther(gameid, "currentStep", 1);
    return null;
  }

  function showInfoModal(title: string, content: ReactNode) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  function stepComplete() {
    switch (subState.currentStep) {
      case 3:
        return (subState.objectives ?? []).length === 1;
    }
    return true;
  }

  function reverseCurrentStep() {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "currentStep", subState.currentStep - 1);
  }
  function advanceCurrentStep() {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "currentStep", subState.currentStep + 1);
  }
  function jumpToStep(step: number) {
    if (!gameid) {
      return;
    }
    setSubStateOther(gameid, "currentStep", step);
  }

  function addObj(objective: Objective) {
    if (!gameid) {
      return;
    }
    revealSubStateObjective(gameid, objective.name);
  }

  function removeObj(objectiveName: string) {
    if (!gameid) {
      return;
    }
    hideSubStateObjective(gameid, objectiveName);
  }

  function scoreObj(factionName: string, objective: Objective) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, objective.name);
    scoreSubStateObjective(gameid, factionName, objective.name);
  }
  function unscoreObj(factionName: string, objectiveName: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, objectiveName);
    unscoreSubStateObjective(gameid, factionName, objectiveName);
  }

  interface Ability {
    factions: string[];
    description: string;
  }

  function getStartOfStatusPhaseAbilities(): Record<string, Ability> {
    if (!factions) {
      return {};
    }
    let abilities: Record<string, Ability> = {};
    if (factions["Arborec"]) {
      abilities["Mitosis"] = {
        factions: ["Arborec"],
        description:
          "Place 1 Infantry from your reinforcements on any planet you control",
      };
    }
    if (!options?.expansions.includes("codex-one")) {
      let wormholeFactions = [];
      for (const [name, faction] of Object.entries(factions)) {
        if (hasTech(faction, "Wormhole Generator")) {
          wormholeFactions.push(name);
        }
      }
      if (wormholeFactions.length > 0) {
        abilities["Wormhole Generator"] = {
          factions: wormholeFactions,
          description:
            "Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
        };
      }
    }
    return abilities;
  }

  function getEndOfStatusPhaseAbilities() {
    if (!factions || !agendas) {
      return {};
    }
    let abilities: Record<string, Ability> = {};
    if (factions["Federation of Sol"]) {
      abilities["Genesis"] = {
        factions: ["Federation of Sol"],
        description:
          "If your flagship is on the game board, place 1 Infantry from your reinforcements in its system's space area",
      };
    }
    let bioplasmosisFactions = [];
    for (const [name, faction] of Object.entries(factions)) {
      if (hasTech(faction, "Bioplasmosis")) {
        bioplasmosisFactions.push(name);
      }
    }
    if (bioplasmosisFactions.length > 0) {
      abilities["Bioplasmosis"] = {
        factions: bioplasmosisFactions,
        description:
          "You may remove any number of Infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems",
      };
    }
    const ministerOfPolicy = agendas["Minister of Policy"];
    if (
      ministerOfPolicy &&
      ministerOfPolicy.resolved &&
      ministerOfPolicy.target
    ) {
      abilities["Minister of Policy"] = {
        factions: [ministerOfPolicy.target],
        description:
          ministerOfPolicy.passedText ?? ministerOfPolicy.description,
      };
    }
    return abilities;
  }

  const round = state?.round ?? 1;
  const type = round < 4 ? "stage-one" : "stage-two";
  const orderedStrategyCards = Object.values(strategyCards ?? {})
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
  const availableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      return objective.type === type && !objective.selected;
    }
  );
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
    }
    if (hasTech(faction, "Hyper Metabolism")) {
      number = 3;
    }
    numberOfCommandTokens[number].push(faction);
  });

  let startingStep = 2;
  let numSteps = 8;
  if (Object.entries(getStartOfStatusPhaseAbilities()).length > 0) {
    // numSteps++;
    startingStep = 1;
  }
  if (Object.entries(getEndOfStatusPhaseAbilities()).length > 0) {
    numSteps++;
  }

  let innerContent = null;
  switch (subState.currentStep) {
    case 1:
      if (Object.entries(getStartOfStatusPhaseAbilities()).length === 0) {
        advanceCurrentStep();
        return null;
      }
      innerContent = (
        <React.Fragment>
          <ol
            className="flexColumn"
            style={{ width: "100%", alignItems: "flex-start" }}
          >
            {Object.entries(getStartOfStatusPhaseAbilities()).map(
              ([abilityName, ability]) => {
                return (
                  <NumberedItem key={abilityName}>
                    <LabeledDiv label={abilityName}>
                      <div
                        className="flexRow mediumFont"
                        style={{ width: "100%" }}
                      >
                        {ability.factions.map((factionName) => {
                          if (!factions) {
                            return null;
                          }
                          return (
                            <LabeledDiv
                              key={factionName}
                              color={getFactionColor(factions[factionName])}
                              style={{ width: "auto" }}
                            >
                              {getFactionName(factions[factionName])}
                            </LabeledDiv>
                          );
                        })}
                        <div
                          className="popupIcon"
                          onClick={() =>
                            showInfoModal(abilityName, ability.description)
                          }
                        >
                          &#x24D8;
                        </div>
                      </div>
                    </LabeledDiv>
                  </NumberedItem>
                );
              }
            )}
          </ol>
        </React.Fragment>
      );
      break;
    case 2:
      innerContent = (
        <div className="flexColumn">
          In Initiative Order:
          <LabeledDiv label="Score up to one public and one secret objective">
            <div
              className="flexRow"
              style={{
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "stretch",
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
                    (objective.type === "stage-one" ||
                      objective.type === "stage-two") &&
                    !(objective.scorers ?? []).includes(card.faction)
                  );
                });
                const secrets = Object.values(objectives ?? {}).filter(
                  (objective) => {
                    if (!card.faction) {
                      return null;
                    }
                    return (
                      objective.type === "secret" &&
                      !(objective.scorers ?? []).includes(card.faction) &&
                      objective.phase === "status"
                    );
                  }
                );
                if (!factions || !card.faction) {
                  return null;
                }
                const factionColor = getFactionColor(factions[card.faction]);
                const factionName = getFactionName(factions[card.faction]);
                const scoredPublics = (
                  ((subState.factions ?? {})[card.faction] ?? {}).objectives ??
                  []
                ).filter((objective) => {
                  const objectiveObj = objectives
                    ? objectives[objective]
                    : undefined;
                  if (!objectiveObj) {
                    return false;
                  }
                  return (
                    objectiveObj.type === "stage-one" ||
                    objectiveObj.type === "stage-two"
                  );
                });
                const scoredSecrets = (
                  ((subState.factions ?? {})[card.faction] ?? {}).objectives ??
                  []
                ).filter((objective) => {
                  const objectiveObj = objectives
                    ? objectives[objective]
                    : undefined;
                  if (!objectiveObj) {
                    return false;
                  }
                  return objectiveObj.type === "secret";
                });
                return (
                  <ClientOnlyHoverMenu
                    key={card.name}
                    label={factionName}
                    borderColor={factionColor}
                  >
                    <div
                      className={
                        scoredPublics.length === 0 && scoredSecrets.length === 0
                          ? "flexRow"
                          : "flexColumn"
                      }
                      style={{
                        padding: responsivePixels(8),
                        alignItems: "flex-start",
                      }}
                    >
                      {scoredPublics[0] ? (
                        <LabeledDiv
                          label="SCORED PUBLIC"
                          noBlur={true}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <SelectableRow
                            itemName={scoredPublics[0]}
                            removeItem={() => {
                              if (!card.faction || !scoredPublics[0]) {
                                return;
                              }
                              unscoreObj(card.faction, scoredPublics[0]);
                            }}
                          >
                            {scoredPublics[0]}
                          </SelectableRow>
                        </LabeledDiv>
                      ) : (
                        <ClientOnlyHoverMenu label="Score Public">
                          <div
                            className="flexColumn"
                            style={{
                              whiteSpace: "nowrap",
                              gap: responsivePixels(4),
                              padding: responsivePixels(8),
                              alignItems: "stretch",
                            }}
                          >
                            {availableObjectives.length === 0
                              ? "No unscored public objectives"
                              : null}
                            {availableObjectives.map((objective) => {
                              return (
                                <button
                                  key={objective.name}
                                  style={{ fontSize: responsivePixels(14) }}
                                  onClick={() => {
                                    if (!card.faction || !scoredPublics[0]) {
                                      return;
                                    }
                                    scoreObj(card.faction, objective);
                                  }}
                                >
                                  {objective.name}
                                </button>
                              );
                            })}
                          </div>
                        </ClientOnlyHoverMenu>
                      )}
                      {scoredSecrets[0] ? (
                        <LabeledDiv
                          label="SCORED SECRET"
                          noBlur={true}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <SelectableRow
                            itemName={scoredSecrets[0]}
                            removeItem={() => {
                              if (!card.faction || !scoredSecrets[0]) {
                                return;
                              }
                              unscoreObj(card.faction, scoredSecrets[0]);
                            }}
                          >
                            {scoredSecrets[0]}
                          </SelectableRow>
                        </LabeledDiv>
                      ) : (
                        <ClientOnlyHoverMenu label="Score Secret">
                          <div
                            className="flexRow"
                            style={{
                              display: "grid",
                              gridAutoFlow: "column",
                              gridTemplateRows: "repeat(9, auto)",
                              justifyContent: "flex-start",
                              whiteSpace: "nowrap",
                              padding: responsivePixels(8),
                              gap: responsivePixels(4),
                              alignItems: "stretch",
                            }}
                          >
                            {secrets.map((objective) => {
                              return (
                                <button
                                  key={objective.name}
                                  style={{
                                    writingMode: "horizontal-tb",
                                    fontSize: responsivePixels(14),
                                  }}
                                  onClick={() => {
                                    if (!card.faction) {
                                      return;
                                    }
                                    scoreObj(card.faction, objective);
                                  }}
                                >
                                  {objective.name}
                                </button>
                              );
                            })}
                          </div>
                        </ClientOnlyHoverMenu>
                      )}
                    </div>
                  </ClientOnlyHoverMenu>
                );
              })}
            </div>
          </LabeledDiv>
        </div>
      );
      break;
    case 3:
      if (!objectives || !factions) {
        return null;
      }
      const subStateObjective = (subState.objectives ?? [])[0];
      const subStateObjectiveObj = objectives[subStateObjective ?? ""];
      innerContent = (
        <div className="extraLargeFont">
          {subStateObjectiveObj ? (
            <LabeledDiv label="REVEALED OBJECTIVE">
              <ObjectiveRow
                objective={subStateObjectiveObj}
                removeObjective={() => removeObj(subStateObjectiveObj.name)}
                viewing={true}
              />
            </LabeledDiv>
          ) : (
            <LabeledDiv
              label={`Speaker: ${getFactionName(
                factions[state?.speaker ?? ""]
              )}`}
              color={getFactionColor(factions[state?.speaker ?? ""])}
              style={{ width: "100%" }}
            >
              <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                {(subState.objectives ?? []).map((objective) => {
                  const objectiveObj = objectives[objective];
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
                {(subState.objectives ?? []).length < 1 ? (
                  <ClientOnlyHoverMenu
                    label={`Reveal one Stage ${
                      round > 3 ? "II" : "I"
                    } objective`}
                  >
                    <div
                      className="flexRow largeFont"
                      style={{
                        gap: responsivePixels(4),
                        whiteSpace: "nowrap",
                        padding: responsivePixels(8),
                        alignItems: "stretch",
                        display: "grid",
                        gridAutoFlow: "column",
                        gridTemplateRows: "repeat(5, auto)",
                        justifyContent: "flex-start",
                      }}
                    >
                      {Object.values(availableObjectives)
                        .filter((objective) => {
                          return (
                            objective.type ===
                            (round > 3 ? "stage-two" : "stage-one")
                          );
                        })
                        .map((objective) => {
                          return (
                            <button
                              key={objective.name}
                              style={{
                                writingMode: "horizontal-tb",
                                fontSize: responsivePixels(16),
                              }}
                              onClick={() => addObj(objective)}
                            >
                              {objective.name}
                            </button>
                          );
                        })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </div>
            </LabeledDiv>
          )}{" "}
        </div>
      );
      break;
    case 4:
      if (!factions) {
        return null;
      }
      innerContent = (
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "stretch" }}
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
                    paddingLeft: responsivePixels(8),
                  }}
                >
                  <LabeledDiv
                    label={`Draw ${displayNum} ${pluralize(
                      "Action Card",
                      num
                    )}${num === 3 ? " and discard any 1" : ""}`}
                  >
                    <div
                      className="flexRow"
                      style={{ flexWrap: "wrap", justifyContent: "flex-start" }}
                    >
                      {localFactions.map((faction) => {
                        let menuButtons = [];
                        if (!hasTech(faction, "Neural Motivator")) {
                          menuButtons.push({
                            text: "Add Neural Motivator",
                            action: () => {
                              if (!gameid) {
                                return;
                              }
                              unlockTech(
                                gameid,
                                faction.name,
                                "Neural Motivator"
                              );
                            },
                          });
                        } else {
                          menuButtons.push({
                            text: "Remove Neural Motivator",
                            action: () => {
                              if (!gameid) {
                                return;
                              }
                              lockTech(
                                gameid,
                                faction.name,
                                "Neural Motivator"
                              );
                            },
                          });
                        }
                        return (
                          <BasicFactionTile
                            key={faction.name}
                            faction={faction}
                            menuButtons={menuButtons}
                            opts={{
                              fontSize: responsivePixels(16),
                              menuSide: "bottom",
                            }}
                          />
                        );
                      })}
                    </div>
                  </LabeledDiv>
                </div>
              );
            }
          )}
        </div>
      );
      break;
    case 5:
      innerContent = (
        <div
          className="flexColumn extraLargeFont"
          style={{ width: "100%", textAlign: "center" }}
        >
          Return Command Tokens from the Board to Reinforcements
        </div>
      );
      break;
    case 6:
      innerContent = (
        <div
          className="flexColumn"
          style={{
            justifyContent: "flex-start",
            alignItems: "stretch",
            gap: responsivePixels(2),
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
                  <LabeledDiv
                    label={`Gain ${num} ${pluralize(
                      "Command Token",
                      num
                    )} and Redistribute`}
                  >
                    <div
                      className="flexRow"
                      style={{
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        padding: `0 ${responsivePixels(8)}`,
                      }}
                    >
                      {localFactions.map((faction) => {
                        let menuButtons = [];
                        if (!hasTech(faction, "Hyper Metabolism")) {
                          menuButtons.push({
                            text: "Add Hyper Metabolism",
                            action: () => {
                              if (!gameid) {
                                return;
                              }
                              unlockTech(
                                gameid,
                                faction.name,
                                "Hyper Metabolism"
                              );
                            },
                          });
                        } else {
                          menuButtons.push({
                            text: "Remove Hyper Metabolism",
                            action: () => {
                              if (!gameid) {
                                return;
                              }
                              lockTech(
                                gameid,
                                faction.name,
                                "Hyper Metabolism"
                              );
                            },
                          });
                        }
                        return (
                          <BasicFactionTile
                            key={faction.name}
                            faction={faction}
                            menuButtons={menuButtons}
                            opts={{
                              fontSize: responsivePixels(16),
                              menuSide: "bottom",
                            }}
                          />
                        );
                      })}
                    </div>
                  </LabeledDiv>
                </div>
              );
            }
          )}
        </div>
      );
      break;
    case 7:
      innerContent = (
        <div
          className="flexColumn extraLargeFont"
          style={{ width: "100%", textAlign: "center" }}
        >
          Ready Cards
        </div>
      );
      break;
    case 8:
      innerContent = (
        <div
          className="flexColumn extraLargeFont"
          style={{ width: "100%", textAlign: "center" }}
        >
          Repair Units
        </div>
      );
      break;
    case 9:
      innerContent = (
        <div
          className="flexColumn extraLargeFont"
          style={{ width: "100%", textAlign: "center" }}
        >
          Return Strategy Cards
        </div>
      );
      break;
    case 10:
      innerContent = (
        <ol
          className="flexColumn"
          style={{ width: "100%", alignItems: "flex-start" }}
        >
          {Object.entries(getEndOfStatusPhaseAbilities()).map(
            ([abilityName, ability]) => {
              return (
                <NumberedItem key={abilityName}>
                  <LabeledDiv label={abilityName}>
                    <div
                      className="flexRow mediumFont"
                      style={{ width: "100%" }}
                    >
                      {ability.factions.map((factionName) => {
                        if (!factions) {
                          return null;
                        }
                        return (
                          <LabeledDiv
                            key={factionName}
                            color={getFactionColor(factions[factionName])}
                            style={{ width: "auto" }}
                          >
                            {getFactionName(factions[factionName])}
                          </LabeledDiv>
                        );
                      })}
                      <div
                        className="popupIcon"
                        onClick={() =>
                          showInfoModal(abilityName, ability.description)
                        }
                      >
                        &#x24D8;
                      </div>
                    </div>
                  </LabeledDiv>
                </NumberedItem>
              );
            }
          )}
        </ol>
      );
      break;
  }

  const stepCounter = [];
  for (let i = startingStep; i <= numSteps + 1; i++) {
    stepCounter.push(i);
    // if (subState.currentStep >= i) {
    //   stepCounter.push(i);
    // } else {
    //   stepCounter.push(false);
    // }
  }

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setInfoModal({ show: false })}
        visible={infoModal.show}
        title={infoModal.title}
      >
        <InfoContent>{infoModal.content}</InfoContent>
      </Modal>
      <div className="flexColumn" style={{ height: "100%" }}>
        {innerContent}
      </div>
      <div className="flexColumn">
        <div className="flexRow">
          {subState.currentStep > startingStep ? (
            <button onClick={reverseCurrentStep}>Back</button>
          ) : null}
          {subState.currentStep < numSteps + 1 ? (
            <button disabled={!stepComplete()} onClick={advanceCurrentStep}>
              Next
            </button>
          ) : null}
        </div>
        <div className="flexRow">
          {stepCounter.map((val) => {
            if (val <= subState.currentStep) {
              return (
                <div
                  key={val}
                  className="extraLargeFont"
                  style={{ cursor: "pointer" }}
                  onClick={() => jumpToStep(val)}
                >
                  &#x25CF;
                </div>
              );
            }
            return (
              <div
                key={val}
                className="extraLargeFont"
                style={{ cursor: "pointer" }}
                onClick={() => jumpToStep(val)}
              >
                &#x25CB;
              </div>
            );
          })}
        </div>
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
    fetcher
  );
  const { data: strategyCards }: { data?: Record<string, StrategyCard> } =
    useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );

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

  const round = state?.round;
  const orderedStrategyCards = Object.values(strategyCards ?? {})
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

  const numCards = orderedStrategyCards.length;

  return (
    <div
      className="flexRow"
      style={{
        gap: responsivePixels(20),
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          justifyContent: "flex-start",
          paddingTop: responsivePixels(140),
          boxSizing: "border-box",
          height: "100%",
          gap: numCards > 7 ? 0 : responsivePixels(8),
        }}
      >
        {orderedStrategyCards.map((card) => {
          return (
            <SmallStrategyCard
              key={card.name}
              card={card}
              active={!card.used}
            />
          );
        })}
      </div>
      <div
        className="flexColumn"
        style={{
          height: "100vh",
          boxSizing: "border-box",
          paddingTop: responsivePixels(80),
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          className="flexColumn"
          style={{
            width: "100%",
            height: "70vh",
            justifyContent: "space-between",
          }}
        >
          <MiddleColumn />
        </div>
        {!statusPhaseComplete(subState) ? (
          <div style={{ color: "firebrick" }}>
            Reveal one Stage {round ?? 1 > 3 ? "II" : "I"} objective
          </div>
        ) : null}
        <div className="flexRow">
          {!state?.agendaUnlocked ? (
            <button
              disabled={!statusPhaseComplete(subState)}
              onClick={() => nextPhase(true)}
            >
              Start Next Round
            </button>
          ) : null}
          <button
            disabled={!statusPhaseComplete(subState)}
            onClick={() => nextPhase()}
          >
            Advance to Agenda Phase
          </button>
        </div>
      </div>
      <div
        className="flexColumn"
        style={{ height: "100vh", flexShrink: 0, width: responsivePixels(280) }}
      >
        <SummaryColumn />
      </div>
    </div>
  );
}
