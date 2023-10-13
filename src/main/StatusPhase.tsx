import { useRouter } from "next/router";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LockedButtons } from "../LockedButton";
import { NumberedItem } from "../NumberedItem";
import { Selector } from "../Selector";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../components/LabeledLine/LabeledLine";
import Modal from "../components/Modal/Modal";
import {
  ActionLogContext,
  AgendaContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  RelicContext,
  StateContext,
  StrategyCardContext,
} from "../context/Context";
import {
  advancePhaseAsync,
  hideObjectiveAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import { getObjectiveScorers } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getInitiativeForFaction } from "../util/helpers";
import { responsivePixels } from "../util/util";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";

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
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const strategyCards = useContext(StrategyCardContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function scoreObj(factionId: FactionId, objectiveId: ObjectiveId) {
    if (!gameid) {
      return;
    }
    scoreObjectiveAsync(gameid, factionId, objectiveId);
  }
  function unscoreObj(factionId: FactionId, objectiveId: ObjectiveId) {
    if (!gameid) {
      return;
    }
    unscoreObjectiveAsync(gameid, factionId, objectiveId);
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
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);
  const revealedObjective = revealedObjectives[0];

  let innerContent = (
    <div className="flexColumn" style={{ width: "100%" }}>
      {!revealedObjective ? (
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
              const canScoreObjectives = Object.values(planets ?? {}).reduce(
                (canScore, planet) => {
                  if (card.faction === "Clan of Saar") {
                    return true;
                  }
                  let planetFaction = card.faction;
                  if (card.faction === "Council Keleres") {
                    planetFaction = factions[card.faction]?.startswith.faction;
                  }
                  if (
                    planet.home &&
                    planet.faction === planetFaction &&
                    planet.owner !== card.faction
                  ) {
                    return false;
                  }
                  return canScore;
                },
                true
              );
              const availableObjectives = Object.values(
                objectives ?? {}
              ).filter((objective) => {
                if (!card.faction) {
                  return null;
                }
                return (
                  objective.selected &&
                  (!objective.phase || objective.phase === "STATUS") &&
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
                    (objective.scorers ?? []).length === 0 &&
                    objective.phase === "STATUS"
                  );
                }
              );
              if (!factions || !card.faction) {
                return null;
              }
              const faction = factions[card.faction];
              const scoredObjectives = currentTurn
                .filter(
                  (logEntry) =>
                    logEntry.data.action === "SCORE_OBJECTIVE" &&
                    logEntry.data.event.faction === card.faction
                )
                .map(
                  (logEntry) =>
                    (logEntry.data as ScoreObjectiveData).event.objective
                );
              const scoredPublics = scoredObjectives.filter((objective) => {
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
              const scoredSecrets = scoredObjectives.filter((objective) => {
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
                  key={card.id}
                  style={{ width: "100%", position: "relative" }}
                >
                  <LabeledLine
                    label={getFactionName(faction)}
                    color={getFactionColor(faction)}
                  />
                  <div
                    className="flexRow"
                    style={{
                      justifyContent: "space-between",
                      height: responsivePixels(36),
                    }}
                  >
                    {!canScoreObjectives ? (
                      <div
                        className="smallFont"
                        style={{ textAlign: "center", width: "40%" }}
                      >
                        Cannot score public objectives
                      </div>
                    ) : !scoredPublics[0] &&
                      availableObjectives.length === 0 ? (
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
                            options={availableObjectives.map((obj) => obj.id)}
                            selectedItem={scoredPublics[0]}
                            hoverMenuLabel="Public"
                            toggleItem={(objectiveId, add) => {
                              if (!card.faction) {
                                return;
                              }
                              if (add) {
                                scoreObj(card.faction, objectiveId);
                              } else {
                                unscoreObj(card.faction, objectiveId);
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
                        {faction ? (
                          <FactionIcon factionId={faction.id} size="100%" />
                        ) : null}
                      </div>
                    </div>
                    <div
                      className="flexColumn smallFont"
                      style={{ width: "40%", alignItems: "flex-start" }}
                    >
                      <div style={{ width: "fit-content" }}>
                        <Selector
                          options={secrets.map((obj) => obj.id)}
                          selectedItem={scoredSecrets[0]}
                          hoverMenuLabel="Secret"
                          toggleItem={(objectiveId, add) => {
                            if (!card.faction) {
                              return;
                            }
                            if (add) {
                              scoreObj(card.faction, objectiveId);
                            } else {
                              unscoreObj(card.faction, objectiveId);
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
                                key={faction.id}
                                className="flexRow"
                                style={{
                                  position: "relative",
                                  width: responsivePixels(32),
                                  height: responsivePixels(32),
                                }}
                              >
                                <FactionIcon
                                  factionId={faction.id}
                                  size="100%"
                                />
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
                                key={faction.id}
                                className="flexRow"
                                style={{
                                  position: "relative",
                                  width: responsivePixels(32),
                                  height: responsivePixels(32),
                                }}
                              >
                                <FactionIcon
                                  factionId={faction.id}
                                  size="100%"
                                />
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

export function statusPhaseComplete(currentTurn: ActionLogEntry[]) {
  const revealedObjectives = currentTurn.filter(
    (logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE"
  );
  return revealedObjectives.length === 1;
}

export default function StatusPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const relics = useContext(RelicContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog);

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
      advancePhaseAsync(gameid);
      return;
    }
    advancePhaseAsync(gameid, true);
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

  function getStartOfStatusPhaseAbilities(): Partial<
    Record<FactionId, Ability[]>
  > {
    if (!factions) {
      return {};
    }
    let abilities: Partial<Record<FactionId, Ability[]>> = {};
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.id === "Arborec") {
        factionAbilities.push({
          name: "Mitosis",
          description:
            "Place 1 Infantry from your reinforcements on any planet you control",
        });
      }
      if (
        !(options?.expansions ?? []).includes("POK") &&
        hasTech(faction, "Wormhole Generator")
      ) {
        factionAbilities.push({
          name: "Wormhole Generator",
          description:
            "Place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
        });
      }
      if (factionAbilities.length > 0) {
        abilities[faction.id] = factionAbilities;
      }
    }
    return abilities;
  }

  const crownOfEmphidia = (relics ?? {})["The Crown of Emphidia"];

  let crownScorer: FactionId | undefined;
  if (crownOfEmphidia && crownOfEmphidia.owner) {
    const crownObjective = (objectives ?? {})["Tomb + Crown of Emphidia"];
    if (
      crownObjective &&
      !crownObjective.scorers?.includes(crownOfEmphidia.owner)
    ) {
      for (const planet of Object.values(planets ?? {})) {
        if (
          planet.owner === crownOfEmphidia.owner &&
          planet.attachments?.includes("Tomb of Emphidia")
        ) {
          crownScorer = crownOfEmphidia.owner;
          break;
        }
      }
    }
  }
  const scoredCrown = getObjectiveScorers(
    currentTurn,
    "Tomb + Crown of Emphidia"
  )[0];

  const crownFaction = crownScorer || scoredCrown;

  function hasEndOfStatusPhaseAbilities() {
    if (crownScorer || scoredCrown) {
      return true;
    }
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
    let abilities: Partial<Record<FactionId, Ability[]>> = {};
    const ministerOfPolicy = agendas["Minister of Policy"];
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.id === "Federation of Sol") {
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
      if (
        ministerOfPolicy &&
        ministerOfPolicy.resolved &&
        ministerOfPolicy.target == faction.id
      ) {
        factionAbilities.push({
          name: "Minister of Policy",
          description:
            ministerOfPolicy.passedText ?? ministerOfPolicy.description,
        });
      }
      if (factionAbilities.length > 0) {
        abilities[faction.id] = factionAbilities;
      }
    }
    return abilities;
  }

  const round = state?.round ?? 1;
  const orderedStrategyCards = Object.values(strategyCards)
    .filter((card) => card.faction)
    .sort((a, b) => a.order - b.order);

  const cardsByFaction: Partial<Record<FactionId, StrategyCard[]>> = {};
  orderedStrategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    if (!cardsByFaction[card.faction]) {
      cardsByFaction[card.faction] = [];
    }
    cardsByFaction[card.faction]?.push(card);
  });

  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);
  const revealedObjective = revealedObjectives[0];
  const revealedObjectiveObj = revealedObjective
    ? (objectives ?? {})[revealedObjective]
    : undefined;
  const type = round < 4 ? "STAGE ONE" : "STAGE TWO";
  const availableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      return objective.type === type && !objective.selected;
    }
  );
  function addObj(objectiveId: ObjectiveId) {
    if (!gameid) {
      return;
    }
    revealObjectiveAsync(gameid, objectiveId);
  }

  function removeObj(objectiveId: ObjectiveId) {
    if (!gameid) {
      return;
    }
    hideObjectiveAsync(gameid, objectiveId);
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
      <ol
        className="flexColumn largeFont"
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          boxSizing: "border-box",
          height: "100svh",
          margin: 0,
          paddingLeft: responsivePixels(20),
          whiteSpace: "nowrap",
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
                      a[0] as FactionId
                    );
                    const initiativeB = getInitiativeForFaction(
                      strategyCards,
                      b[0] as FactionId
                    );
                    if (initiativeA > initiativeB) {
                      return 1;
                    }
                    return -1;
                  })
                  .map(([factionId, abilities]) => {
                    if (!factions) {
                      return null;
                    }
                    return (
                      <LabeledDiv
                        key={factionId}
                        label={getFactionName(factions[factionId as FactionId])}
                        color={getFactionColor(
                          factions[factionId as FactionId]
                        )}
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
            {revealedObjectiveObj ? (
              <LabeledDiv
                label={`Revealed Stage ${round < 4 ? "I" : "II"} Objective`}
              >
                <ObjectiveRow
                  objective={revealedObjectiveObj}
                  removeObjective={() => removeObj(revealedObjectiveObj.id)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <LabeledDiv
                label={getFactionName((factions ?? {})[state?.speaker ?? ""])}
                color={getFactionColor((factions ?? {})[state?.speaker ?? ""])}
                style={{ width: "100%" }}
              >
                <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                  <Selector
                    hoverMenuLabel={`Reveal one Stage ${
                      round > 3 ? "II" : "I"
                    } objective`}
                    selectedItem={undefined}
                    options={Object.values(availableObjectives)
                      .filter((objective) => {
                        return (
                          objective.type ===
                          (round > 3 ? "STAGE TWO" : "STAGE ONE")
                        );
                      })
                      .map((obj) => obj.id)}
                    toggleItem={(objectiveId, add) => {
                      if (add) {
                        addObj(objectiveId);
                      } else {
                        removeObj(objectiveId);
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
                      a[0] as FactionId
                    );
                    const initiativeB = getInitiativeForFaction(
                      strategyCards,
                      b[0] as FactionId
                    );
                    if (initiativeA > initiativeB) {
                      return 1;
                    }
                    return -1;
                  })
                  .map(([factionId, abilities]) => {
                    if (!factions) {
                      return null;
                    }
                    return (
                      <LabeledDiv
                        key={factionId}
                        label={getFactionName(factions[factionId as FactionId])}
                        color={getFactionColor(
                          factions[factionId as FactionId]
                        )}
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
                {crownFaction ? (
                  <LabeledDiv
                    key={crownFaction}
                    label={getFactionName((factions ?? {})[crownFaction])}
                    color={getFactionColor((factions ?? {})[crownFaction])}
                  >
                    <div className="flexRow">
                      Purge Crown of Emphidia to score 1 VP?
                      <div
                        key={crownFaction}
                        className="flexRow hiddenButtonParent"
                        style={{
                          position: "relative",
                          width: responsivePixels(32),
                          height: responsivePixels(32),
                        }}
                      >
                        <FactionIcon factionId={crownFaction} size="100%" />
                        <div
                          className="flexRow"
                          style={{
                            position: "absolute",
                            backgroundColor: "#222",
                            cursor: "pointer",
                            borderRadius: "100%",
                            marginLeft: "60%",
                            marginTop: "60%",
                            boxShadow: `${responsivePixels(
                              1
                            )} ${responsivePixels(1)} ${responsivePixels(
                              4
                            )} black`,
                            width: responsivePixels(20),
                            height: responsivePixels(20),
                            zIndex: 2,
                            color: scoredCrown ? "green" : "red",
                          }}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            if (scoredCrown) {
                              unscoreObjectiveAsync(
                                gameid,
                                crownFaction,
                                "Tomb + Crown of Emphidia"
                              );
                            } else {
                              scoreObjectiveAsync(
                                gameid,
                                crownFaction,
                                "Tomb + Crown of Emphidia"
                              );
                            }
                          }}
                        >
                          {scoredCrown ? (
                            <div
                              className="symbol"
                              style={{
                                fontSize: responsivePixels(18),
                                lineHeight: responsivePixels(18),
                              }}
                            >
                              ✓
                            </div>
                          ) : (
                            <div
                              className="flexRow"
                              style={{
                                width: "80%",
                                height: "80%",
                              }}
                            >
                              <SymbolX color="red" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </LabeledDiv>
                ) : null}
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
          unlocked={statusPhaseComplete(currentTurn)}
          buttons={nextPhaseButtons}
        />
      </div>
      {/* </div> */}
    </React.Fragment>
  );
}
