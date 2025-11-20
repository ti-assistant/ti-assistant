import React, { use } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { LockedButtons } from "../../../../../../src/LockedButton";
import { NumberedItem } from "../../../../../../src/NumberedItem";
import CrownOfEmphidia from "../../../../../../src/components/CrownOfEmphidia/CrownOfEmphidia";
import FactionComponents from "../../../../../../src/components/FactionComponents/FactionComponents";
import FactionName from "../../../../../../src/components/FactionComponents/FactionName";
import FactionIcon from "../../../../../../src/components/FactionIcon/FactionIcon";
import FormattedDescription from "../../../../../../src/components/FormattedDescription/FormattedDescription";
import IconDiv from "../../../../../../src/components/LabeledDiv/IconDiv";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import { ModalContent } from "../../../../../../src/components/Modal/Modal";
import ObjectiveRow from "../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import TechResearchSection from "../../../../../../src/components/TechResearchSection/TechResearchSection";
import { ModalContext } from "../../../../../../src/context/contexts";
import {
  useActionLog,
  useAgenda,
  useCurrentTurn,
  useGameId,
  useOptions,
  usePlanets,
  useRelics,
  useStrategyCards,
  useTech,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColor,
  useFactions,
  useFactionTechs,
} from "../../../../../../src/context/factionDataHooks";
import { useCompleteOrderedFactionIds } from "../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import {
  useAgendaUnlocked,
  useRound,
  useSpeaker,
  useTyrant,
} from "../../../../../../src/context/stateDataHooks";
import {
  useFactionsWithTech,
  useTechState,
} from "../../../../../../src/context/techDataHooks";
import {
  addTechAsync,
  advancePhaseAsync,
  hideObjectiveAsync,
  removeTechAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../../../../src/dynamic/api";
import {
  getLogEntries,
  getPlayedRelic,
  getReplacedTechs,
  getResearchedTechs,
} from "../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../src/util/api/actionLog";
import { hasTech } from "../../../../../../src/util/api/techs";
import { getColorForFaction } from "../../../../../../src/util/factions";
import { getInitiativeForFaction } from "../../../../../../src/util/helpers";
import {
  objectiveTypeString,
  phaseString,
} from "../../../../../../src/util/strings";
import { ActionLog } from "../../../../../../src/util/types/types";
import {
  objectEntries,
  objectKeys,
  rem,
} from "../../../../../../src/util/util";
import styles from "./StatusPhase.module.scss";
import { TechRow } from "../../../../../../src/TechRow";
import TechSelectHoverMenu from "../../../../../../src/components/TechSelectHoverMenu/TechSelectHoverMenu";
import Conditional from "../../../../../../src/components/Conditional/Conditional";

function CommandTokenGains() {
  const factionsWithHyper = useFactionsWithTech("Hyper Metabolism");
  const hyperState = useTechState("Hyper Metabolism");
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
    2: FactionId[];
    3: FactionId[];
    4: FactionId[];
  } = { 2: [], 3: [], 4: [] };
  Object.values(filteredStrategyCards).forEach((card) => {
    const factionId = card.faction;
    if (!factionId) {
      return;
    }
    let number: 2 | 3 | 4 = 2;
    if (factionId === "Federation of Sol") {
      if (factionsWithHyper.has(factionId) && hyperState !== "purged") {
        number = 4;
      } else {
        number = 3;
      }
    } else if (factionsWithHyper.has(factionId) && hyperState !== "purged") {
      number = 3;
    }
    numberOfCommandTokens[number].push(factionId);
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
          paddingTop: rem(2),
        }}
      >
        {objectEntries(numberOfCommandTokens).map(([number, localFactions]) => {
          if (localFactions.length === 0) {
            return null;
          }
          return (
            <div
              key={number}
              className="flexColumn"
              style={{ alignItems: "flex-start" }}
            >
              <LabeledDiv label={`${number}`}>
                <div
                  className="flexRow"
                  style={{
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {localFactions.map((factionId) => {
                    return (
                      <div
                        key={factionId}
                        className="flexRow"
                        style={{
                          position: "relative",
                          width: rem(32),
                          height: rem(32),
                          userSelect: "none",
                        }}
                      >
                        <FactionIcon factionId={factionId} size="100%" />
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

function ActionCardDraws() {
  const factionsWithNeural = useFactionsWithTech("Neural Motivator");
  const neuralState = useTechState("Neural Motivator");
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
    1: FactionId[];
    2: FactionId[];
    3: FactionId[];
  } = { 1: [], 2: [], 3: [] };
  Object.values(filteredStrategyCards).forEach((card) => {
    const factionId = card.faction;
    if (!factionId) {
      return;
    }
    let number: 1 | 2 | 3 = 1;
    if (factionsWithNeural.has(factionId) && neuralState !== "purged") {
      number = 2;
    }
    if (factionId === "Yssaril Tribes") {
      number = 3;
    }
    numberOfActionCards[number].push(factionId);
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
          paddingTop: rem(2),
        }}
      >
        {objectEntries(numberOfActionCards).map(([number, localFactions]) => {
          if (localFactions.length === 0) {
            return null;
          }
          let displayNum = number;
          if (
            number === 3 &&
            localFactions.includes("Yssaril Tribes") &&
            (!factionsWithNeural.has("Yssaril Tribes") ||
              neuralState === "purged")
          ) {
            displayNum = 2;
          }
          return (
            <div
              key={number}
              className="flexColumn"
              style={{
                alignItems: "flex-start",
              }}
            >
              <LabeledDiv
                label={`${displayNum}${number === 3 ? " (Discard 1)" : ""}`}
              >
                <div
                  className="flexRow"
                  style={{ justifyContent: "flex-start" }}
                >
                  {localFactions.map((factionId) => {
                    return (
                      <div
                        key={factionId}
                        className="flexRow"
                        style={{
                          position: "relative",
                          width: rem(32),
                          height: rem(32),
                          userSelect: "none",
                        }}
                      >
                        <FactionIcon factionId={factionId} size="100%" />
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

function MiddleColumn() {
  const actionLog = useActionLog();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

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

  if (!objectives) {
    return null;
  }
  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);
  const revealedObjective = revealedObjectives[0];

  const hideObjectives = options.hide?.includes("OBJECTIVES");

  let innerContent = (
    <div className="flexColumn" style={{ width: "100%" }}>
      {!revealedObjective && !hideObjectives ? (
        <LabeledDiv
          label={
            <FormattedMessage
              id="WHJC8f"
              description="Text telling the players to score objectives."
              defaultMessage="Score Objectives"
            />
          }
        >
          <div className={styles.ScoreObjectivesSection}>
            {filteredStrategyCards.map((card) => {
              const factionId = card.faction;
              if (!factionId) {
                return null;
              }
              const canScoreObjectives = Object.values(planets ?? {}).reduce(
                (canScore, planet) => {
                  if (factionId === "Clan of Saar") {
                    return true;
                  }
                  if (
                    planet.home &&
                    planet.faction === factionId &&
                    planet.owner !== factionId &&
                    !planet.attributes.includes("space-station")
                  ) {
                    return false;
                  }
                  return canScore;
                },
                true
              );
              const scoredObjectives = getLogEntries<ScoreObjectiveData>(
                currentTurn,
                "SCORE_OBJECTIVE"
              )
                .filter(
                  (logEntry) => logEntry.data.event.faction === card.faction
                )
                .map((logEntry) => logEntry.data.event.objective);
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
                  return (
                    objective.selected &&
                    (!objective.phase || objective.phase === "STATUS") &&
                    (objective.type === "STAGE ONE" ||
                      objective.type === "STAGE TWO") &&
                    (!(objective.scorers ?? []).includes(factionId) ||
                      scoredPublics.includes(objective.id))
                  );
                }
              );
              const secrets = Object.values(objectives).filter((objective) => {
                return (
                  objective.type === "SECRET" &&
                  ((objective.scorers ?? []).length === 0 ||
                    scoredSecrets.includes(objective.id)) &&
                  objective.phase === "STATUS"
                );
              });
              return (
                <div
                  key={card.id}
                  className={styles.ObjectiveSection}
                  style={{ width: "100%", position: "relative" }}
                >
                  <div style={{ gridColumn: "1 / 4", width: "100%" }}>
                    <LabeledLine
                      label={<FactionComponents.Name factionId={factionId} />}
                      color={getColorForFaction(factionId)}
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
                              if (add) {
                                scoreObjectiveAsync(
                                  gameId,
                                  factionId,
                                  objectiveId
                                );
                              } else {
                                unscoreObjectiveAsync(
                                  gameId,
                                  factionId,
                                  objectiveId
                                );
                              }
                            }}
                          />
                        ) : (
                          <ObjectiveSelectHoverMenu
                            action={(_, objectiveId) => {
                              scoreObjectiveAsync(
                                gameId,
                                factionId,
                                objectiveId
                              );
                            }}
                            label={
                              <FormattedMessage
                                id="6EVvXu"
                                description="Label for selecting a public objective."
                                defaultMessage="Public"
                              />
                            }
                            objectives={availableObjectives}
                            fontSize={rem(14)}
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
                        top: rem(2),
                        width: rem(40),
                        height: rem(40),
                        userSelect: "none",
                      }}
                    >
                      <FactionIcon factionId={factionId} size="100%" />
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
                          style={{ maxWidth: `calc(88vw - ${rem(50)})` }}
                          itemsPerColumn={10}
                          toggleItem={(objectiveId, add) => {
                            if (add) {
                              scoreObjectiveAsync(
                                gameId,
                                factionId,
                                objectiveId
                              );
                            } else {
                              unscoreObjectiveAsync(
                                gameId,
                                factionId,
                                objectiveId
                              );
                            }
                          }}
                        />
                      ) : (
                        <ObjectiveSelectHoverMenu
                          action={(_, objectiveId) => {
                            scoreObjectiveAsync(gameId, factionId, objectiveId);
                          }}
                          label={
                            <FormattedMessage
                              id="ggO0Am"
                              description="Label for selecting a secret objective."
                              defaultMessage="Secret"
                            />
                          }
                          objectives={secrets}
                          fontSize={rem(14)}
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
      <div className="flexColumn" style={{ width: "100%" }}>
        {innerContent}
      </div>
    </React.Fragment>
  );
}

export function statusPhaseComplete(currentTurn: ActionLog) {
  const revealedObjectives = currentTurn.filter(
    (logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE"
  );
  return revealedObjectives.length === 1;
}

export default function StatusPhase() {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const strategyCards = useStrategyCards();

  const factionsWithBioplasmosis = useFactionsWithTech("Bioplasmosis");
  const factionsWithWormholeGenerator =
    useFactionsWithTech("Wormhole Generator");
  const factionsWithHydrothermalMining = useFactionsWithTech(
    "Hydrothermal Mining"
  );

  const agendaUnlocked = useAgendaUnlocked();
  const initiativeOrderedFactionIds =
    useCompleteOrderedFactionIds("INITIATIVE");
  const round = useRound();
  const speaker = useSpeaker();
  const tyrant = useTyrant();
  const viewOnly = useViewOnly();

  const ministerOfPolicy = useAgenda("Minister of Policy");

  const intl = useIntl();

  const hideTechs = options.hide?.includes("TECHS");

  const { openModal } = use(ModalContext);

  function nextPhase(skipAgenda = false) {
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
    if (
      options.expansions.includes("THUNDERS EDGE") &&
      !options.hide?.includes("TECHS")
    ) {
      return true;
    }
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
    let abilities: Partial<Record<FactionId, Ability[]>> = {};
    for (const factionId of initiativeOrderedFactionIds) {
      const factionAbilities: Ability[] = [];
      if (factionId === "Arborec") {
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
        !options.expansions.includes("CODEX ONE") &&
        !options.expansions.includes("THUNDERS EDGE") &&
        factionsWithWormholeGenerator.has(factionId)
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
      if (factionsWithHydrothermalMining.has(factionId)) {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Deepwrought Scholarate.Techs.Hydrothermal Mining.Title",
            description: "Title of Tech: Hydrothermal Mining",
            defaultMessage: "Hydrothermal Mining",
          }),
          description: intl.formatMessage({
            id: "Deepwrought Scholarate.Techs.Hydrothermal Mining.Description",
            description: "Description for Tech: Hydrothermal Mining",
            defaultMessage:
              "At the start of the status phase, gain 1 trade good for each ocean card in play.",
          }),
        });
      }
      if (factionAbilities.length > 0) {
        abilities[factionId] = factionAbilities;
      }
    }
    return abilities;
  }

  const crownOfEmphidia = relics["The Crown of Emphidia"];

  const wasCrownPlayedThisTurn = getPlayedRelic(
    currentTurn,
    "The Crown of Emphidia"
  );
  const isCrownPurged = crownOfEmphidia?.state === "purged";
  const crownOwner = crownOfEmphidia?.owner;

  function hasEndOfStatusPhaseAbilities() {
    let canScoreCrown = false;
    for (const planet of Object.values(planets)) {
      if (
        planet.owner === crownOwner &&
        planet.attachments?.includes("Tomb of Emphidia")
      ) {
        canScoreCrown = true;
        break;
      }
    }
    if (canScoreCrown && (wasCrownPlayedThisTurn || !isCrownPurged)) {
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
    for (const factionId of initiativeOrderedFactionIds) {
      const factionAbilities: Ability[] = [];
      if (factionId === "Federation of Sol") {
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
      if (factionsWithBioplasmosis.has(factionId)) {
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
        ministerOfPolicy.target == factionId
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
        abilities[factionId] = factionAbilities;
      }
    }
    return abilities;
  }

  const revealedObjectives = currentTurn
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);
  const revealedObjective = revealedObjectives[0];
  const revealedObjectiveObj = revealedObjective
    ? objectives[revealedObjective]
    : undefined;
  const type = round < 4 ? "STAGE ONE" : "STAGE TWO";
  const availableObjectives = Object.values(objectives).filter((objective) => {
    return objective.type === type && !objective.selected;
  });

  const nextPhaseButtons = [];
  if (options.expansions.includes("TWILIGHTS FALL")) {
    if (!tyrant) {
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
        { phase: phaseString("EDICT", intl) }
      ),
      onClick: () => nextPhase(false),
    });
  } else {
    if (!agendaUnlocked) {
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
  }

  return (
    <>
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
              <div
                className="flexRow"
                style={{ padding: rem(8), alignItems: "flex-start" }}
              >
                <div className="flexColumn">
                  {objectEntries(getStartOfStatusPhaseAbilities())
                    .sort((a, b) => {
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
                      return (
                        <LabeledDiv
                          key={factionId}
                          label={
                            <FactionComponents.Name factionId={factionId} />
                          }
                          color={getColorForFaction(factionId)}
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
                                      openModal(
                                        <ModalContent title={ability.name}>
                                          <div
                                            className="myriadPro"
                                            style={{
                                              width: "100%",
                                              padding: rem(4),
                                              whiteSpace: "pre-line",
                                              textAlign: "center",
                                              fontSize: rem(32),
                                            }}
                                          >
                                            <FormattedDescription
                                              description={ability.description}
                                            />
                                          </div>
                                        </ModalContent>
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
                {options.expansions.includes("THUNDERS EDGE") ? (
                  <Conditional appSection="TECHS">
                    <LabeledDiv
                      label={
                        <FormattedMessage
                          id="hl6LkY"
                          defaultMessage="Entropic Scar"
                          description="Name of an amomaly that grants techs."
                        />
                      }
                    >
                      {initiativeOrderedFactionIds.map((factionId) => {
                        return (
                          <EntropicScarResearch
                            key={factionId}
                            factionId={factionId}
                          />
                        );
                      })}
                    </LabeledDiv>
                  </Conditional>
                ) : null}
                <Conditional appSection="TECHS">
                  <RadicalAdvancement />
                </Conditional>
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
            <Conditional
              appSection="OBJECTIVES"
              fallback={
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
            >
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
                    removeObjective={() =>
                      hideObjectiveAsync(gameId, revealedObjectiveObj.id)
                    }
                    viewing={true}
                  />
                </LabeledDiv>
              ) : (
                <LabeledDiv
                  label={<FactionComponents.Name factionId={speaker} />}
                  color={getColorForFaction(speaker)}
                  style={{ width: "100%" }}
                >
                  <div className="flexRow" style={{ whiteSpace: "nowrap" }}>
                    <ObjectiveSelectHoverMenu
                      action={(_, objectiveId) =>
                        revealObjectiveAsync(gameId, objectiveId)
                      }
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
            </Conditional>
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
              <div className="flexColumn" style={{ padding: rem(8) }}>
                {objectEntries(getEndOfStatusPhaseAbilities())
                  .sort((a, b) => {
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
                    return (
                      <LabeledDiv
                        key={factionId}
                        label={<FactionComponents.Name factionId={factionId} />}
                        color={getColorForFaction(factionId)}
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
                                    openModal(
                                      <ModalContent title={ability.name}>
                                        <FormattedDescription
                                          description={ability.description}
                                        />
                                      </ModalContent>
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
            viewOnly={viewOnly}
          />
        </div>
      </ol>
      <div className={styles.MainColumn}>
        <MiddleColumn />
        <LockedButtons
          unlocked={statusPhaseComplete(currentTurn)}
          buttons={nextPhaseButtons}
          viewOnly={viewOnly}
        />
      </div>
    </>
  );
}

function EntropicScarResearch({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const factionColor = useFactionColor(factionId);
  const factionTechs = useFactionTechs(factionId);
  const intl = useIntl();
  const techs = useTechs();

  if (factionId === "Nekro Virus") {
    return null;
  }
  const numFactionTechs = Array.from(factionTechs).reduce((count, techId) => {
    const tech = techs[techId];
    if (!tech) {
      return count;
    }
    if (!!tech.faction) {
      return count + 1;
    }
    return count;
  }, 0);
  const researchedTechs = getResearchedTechs(currentTurn, factionId);
  const hasResearchedFactionTech = researchedTechs.reduce((result, techId) => {
    const techObj = techs[techId];
    if (!techObj) {
      return result;
    }
    return result || !!techObj.faction;
  }, false);
  if (numFactionTechs === 2 && !hasResearchedFactionTech) {
    return null;
  }
  return (
    <IconDiv
      key={factionId}
      color={factionColor}
      icon={<FactionIcon factionId={factionId} size={24} />}
      iconSize={24}
    >
      <TechResearchSection
        label={intl.formatMessage({
          id: "P/Y6Fo",
          description: "Message shown when a faction can gain a faction tech.",
          defaultMessage: "Gain Faction Tech",
        })}
        filter={(tech) => !!tech.faction}
        factionId={factionId}
        gain
      />
    </IconDiv>
  );
}

function RadicalAdvancement() {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const techs = useTechs();

  const factionsWithRadicalAdvancement = useFactionsWithTech(
    "Radical Advancement"
  );
  const localFactions = new Set(factionsWithRadicalAdvancement);
  const radicalAdvancement = useTech("Radical Advancement");

  const deepwroughtTechs = getReplacedTechs(
    currentTurn,
    "Deepwrought Scholarate"
  );
  const nekroTechs = getReplacedTechs(currentTurn, "Nekro Virus");

  if (deepwroughtTechs.includes("Radical Advancement")) {
    localFactions.add("Deepwrought Scholarate");
  }
  if (nekroTechs.includes("Radical Advancement")) {
    localFactions.add("Nekro Virus");
  }

  if (
    localFactions.size === 0 ||
    !radicalAdvancement ||
    radicalAdvancement.state === "purged"
  ) {
    return null;
  }

  return (
    <div className="flexColumn">
      {Array.from(localFactions).map((factionId) => {
        const faction = factions[factionId];
        if (!faction) {
          return null;
        }
        const returnedTech = getReplacedTechs(currentTurn, factionId)[0];
        const returnedTechObj = returnedTech ? techs[returnedTech] : null;
        const canReturnTechs = objectKeys(faction.techs)
          .filter((techId) => {
            const techObj = techs[techId];
            if (!techObj) {
              return false;
            }
            if (!hasTech(faction, techObj)) {
              return false;
            }
            return techObj.type !== "UPGRADE";
          })
          .map((techId) => techs[techId])
          .filter((tech) => !!tech);
        const researchedTech = getResearchedTechs(currentTurn, factionId);
        return (
          <LabeledDiv
            key={factionId}
            label={<FactionName factionId={factionId} />}
            color={getColorForFaction(factionId)}
          >
            <div
              className="flexColumn"
              style={{ width: "100%", fontSize: rem(14) }}
            >
              {returnedTech && returnedTechObj ? (
                <>
                  <LabeledDiv
                    label={
                      <FormattedMessage
                        id="sngfoO"
                        description="Label for a section listing returned techs."
                        defaultMessage="Returned {count, plural, one {Tech} other {Techs}}"
                        values={{ count: 1 }}
                      />
                    }
                  >
                    <TechRow
                      techId={returnedTech}
                      removeTech={() => {
                        researchedTech.forEach((techId) => {
                          removeTechAsync(gameId, factionId, techId);
                        });
                        addTechAsync(gameId, factionId, returnedTech);
                      }}
                    />
                  </LabeledDiv>
                  <TechResearchSection
                    factionId={factionId}
                    label={radicalAdvancement.name}
                    gain
                    filter={(tech) =>
                      tech.type === returnedTechObj.type &&
                      tech.prereqs.length - 1 === returnedTechObj.prereqs.length
                    }
                  />
                </>
              ) : (
                <TechSelectHoverMenu
                  factionId={factionId}
                  techs={canReturnTechs}
                  label={radicalAdvancement.name}
                  selectTech={(tech) =>
                    removeTechAsync(gameId, factionId, tech.id)
                  }
                />
              )}
            </div>
          </LabeledDiv>
        );
      })}
    </div>
  );
}
