import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LockedButtons } from "../LockedButton";
import { NumberedItem } from "../NumberedItem";
import CrownOfEmphidia from "../components/CrownOfEmphidia/CrownOfEmphidia";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../components/LabeledLine/LabeledLine";
import Modal from "../components/Modal/Modal";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "../components/Selector/Selector";
import { GameIdContext } from "../context/Context";
import {
  useActionLog,
  useAgenda,
  useFactions,
  useGameState,
  useObjectives,
  useOptions,
  usePlanets,
  useRelics,
  useStrategyCards,
} from "../context/dataHooks";
import {
  advancePhaseAsync,
  hideObjectiveAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { getPlayedRelic } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getInitiativeForFaction } from "../util/helpers";
import { objectiveTypeString, phaseString } from "../util/strings";
import styles from "./StatusPhase.module.scss";

function InfoContent({ children }: PropsWithChildren) {
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
      }}
    >
      {children}
    </div>
  );
}

function CommandTokenGains() {
  const factions = useFactions();
  const strategyCards = useStrategyCards();

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

  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="8OswCT"
          description="Text telling the players to gain command tokens and redistribute."
          defaultMessage="Gain Command Tokens and Redistribute"
        />
      }
    >
      <div
        className="flexRow"
        style={{
          justifyContent: "flex-start",
          alignItems: "stretch",
          paddingTop: "2px",
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
                    {localFactions.map((faction) => {
                      return (
                        <div
                          key={faction.id}
                          className="flexRow"
                          style={{
                            position: "relative",
                            width: "32px",
                            height: "32px",
                            userSelect: "none",
                          }}
                        >
                          <FactionIcon factionId={faction.id} size="100%" />
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
  );
}

function ActionCardDraws() {
  const factions = useFactions();
  const strategyCards = useStrategyCards();

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

  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="xtgxwA"
          description="Instruction telling players to draw action cards."
          defaultMessage="Draw Action Cards"
        />
      }
    >
      <div
        className="flexRow"
        style={{
          justifyContent: "space-evenly",
          alignItems: "stretch",
          flexWrap: "wrap",
          paddingTop: "2px",
        }}
      >
        {Object.entries(numberOfActionCards).map(([number, localFactions]) => {
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
                label={`${displayNum}${num === 3 ? " (Discard 1)" : ""}`}
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
                          width: "32px",
                          height: "32px",
                          userSelect: "none",
                        }}
                      >
                        <FactionIcon factionId={faction.id} size="100%" />
                      </div>
                    );
                  })}
                </div>
              </LabeledDiv>
            </div>
          );
        })}
      </div>
    </LabeledDiv>
  );
}

export function MiddleColumn() {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function scoreObj(factionId: FactionId, objectiveId: ObjectiveId) {
    if (!gameId) {
      return;
    }
    scoreObjectiveAsync(gameId, factionId, objectiveId);
  }
  function unscoreObj(factionId: FactionId, objectiveId: ObjectiveId) {
    if (!gameId) {
      return;
    }
    unscoreObjectiveAsync(gameId, factionId, objectiveId);
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
        <LabeledDiv
          label={
            <FormattedMessage
              id="WHJC8f"
              description="Text telling the players to score objectives."
              defaultMessage="Score Objectives"
            />
          }
          noBlur={true}
        >
          <div className={styles.ScoreObjectivesSection}>
            {filteredStrategyCards.map((card) => {
              const canScoreObjectives = Object.values(planets ?? {}).reduce(
                (canScore, planet) => {
                  if (card.faction === "Clan of Saar") {
                    return true;
                  }
                  let planetFaction = card.faction;
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
              const availableObjectives = Object.values(objectives).filter(
                (objective) => {
                  if (!card.faction) {
                    return null;
                  }
                  return (
                    objective.selected &&
                    (!objective.phase || objective.phase === "STATUS") &&
                    (objective.type === "STAGE ONE" ||
                      objective.type === "STAGE TWO") &&
                    (!(objective.scorers ?? []).includes(card.faction) ||
                      scoredPublics.includes(objective.id))
                  );
                }
              );
              const secrets = Object.values(objectives).filter((objective) => {
                if (!card.faction) {
                  return null;
                }
                return (
                  objective.type === "SECRET" &&
                  ((objective.scorers ?? []).length === 0 ||
                    scoredSecrets.includes(objective.id)) &&
                  objective.phase === "STATUS"
                );
              });
              if (!factions || !card.faction) {
                return null;
              }
              const faction = factions[card.faction];
              return (
                <div
                  key={card.id}
                  className={styles.ObjectiveSection}
                  style={{ width: "100%", position: "relative" }}
                >
                  <div style={{ gridColumn: "1 / 4", width: "100%" }}>
                    <LabeledLine
                      label={getFactionName(faction)}
                      color={getFactionColor(faction)}
                    />
                  </div>
                  {!canScoreObjectives ? (
                    <div className="smallFont" style={{ textAlign: "center" }}>
                      <FormattedMessage
                        id="CoNZle"
                        description="Message telling a player that they cannot score public objectives."
                        defaultMessage="Cannot score Public Objectives"
                      />
                    </div>
                  ) : !scoredPublics[0] && availableObjectives.length === 0 ? (
                    <div className="smallFont" style={{ textAlign: "center" }}>
                      <FormattedMessage
                        id="HQ3wv9"
                        description="Message telling a player that they have scored all objectives."
                        defaultMessage="No unscored Public Objectives"
                      />
                    </div>
                  ) : (
                    <div
                      className="flexColumn smallFont"
                      style={{
                        width: "100%",
                        alignItems: scoredPublics[0] ? "flex-start" : "center",
                        gridColumn: "1 / 2",
                      }}
                    >
                      <div style={{ width: "fit-content" }}>
                        {scoredPublics[0] ? (
                          <Selector
                            options={availableObjectives}
                            selectedItem={scoredPublics[0]}
                            hoverMenuLabel={
                              <FormattedMessage
                                id="6EVvXu"
                                description="Label for selecting a public objective."
                                defaultMessage="Public"
                              />
                            }
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
                        ) : (
                          <ObjectiveSelectHoverMenu
                            action={(_, objectiveId) => {
                              if (!card.faction) {
                                return;
                              }
                              scoreObj(card.faction, objectiveId);
                            }}
                            label={
                              <FormattedMessage
                                id="6EVvXu"
                                description="Label for selecting a public objective."
                                defaultMessage="Public"
                              />
                            }
                            objectives={availableObjectives}
                            fontSize="14px"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    className="flexColumn"
                    style={{
                      position: "absolute",
                      zIndex: -1,
                      width: "100%",
                      gridColumn: "1 / 4",
                      gridRow: "2 / 3",
                    }}
                  >
                    <div
                      className="flexRow"
                      style={{
                        position: "relative",
                        opacity: 0.5,
                        top: "2px",
                        width: "40px",
                        height: "40px",
                        userSelect: "none",
                      }}
                    >
                      {faction ? (
                        <FactionIcon factionId={faction.id} size="100%" />
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="flexColumn smallFont"
                    style={{
                      alignItems: "flex-start",
                      gridColumn: "3 / 4",
                    }}
                  >
                    <div style={{ width: "fit-content" }}>
                      {scoredSecrets[0] ? (
                        <Selector
                          options={secrets}
                          selectedItem={scoredSecrets[0]}
                          hoverMenuLabel={
                            <FormattedMessage
                              id="ggO0Am"
                              description="Label for selecting a secret objective."
                              defaultMessage="Secret"
                            />
                          }
                          style={{ maxWidth: "calc(88vw - 50px)" }}
                          itemsPerColumn={10}
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
                      ) : (
                        <ObjectiveSelectHoverMenu
                          action={(_, objectiveId) => {
                            if (!card.faction) {
                              return;
                            }
                            scoreObj(card.faction, objectiveId);
                          }}
                          label={
                            <FormattedMessage
                              id="ggO0Am"
                              description="Label for selecting a secret objective."
                              defaultMessage="Secret"
                            />
                          }
                          objectives={secrets}
                          fontSize="14px"
                          perColumn={10}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </LabeledDiv>
      ) : (
        <React.Fragment>
          <ActionCardDraws />
          <CommandTokenGains />
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
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
  const relics = useRelics();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  const ministerOfPolicy = useAgenda("Minister of Policy");

  const intl = useIntl();

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
    if (!gameId) {
      return;
    }
    if (!skipAgenda) {
      advancePhaseAsync(gameId);
      return;
    }
    advancePhaseAsync(gameId, true);
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
          name: intl.formatMessage({
            id: "Arborec.Abilities.Mitosis.Title",
            defaultMessage: "Mitosis",
            description: "Title of Faction Ability: Mitosis",
          }),
          description: intl.formatMessage({
            id: "Arborec.Abilities.Mitosis.Description",
            defaultMessage:
              "Your space docks cannot produce infantry. At the start of the status phase, place 1 infantry from your reinforcements on any planet you control.",
            description: "Description for Faction Ability: Mitosis",
          }),
        });
      }
      if (
        !(options?.expansions ?? []).includes("POK") &&
        hasTech(faction, "Wormhole Generator")
      ) {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Ghosts of Creuss.Techs.Wormhole Generator.Title",
            defaultMessage: "Wormhole Generator",
            description: "Title of Tech: Wormhole Generator",
          }),
          description: intl.formatMessage({
            id: "Ghosts of Creuss.Techs.Wormhole Generator.Description",
            defaultMessage:
              "At the start of the status phase, place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.",
            description: "Description for Tech: Wormhole Generator",
          }),
        });
      }
      if (factionAbilities.length > 0) {
        abilities[faction.id] = factionAbilities;
      }
    }
    return abilities;
  }

  const crownOfEmphidia = (relics ?? {})["The Crown of Emphidia"];

  const wasCrownPlayedThisTurn = getPlayedRelic(
    currentTurn,
    "The Crown of Emphidia"
  );
  const isCrownPurged = relics["The Crown of Emphidia"]?.state === "purged";
  const crownOwner = relics["The Crown of Emphidia"]?.owner;

  function hasEndOfStatusPhaseAbilities() {
    if (crownOwner && (wasCrownPlayedThisTurn || !isCrownPurged)) {
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
    let abilities: Partial<Record<FactionId, Ability[]>> = {};
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.id === "Federation of Sol") {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Federation of Sol.Units.Genesis.Title",
            defaultMessage: "Genesis",
            description: "Title of Faction Unit: Genesis",
          }),
          description: intl.formatMessage({
            id: "Federation of Sol.Units.Genesis.Description",
            defaultMessage:
              "At the end of the status phase, place 1 infantry from your reinforcements in this system's space area.",
            description: "Description for Faction Unit: Genesis",
          }),
        });
      }
      if (hasTech(faction, "Bioplasmosis")) {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Arborec.Techs.Bioplasmosis.Title",
            defaultMessage: "Bioplasmosis",
            description: "Title of Tech: Bioplasmosis",
          }),
          description: intl.formatMessage({
            id: "Arborec.Techs.Bioplasmosis.Description",
            defaultMessage:
              "At the end of the status phase, you may remove any number of your infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems.",
            description: "Description for Tech: Bioplasmosis",
          }),
        });
      }
      if (
        ministerOfPolicy &&
        ministerOfPolicy.resolved &&
        ministerOfPolicy.target == faction.id
      ) {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Agendas.Minister of Policy.Title",
            defaultMessage: "Minister of Policy",
            description: "Title of Agenda Card: Minister of Policy",
          }),
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
    if (!gameId) {
      return;
    }
    revealObjectiveAsync(gameId, objectiveId);
  }

  function removeObj(objectiveId: ObjectiveId) {
    if (!gameId) {
      return;
    }
    hideObjectiveAsync(gameId, objectiveId);
  }

  const nextPhaseButtons = [];
  if (!state?.agendaUnlocked) {
    nextPhaseButtons.push({
      text: intl.formatMessage({
        id: "5WXn8l",
        defaultMessage: "Start Next Round",
        description: "Text on a button that will start the next round.",
      }),
      onClick: () => nextPhase(true),
    });
  }
  nextPhaseButtons.push({
    text: intl.formatMessage(
      {
        id: "8/h2ME",
        defaultMessage: "Advance to {phase} Phase",
        description:
          "Text on a button that will advance the game to a specific phase.",
      },
      { phase: phaseString("AGENDA", intl) }
    ),
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
      <ol className={`largeFont ${styles.LeftColumn}`}>
        {!hasStartOfStatusPhaseAbilities() ? null : (
          <NumberedItem>
            <ClientOnlyHoverMenu
              label={
                <FormattedMessage
                  id="4PYolM"
                  defaultMessage="Start of {phase} Phase"
                  description="Text showing that something will occur at the start of a specific phase."
                  values={{ phase: phaseString("STATUS", intl) }}
                />
              }
            >
              <div className="flexColumn" style={{ padding: "8px" }}>
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
        <NumberedItem>
          <FormattedMessage
            id="WHJC8f"
            description="Text telling the players to score objectives."
            defaultMessage="Score Objectives"
          />
          {!revealedObjective ? (
            <div className={styles.EmbeddedObjectives}>
              <MiddleColumn />
            </div>
          ) : null}
        </NumberedItem>
        <NumberedItem>
          <div className="largeFont">
            {revealedObjectiveObj ? (
              <LabeledDiv
                label={
                  <FormattedMessage
                    id="IfyaDZ"
                    description="A label for revealed objectives."
                    defaultMessage="Revealed {type} {count, plural, one {Objective} other {Objectives}}"
                    values={{
                      count: 1,
                      type:
                        round > 3
                          ? objectiveTypeString("STAGE TWO", intl)
                          : objectiveTypeString("STAGE ONE", intl),
                    }}
                  />
                }
              >
                <ObjectiveRow
                  objective={revealedObjectiveObj}
                  removeObjective={() => removeObj(revealedObjectiveObj.id)}
                  viewing={true}
                />
              </LabeledDiv>
            ) : (
              <LabeledDiv
                label={getFactionName(factions[state.speaker])}
                color={getFactionColor(factions[state.speaker])}
                style={{ width: "100%" }}
              >
                <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                  <ObjectiveSelectHoverMenu
                    action={(_, objectiveId) => addObj(objectiveId)}
                    label={
                      <FormattedMessage
                        id="lDBTCO"
                        description="Instruction telling the speaker to reveal objectives."
                        defaultMessage="Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}"
                        values={{
                          count: 1,
                          type:
                            round > 3
                              ? objectiveTypeString("STAGE TWO", intl)
                              : objectiveTypeString("STAGE ONE", intl),
                        }}
                      />
                    }
                    objectives={Object.values(availableObjectives).filter(
                      (objective) => {
                        return (
                          objective.type ===
                          (round > 3 ? "STAGE TWO" : "STAGE ONE")
                        );
                      }
                    )}
                  />
                </div>
              </LabeledDiv>
            )}
          </div>
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="xtgxwA"
            description="Instruction telling players to draw action cards."
            defaultMessage="Draw Action Cards"
          />
          {revealedObjective ? (
            <div className={styles.EmbeddedObjectives}>
              <ActionCardDraws />
            </div>
          ) : null}
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="Jdx9F+"
            description="Instruction telling players to remove command tokens."
            defaultMessage="Remove Command Tokens"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="YotjeE"
            description="Instruction telling players to gain and redistribute Tokens."
            defaultMessage="Gain and Redistribute Tokens"
          />
          {revealedObjective ? (
            <div className={styles.EmbeddedObjectives}>
              <CommandTokenGains />
            </div>
          ) : null}
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="OVn1wE"
            description="Instruction telling players to ready cards."
            defaultMessage="Ready Cards"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="xhMq82"
            description="Instruction telling players to repair units."
            defaultMessage="Repair Units"
          />
        </NumberedItem>
        <NumberedItem>
          <FormattedMessage
            id="0NYmNN"
            description="Instruction telling players to return strategy cards."
            defaultMessage="Return Strategy Cards"
          />
        </NumberedItem>
        {!hasEndOfStatusPhaseAbilities() ? null : (
          <NumberedItem>
            <ClientOnlyHoverMenu
              label={
                <FormattedMessage
                  id="CG2MQj"
                  description="Text showing that something will occur at the end of a specific phase."
                  defaultMessage="End of {phase} Phase"
                  values={{ phase: phaseString("STATUS", intl) }}
                />
              }
            >
              <div className="flexColumn" style={{ padding: "8px" }}>
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
                <CrownOfEmphidia />
              </div>
            </ClientOnlyHoverMenu>
          </NumberedItem>
        )}
        <div className={styles.EmbeddedObjectives}>
          <LockedButtons
            unlocked={statusPhaseComplete(currentTurn)}
            buttons={nextPhaseButtons}
          />
        </div>
      </ol>
      <div className={styles.MainColumn}>
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
