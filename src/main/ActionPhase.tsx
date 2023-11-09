import { useRouter } from "next/router";
import React, { CSSProperties, useContext } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { FullScreenLoader } from "../Loader";
import { LockedButtons } from "../LockedButton";
import { SmallStrategyCard } from "../StrategyCard";
import { TechRow } from "../TechRow";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import FactionCard from "../components/FactionCard/FactionCard";
import FactionCircle from "../components/FactionCircle/FactionCircle";
import FactionIcon from "../components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../components/LabeledLine/LabeledLine";
import PlanetRow from "../components/PlanetRow/PlanetRow";
import { TacticalAction } from "../components/TacticalAction";
import TechSelectHoverMenu from "../components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  ActionLogContext,
  AttachmentContext,
  FactionContext,
  ObjectiveContext,
  PlanetContext,
  StateContext,
  StrategyCardContext,
  TechContext,
} from "../context/Context";
import {
  addTechAsync,
  advancePhaseAsync,
  claimPlanetAsync,
  endTurnAsync,
  markSecondaryAsync,
  removeTechAsync,
  scoreObjectiveAsync,
  selectActionAsync,
  setSpeakerAsync,
  unclaimPlanetAsync,
  unscoreObjectiveAsync,
  unselectActionAsync,
} from "../dynamic/api";
import { SymbolX } from "../icons/svgs";
import { getResearchedTechs } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import {
  getNewSpeakerEventFromLog,
  getSelectedActionFromLog,
} from "../util/api/data";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getOnDeckFaction, getStrategyCardsForFaction } from "../util/helpers";
import { applyPlanetAttachments } from "../util/planets";
import { responsivePixels } from "../util/util";
import { ComponentAction } from "./util/ComponentAction";
import ObjectiveRow from "../components/ObjectiveRow/ObjectiveRow";
import styles from "./ActionPhase.module.scss";

interface FactionActionButtonsProps {
  factionId: FactionId;
  buttonStyle?: CSSProperties;
}

function SecondaryCheck({
  activeFactionId,
  gameid,
  orderedFactions,
}: {
  activeFactionId: FactionId;
  gameid: string;
  orderedFactions: Faction[];
}) {
  let allCompleted = true;
  return (
    <div className="flexColumn hugeFont">
      <div
        className="flexRow"
        style={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {orderedFactions.map((faction) => {
          if (faction.id === activeFactionId) {
            return null;
          }
          const secondaryState = faction.secondary ?? "PENDING";
          const color = getFactionColor(faction);
          if (secondaryState === "PENDING") {
            allCompleted = false;
          }
          return (
            <FactionCircle
              key={faction.id}
              blur
              borderColor={color}
              fade={secondaryState !== "PENDING"}
              factionId={faction.id}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                let nextState: Secondary = "DONE";
                switch (secondaryState) {
                  case "DONE":
                    nextState = "SKIPPED";
                    break;
                  case "PENDING":
                    nextState = "DONE";
                    break;
                  case "SKIPPED":
                    nextState = "PENDING";
                    break;
                }
                markSecondaryAsync(gameid, faction.id, nextState);
              }}
              size={52}
              tag={
                secondaryState === "PENDING" ? undefined : (
                  <div
                    className="flexRow largeFont"
                    style={{
                      width: "80%",
                      height: "80%",
                      color: secondaryState === "DONE" ? "green" : "red",
                      // fontWeight: "bold",
                    }}
                  >
                    {secondaryState === "DONE" ? (
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
                      <SymbolX color="red" />
                    )}
                  </div>
                )
              }
              tagBorderColor={secondaryState === "DONE" ? "green" : "red"}
            />
          );
        })}
      </div>
      {allCompleted ? "Secondaries completed" : null}
    </div>
  );
}

export function FactionActionButtons({
  factionId,
  buttonStyle,
}: FactionActionButtonsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const strategyCards = useContext(StrategyCardContext);

  if (!factions) {
    return null;
  }

  function canFactionPass(factionId: FactionId) {
    for (const card of getStrategyCardsForFaction(strategyCards, factionId)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  const selectedAction = getSelectedActionFromLog(actionLog);

  function toggleAction(action: Action) {
    if (!gameid) {
      return;
    }
    if (selectedAction === action) {
      unselectActionAsync(gameid, action);
    } else {
      selectActionAsync(gameid, action);
    }
  }

  const activeFaction = factions[factionId];
  if (!activeFaction) {
    return null;
  }

  return (
    <div
      className="flexRow"
      style={{
        padding: "0px 8px",
        boxSizing: "border-box",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {getStrategyCardsForFaction(strategyCards, activeFaction.id).map(
        (card) => {
          if (card.used) {
            return null;
          }
          return (
            <button
              key={card.id}
              className={selectedAction === card.id ? "selected" : ""}
              style={buttonStyle}
              onClick={() => toggleAction(card.id)}
            >
              {card.name}
            </button>
          );
        }
      )}
      <button
        className={selectedAction === "Tactical" ? "selected" : ""}
        style={buttonStyle}
        onClick={() => toggleAction("Tactical")}
      >
        Tactical
      </button>
      <button
        className={selectedAction === "Component" ? "selected" : ""}
        style={buttonStyle}
        onClick={() => toggleAction("Component")}
      >
        Component
      </button>
      {canFactionPass(activeFaction.id) ? (
        <button
          className={selectedAction === "Pass" ? "selected" : ""}
          style={buttonStyle}
          disabled={!canFactionPass(activeFaction.id)}
          onClick={() => toggleAction("Pass")}
        >
          Pass
        </button>
      ) : null}
    </div>
  );
}

export function FactionActions({ factionId }: { factionId: FactionId }) {
  return (
    <div className="flexColumn" style={{ gap: responsivePixels(4) }}>
      <div style={{ fontSize: responsivePixels(20) }}>Select Action</div>
      <FactionActionButtons
        factionId={factionId}
        buttonStyle={{ fontSize: responsivePixels(18) }}
      />
    </div>
  );
}

interface AdditionalActionsProps {
  factionId: FactionId;
  style?: CSSProperties;
  ClientOnlyHoverMenuStyle?: CSSProperties;
  primaryOnly?: boolean;
  secondaryOnly?: boolean;
}

export function AdditionalActions({
  factionId,
  style = {},
  primaryOnly = false,
  secondaryOnly = false,
}: AdditionalActionsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const techs = useContext(TechContext);

  if (!factions || !techs) {
    return null;
  }

  const activeFaction = factions[factionId];

  if (!activeFaction) {
    return null;
  }

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  function getResearchableTechs(faction: Faction) {
    const researchedTechs = getResearchedTechs(currentTurn, faction.id);
    if (faction.id === "Nekro Virus") {
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((id) => {
          const techId = id as TechId;
          if (!hasTech(faction, techId) && !researchedTechs.includes(techId)) {
            nekroTechs.add(techId);
          }
        });
      });
      return Array.from(nekroTechs).map(
        (techId) => (techs ?? {})[techId] as Tech
      );
    }
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.id)) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      if (researchedTechs.includes(tech.id)) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }

  const researchableTechs = getResearchableTechs(activeFaction);

  function removePlanet(factionId: FactionId, toRemove: PlanetId) {
    if (!gameid) {
      return;
    }
    unclaimPlanetAsync(gameid, factionId, toRemove);
  }

  function addPlanet(factionId: FactionId, toAdd: Planet) {
    if (!gameid) {
      return;
    }
    claimPlanetAsync(gameid, factionId, toAdd.id);
  }

  function addObjective(factionId: FactionId, toScore: ObjectiveId) {
    if (!gameid) {
      return;
    }
    scoreObjectiveAsync(gameid, factionId, toScore);
  }

  function undoObjective(factionId: FactionId, toRemove: ObjectiveId) {
    if (!gameid) {
      return;
    }
    unscoreObjectiveAsync(gameid, factionId, toRemove);
  }

  function removeTechLocal(factionId: FactionId, toRemove: TechId) {
    if (!gameid) {
      return;
    }
    removeTechAsync(gameid, factionId, toRemove);
  }

  function researchTech(factionId: FactionId, tech: Tech) {
    if (!gameid) {
      return;
    }
    addTechAsync(gameid, factionId, tech.id);
  }

  async function selectSpeaker(factionId: FactionId) {
    if (!gameid) {
      return;
    }
    setSpeakerAsync(gameid, factionId);
  }

  const newSpeakerEvent = getNewSpeakerEventFromLog(actionLog);

  async function resetSpeaker() {
    if (!gameid || !newSpeakerEvent?.prevSpeaker) {
      return;
    }
    setSpeakerAsync(gameid, newSpeakerEvent.prevSpeaker);
  }

  function lastFaction() {
    const numFactions = Object.keys(factions ?? {}).length;
    const numPassed = Object.values(factions ?? {}).filter(
      (faction) => faction.passed
    ).length;
    return numFactions - 1 === numPassed;
  }

  const claimedPlanets = currentTurn
    .filter(
      (logEntry) =>
        logEntry.data.action === "CLAIM_PLANET" &&
        logEntry.data.event.faction === activeFaction.id
    )
    .map((logEntry) => {
      return (logEntry.data as ClaimPlanetData).event.planet;
    });
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if (!planets) {
      return false;
    }
    if (planet.owner === activeFaction.id) {
      return false;
    }
    if (planet.locked) {
      return false;
    }
    for (const claimedPlanet of claimedPlanets) {
      if (claimedPlanet === planet.id) {
        return false;
      }
    }
    if (claimedPlanets.length > 0) {
      const claimedPlanet = claimedPlanets[0]
        ? planets[claimedPlanets[0]]
        : null;
      if (claimedPlanet?.faction) {
        return planet.faction === claimedPlanet.faction;
      }
      if (claimedPlanet?.system) {
        return planet.system === claimedPlanet.system;
      }
      return false;
    }
    return true;
  });
  const scoredObjectives = currentTurn
    .filter(
      (logEntry) =>
        logEntry.data.action === "SCORE_OBJECTIVE" &&
        logEntry.data.event.faction === activeFaction.id
    )
    .map((logEntry) => (logEntry.data as ScoreObjectiveData).event.objective);
  const scorableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      const scorers = objective.scorers ?? [];
      if (scorers.includes(activeFaction.id)) {
        return false;
      }
      if (scoredObjectives.includes(objective.id)) {
        return false;
      }
      if (
        objective.id === "Become a Martyr" ||
        objective.id === "Prove Endurance"
      ) {
        return false;
      }
      if (objective.type === "SECRET" && scorers.length > 0) {
        return false;
      }
      return objective.phase === "ACTION";
    }
  );

  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(12, claimablePlanets.length)}, auto)`,
    gap: responsivePixels(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  const orderedFactions = Object.values(factions).sort((a, b) => {
    if (a.order === activeFaction.order) {
      return -1;
    }
    if (b.order === activeFaction.order) {
      return 1;
    }
    if (a.order < activeFaction.order) {
      if (b.order < activeFaction.order) {
        return a.order - b.order;
      }
      return 1;
    }
    if (b.order > activeFaction.order) {
      return a.order - b.order;
    }
    return -1;
  });

  const selectedAction = getSelectedActionFromLog(actionLog);

  switch (selectedAction) {
    case "Technology":
      const researchedTech = getResearchedTechs(currentTurn, factionId);
      if (!!primaryOnly || !!secondaryOnly) {
        const isActive = state?.activeplayer === factionId;
        const numTechs =
          isActive || factionId === "Universities of Jol-Nar" ? 2 : 1;
        return activeFaction.id !== "Nekro Virus" ? (
          <div className="flexColumn largeFont" style={{ width: "100%" }}>
            <LabeledLine
              leftLabel={
                isActive ? "Technology Primary" : "Technology Secondary"
              }
            />
            <React.Fragment>
              {researchedTech.length > 0 ? (
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {researchedTech.map((tech) => {
                    const techObj = techs[tech];
                    if (!techObj) {
                      return null;
                    }
                    return (
                      <TechRow
                        key={tech}
                        tech={techObj}
                        removeTech={() => {
                          // if (gameid && !isActive) {
                          //   markSecondary(
                          //     gameid,
                          //     activeFaction.id,
                          //     "PENDING"
                          //   );
                          // }
                          removeTechLocal(activeFaction.id, tech);
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}
              {researchedTech.length < numTechs ? (
                <TechSelectHoverMenu
                  factionId={activeFaction.id}
                  techs={researchableTechs}
                  selectTech={(tech) => {
                    // if (
                    //   gameid &&
                    //   !isActive &&
                    //   researchedTech.length + 1 === numTechs
                    // ) {
                    //   markSecondary(gameid, activeFaction.id, "DONE");
                    // }
                    researchTech(activeFaction.id, tech);
                  }}
                />
              ) : null}
              {isActive ? (
                <React.Fragment>
                  <LabeledLine leftLabel="Secondary" />
                  <SecondaryCheck
                    activeFactionId={activeFaction.id}
                    gameid={gameid ?? ""}
                    orderedFactions={orderedFactions}
                  />
                </React.Fragment>
              ) : null}
            </React.Fragment>
          </div>
        ) : null;
      }
      return (
        <div
          className="flexColumn largeFont"
          style={{ ...style, gap: responsivePixels(4) }}
        >
          {activeFaction.id !== "Nekro Virus" ? (
            <div
              className="flexColumn"
              style={{ gap: responsivePixels(4), width: "100%" }}
            >
              <LabeledLine leftLabel="Primary" />

              <div style={{ width: "fit-content" }}>
                <LabeledDiv
                  label={getFactionName(activeFaction)}
                  color={getFactionColor(activeFaction)}
                >
                  {researchedTech.length > 0 ? (
                    <div
                      className="flexColumn"
                      style={{ alignItems: "stretch" }}
                    >
                      {researchedTech.map((tech) => {
                        const techObj = techs[tech];
                        if (!techObj) {
                          return null;
                        }
                        return (
                          <TechRow
                            key={tech}
                            tech={techObj}
                            removeTech={() =>
                              removeTechLocal(activeFaction.id, tech)
                            }
                          />
                        );
                      })}
                    </div>
                  ) : null}
                  {researchedTech.length < 2 ? (
                    <TechSelectHoverMenu
                      factionId={activeFaction.id}
                      techs={researchableTechs}
                      selectTech={(tech) =>
                        researchTech(activeFaction.id, tech)
                      }
                    />
                  ) : null}
                </LabeledDiv>
              </div>
            </div>
          ) : null}
          <div
            className="flexColumn"
            style={{ gap: responsivePixels(4), width: "100%" }}
          >
            <LabeledLine leftLabel="Secondary" />
            <div
              className="flexRow mediumFont"
              style={{
                paddingTop: responsivePixels(4),
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {orderedFactions.map((faction) => {
                if (
                  faction.id === activeFaction.id ||
                  faction.id === "Nekro Virus"
                ) {
                  return null;
                }
                let maxTechs = 1;
                if (faction.id === "Universities of Jol-Nar") {
                  maxTechs = 2;
                  // TODO: Add ability for people to copy them.
                }
                const researchedTechs = getResearchedTechs(
                  currentTurn,
                  faction.id
                );
                const availableTechs = getResearchableTechs(faction);
                const secondaryState =
                  factions[faction.id]?.secondary ?? "PENDING";
                if (
                  researchedTechs.length === 0 &&
                  secondaryState === "SKIPPED"
                ) {
                  return null;
                }
                return (
                  <LabeledDiv
                    key={faction.id}
                    label={getFactionName(faction)}
                    color={getFactionColor(faction)}
                    style={{ width: "48%" }}
                    opts={{ fixedWidth: true }}
                  >
                    <React.Fragment>
                      {researchedTechs.map((tech) => {
                        const techObj = techs[tech];
                        if (!techObj) {
                          return null;
                        }
                        return (
                          <TechRow
                            key={tech}
                            tech={techObj}
                            removeTech={() => {
                              // if (gameid) {
                              //   markSecondary(gameid, faction.id, "PENDING");
                              // }
                              removeTechLocal(faction.id, tech);
                            }}
                            opts={{ hideSymbols: true }}
                          />
                        );
                      })}
                      {researchedTechs.length < maxTechs ? (
                        <TechSelectHoverMenu
                          factionId={faction.id}
                          techs={availableTechs}
                          selectTech={(tech) => {
                            // if (
                            //   gameid &&
                            //   researchedTechs.length + 1 === maxTechs
                            // ) {
                            //   markSecondary(gameid, faction.id, "DONE");
                            // }
                            researchTech(faction.id, tech);
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  </LabeledDiv>
                );
              })}
              <SecondaryCheck
                activeFactionId={activeFaction.id}
                gameid={gameid ?? ""}
                orderedFactions={orderedFactions}
              />
            </div>
          </div>
        </div>
      );
    case "Politics":
      const selectedSpeaker = newSpeakerEvent?.newSpeaker
        ? factions[newSpeakerEvent.newSpeaker]
        : undefined;
      const mapOrderedFactions = [...orderedFactions].sort(
        (a, b) => a.mapPosition - b.mapPosition
      );
      return (
        <div
          className="flexColumn"
          style={{ gap: "4px", width: "100%", ...style }}
        >
          <React.Fragment>
            <LabeledLine leftLabel="Primary" />
            <div
              className="flexRow largeFont"
              style={{
                justifyContent: "flex-start",
                paddingLeft: responsivePixels(24),
                width: "100%",
              }}
            >
              New Speaker:
              <FactionSelectRadialMenu
                borderColor={
                  selectedSpeaker ? getFactionColor(selectedSpeaker) : undefined
                }
                onSelect={(factionId, _) => {
                  if (factionId) {
                    selectSpeaker(factionId);
                  } else {
                    resetSpeaker();
                  }
                }}
                factions={mapOrderedFactions.map((faction) => faction.id)}
                invalidFactions={[
                  selectedSpeaker
                    ? (newSpeakerEvent?.prevSpeaker as FactionId)
                    : state.speaker,
                ]}
                selectedFaction={selectedSpeaker?.id}
                size={52}
              />
            </div>
          </React.Fragment>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Diplomacy":
      if (activeFaction.id === "Xxcha Kingdom") {
        const peaceAccordsPlanets = claimablePlanets.filter(
          (planet) => planet.id !== "Mecatol Rex"
        );
        return (
          <div className="flexColumn largeFont" style={{ ...style }}>
            <LabeledLine leftLabel="Primary" />
            <LabeledDiv label="Peace Accords">
              <React.Fragment>
                {claimedPlanets.length > 0 ? (
                  <div className="flexColumn" style={{ alignItems: "stretch" }}>
                    {claimedPlanets.map((planet) => {
                      const planetObj = planets[planet];
                      if (!planetObj) {
                        return null;
                      }
                      const adjustedPlanet = applyPlanetAttachments(
                        planetObj,
                        attachments ?? {}
                      );
                      return (
                        <PlanetRow
                          key={planet}
                          factionId={activeFaction.id}
                          planet={adjustedPlanet}
                          removePlanet={() =>
                            removePlanet(activeFaction.id, planet)
                          }
                        />
                      );
                    })}
                  </div>
                ) : null}
                {peaceAccordsPlanets.length > 0 &&
                claimedPlanets.length === 0 ? (
                  <ClientOnlyHoverMenu label="Claim Empty Planet">
                    <div className="flexRow" style={targetButtonStyle}>
                      {peaceAccordsPlanets.map((planet) => {
                        return (
                          <button
                            key={planet.id}
                            style={{
                              writingMode: "horizontal-tb",
                              width: responsivePixels(90),
                            }}
                            onClick={() => addPlanet(activeFaction.id, planet)}
                          >
                            {planet.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </React.Fragment>
            </LabeledDiv>
            <LabeledLine leftLabel="Secondary" />
            <SecondaryCheck
              activeFactionId={activeFaction.id}
              gameid={gameid ?? ""}
              orderedFactions={orderedFactions}
            />
          </div>
        );
      } else if (factions["Xxcha Kingdom"]) {
        const xxchaPlanets = currentTurn
          .filter(
            (logEntry) =>
              logEntry.data.action === "CLAIM_PLANET" &&
              logEntry.data.event.faction === "Xxcha Kingdom"
          )
          .map((logEntry) => {
            return (logEntry.data as ClaimPlanetData).event.planet;
          });
        const nonXxchaPlanets = Object.values(planets ?? {}).filter(
          (planet) => {
            if (planet.owner === "Xxcha Kingdom") {
              return false;
            }
            if (planet.locked) {
              return false;
            }
            for (const claimedPlanet of claimedPlanets) {
              if (claimedPlanet === planet.id) {
                return false;
              }
            }
            if (claimedPlanets.length > 0) {
              const claimedPlanet = claimedPlanets[0]
                ? planets[claimedPlanets[0]]
                : undefined;
              if (claimedPlanet?.system) {
                return planet.system === claimedPlanet.system;
              }
              if (claimedPlanet?.faction) {
                return planet.faction === claimedPlanet.faction;
              }
              return false;
            }
            return true;
          }
        );
        return (
          <div
            className="flexColumn largeFont"
            style={{ width: "100%", ...style }}
          >
            <LabeledLine leftLabel="Secondary" />
            <LabeledDiv
              label={`${getFactionName(
                factions["Xxcha Kingdom"]
              )} - Peace Accords`}
              color={getFactionColor(factions["Xxcha Kingdom"])}
            >
              <React.Fragment>
                {xxchaPlanets.length > 0 ? (
                  <div
                    className="flexColumn"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    {xxchaPlanets.map((planet) => {
                      const planetObj = planets[planet];
                      if (!planetObj) {
                        return null;
                      }
                      const adjustedPlanet = applyPlanetAttachments(
                        planetObj,
                        attachments ?? {}
                      );
                      return (
                        <PlanetRow
                          key={planet}
                          factionId={"Xxcha Kingdom"}
                          planet={adjustedPlanet}
                          removePlanet={() => {
                            // if (gameid) {
                            //   markSecondary(gameid, "Xxcha Kingdom", "PENDING");
                            // }
                            removePlanet("Xxcha Kingdom", planet);
                          }}
                        />
                      );
                    })}
                  </div>
                ) : null}
                {nonXxchaPlanets.length > 0 && xxchaPlanets.length === 0 ? (
                  <ClientOnlyHoverMenu label="Claim Empty Planet">
                    <div className="flexRow" style={targetButtonStyle}>
                      {nonXxchaPlanets.map((planet) => {
                        return (
                          <button
                            key={planet.id}
                            style={{
                              writingMode: "horizontal-tb",
                              width: responsivePixels(90),
                            }}
                            onClick={() => {
                              // if (gameid) {
                              //   markSecondary(gameid, "Xxcha Kingdom", "DONE");
                              // }
                              addPlanet("Xxcha Kingdom", planet);
                            }}
                          >
                            {planet.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </React.Fragment>
            </LabeledDiv>
            <SecondaryCheck
              activeFactionId={activeFaction.id}
              gameid={gameid ?? ""}
              orderedFactions={orderedFactions}
            />
          </div>
        );
      }
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Leadership":
    case "Construction":
    case "Trade":
    case "Warfare":
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    case "Imperial":
      let hasImperialPoint = false;
      const mecatol = planets["Mecatol Rex"];
      if (mecatol && mecatol.owner === activeFaction.id) {
        hasImperialPoint = true;
      }
      scoredObjectives.forEach((objective) => {
        if (objective === "Imperial Point") {
          hasImperialPoint = true;
        }
      });
      const availablePublicObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          if ((objective.scorers ?? []).includes(activeFaction.id)) {
            return false;
          }
          if (!objective.selected) {
            return false;
          }
          return (
            objective.type === "STAGE ONE" || objective.type === "STAGE TWO"
          );
        }
      );
      const scoredPublics = scoredObjectives.filter((objective) => {
        if (!objectives) {
          return false;
        }
        const objectiveObj = objectives[objective];
        if (!objectiveObj) {
          return false;
        }
        return (
          objectiveObj.type === "STAGE ONE" || objectiveObj.type === "STAGE TWO"
        );
      });

      const secretButtonStyle: CSSProperties = {
        fontFamily: "Myriad Pro",
        padding: responsivePixels(8),
        alignItems: "stretch",
        display: "grid",
        gridAutoFlow: "column",
        maxWidth: "85vw",
        justifyContent: "flex-start",
        overflowX: "auto",
        gridTemplateRows: `repeat(${Math.min(
          availablePublicObjectives.length,
          8
        )}, auto)`,
        gap: responsivePixels(4),
      };
      return (
        <div
          className="flexColumn largeFont"
          style={{ width: "100%", ...style }}
        >
          <LabeledLine leftLabel="Primary" />
          <div
            style={{
              backdropFilter: "blur(4px)",
              padding: `${responsivePixels(2)} 0`,
            }}
          >
            {hasImperialPoint
              ? "+1 VP for controlling Mecatol Rex"
              : "Draw 1 secret objective"}
          </div>
          <LabeledDiv label="Score Public Objective ?">
            <React.Fragment>
              {scoredPublics.length > 0 ? (
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {scoredPublics.map((objective) => {
                    if (!objectives) {
                      return null;
                    }
                    const objectiveObj = objectives[objective];
                    if (!objectiveObj) {
                      return null;
                    }
                    return (
                      <ObjectiveRow
                        key={objective}
                        objective={objectiveObj}
                        removeObjective={() =>
                          undoObjective(activeFaction.id, objective)
                        }
                        hideScorers={true}
                      />
                    );
                  })}
                </div>
              ) : null}
              {scoredPublics.length < 1 ? (
                availablePublicObjectives.length > 0 ? (
                  <ClientOnlyHoverMenu label="Score Public Objective">
                    <div
                      className="flexColumn"
                      style={{ ...secretButtonStyle }}
                    >
                      {availablePublicObjectives.map((objective) => {
                        return (
                          <button
                            key={objective.id}
                            onClick={() =>
                              addObjective(activeFaction.id, objective.id)
                            }
                          >
                            {objective.name}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : (
                  "No unscored public objectives"
                )
              ) : null}
            </React.Fragment>
          </LabeledDiv>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionId={activeFaction.id}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
          />
        </div>
      );
    // TODO: Display buttons for various actions.
    case "Component":
      return <ComponentAction factionId={activeFaction.id} />;
    case "Pass":
      let hasProveEndurance = false;
      scoredObjectives.forEach((objective) => {
        if (objective === "Prove Endurance") {
          hasProveEndurance = true;
        }
      });
      function canProveEndurance() {
        if (hasProveEndurance) {
          return true;
        }
        if (!lastFaction()) {
          return false;
        }
        const proveEndurance = (objectives ?? {})["Prove Endurance"];
        if (!proveEndurance) {
          return false;
        }
        const scorers = proveEndurance.scorers ?? [];
        if (scorers.includes(factionId)) {
          return false;
        }
        if (proveEndurance.type === "SECRET" && scorers.length !== 0) {
          return false;
        }
        return true;
      }
      if (!canProveEndurance()) {
        return null;
      }
      return (
        <div
          className="flexRow largeFont"
          style={{
            justifyContent: "center",
            paddingTop: responsivePixels(12),
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          Prove Endurance:
          <FactionCircle
            key={activeFaction.id}
            blur
            borderColor={getFactionColor(activeFaction)}
            factionId={activeFaction.id}
            onClick={() => {
              if (!gameid) {
                return;
              }
              if (hasProveEndurance) {
                undoObjective(activeFaction.id, "Prove Endurance");
              } else {
                addObjective(activeFaction.id, "Prove Endurance");
              }
            }}
            size={52}
            tag={
              <div
                className="flexRow largeFont"
                style={{
                  width: "100%",
                  height: "100%",
                  color: hasProveEndurance ? "green" : "red",
                }}
              >
                {hasProveEndurance ? (
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
            }
            tagBorderColor={hasProveEndurance ? "green" : "red"}
          />
        </div>
      );
      return null;
    case "Tactical":
      const conqueredPlanets = currentTurn
        .filter(
          (logEntry) =>
            logEntry.data.action === "CLAIM_PLANET" &&
            logEntry.data.event.faction === activeFaction.id
        )
        .map((logEntry) => (logEntry.data as ClaimPlanetData).event);
      return (
        <TacticalAction
          activeFactionId={activeFaction.id}
          attachments={attachments ?? {}}
          claimablePlanets={claimablePlanets}
          conqueredPlanets={conqueredPlanets}
          currentTurn={currentTurn}
          factions={factions ?? {}}
          gameid={gameid ?? ""}
          objectives={objectives ?? {}}
          planets={planets ?? {}}
          scorableObjectives={scorableObjectives}
          scoredObjectives={scoredObjectives}
          style={style}
          techs={techs ?? {}}
        />
      );
  }
  return null;
}

interface NextPlayerButtonsProps {
  buttonStyle?: CSSProperties;
}

export function NextPlayerButtons({
  buttonStyle = {},
}: NextPlayerButtonsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const actionLog = useContext(ActionLogContext);
  const selectedAction = getSelectedActionFromLog(actionLog);
  const newSpeaker = getNewSpeakerEventFromLog(actionLog);

  async function completeActions() {
    if (!gameid || selectedAction === null) {
      return;
    }

    endTurnAsync(gameid);
  }

  async function finalizeAction() {
    if (!gameid || selectedAction === null) {
      return;
    }
    endTurnAsync(gameid, true);
  }

  function isTurnComplete() {
    switch (selectedAction) {
      case "Politics":
        return !!newSpeaker;
    }
    return !!selectedAction;
  }

  if (!isTurnComplete()) {
    return null;
  } else {
    return (
      <div className="flexRow" style={{ gap: "16px" }}>
        <button
          onClick={completeActions}
          className={styles.EndTurnButton}
          style={buttonStyle}
        >
          End Turn
        </button>
        {selectedAction !== "Pass" ? (
          <React.Fragment>
            <div style={{ fontSize: "16px" }}>OR</div>
            <button
              onClick={finalizeAction}
              className={styles.EndTurnButton}
              style={buttonStyle}
            >
              Take Another Action
            </button>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

interface ActivePlayerColumnProps {
  activeFaction: Faction;
  onDeckFaction: Faction;
}

export function ActivePlayerColumn({
  activeFaction,
  onDeckFaction,
}: ActivePlayerColumnProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  return (
    <div className={styles.ActivePlayerColumn}>
      Active Player
      <SwitchTransition>
        <CSSTransition key={activeFaction.id} timeout={500} classNames="fade">
          <FactionCard
            faction={activeFaction}
            rightLabel={
              <FactionTimer
                factionId={activeFaction.id}
                style={{ fontSize: responsivePixels(16), width: "auto" }}
              />
            }
            opts={{
              iconSize: responsivePixels(200),
              fontSize: responsivePixels(32),
            }}
          >
            <div className={styles.ActivePlayerSection}>
              <FactionActions factionId={activeFaction.id} />
              <AdditionalActions
                factionId={activeFaction.id}
                style={{ minWidth: responsivePixels(350) }}
              />
            </div>
          </FactionCard>
        </CSSTransition>
      </SwitchTransition>
      <NextPlayerButtons />
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "center" }}
      >
        <SwitchTransition>
          <CSSTransition key={onDeckFaction.id} timeout={500} classNames="fade">
            <LabeledDiv
              label="On Deck"
              rightLabel={
                <StaticFactionTimer
                  factionId={onDeckFaction.id}
                  style={{
                    fontSize: responsivePixels(16),
                  }}
                  width={84}
                />
              }
              color={getFactionColor(onDeckFaction)}
              style={{
                width: "fit-content",
                minWidth: responsivePixels(200),
                fontSize: responsivePixels(24),
              }}
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  height: responsivePixels(44),
                  whiteSpace: "nowrap",
                  gap: responsivePixels(4),
                }}
              >
                {getFactionName(onDeckFaction)}
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    width: responsivePixels(44),
                    height: responsivePixels(44),
                    zIndex: -1,
                    opacity: 0.7,
                  }}
                >
                  <FactionIcon factionId={onDeckFaction.id} size="100%" />
                </div>
              </div>
              {/* <FactionCard
              faction={onDeckFaction}
              style={{ width: "auto", height: responsivePixels(100) }}
              opts={{
                iconSize: responsivePixels(80),
                fontSize: responsivePixels(24),
              }}
            >
              <div
                className="flexColumn"
                style={{
                  height: "100%",
                  width: responsivePixels(160),
                  paddingBottom: responsivePixels(4),
                  fontSize: responsivePixels(12),
                }}
              >
                <StaticFactionTimer
                  factionId={onDeckFaction.id}
                  style={{
                    fontSize: responsivePixels(24),
                  }}
                  width={132}
                />
              </div>
            </FactionCard> */}
            </LabeledDiv>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <LockedButtons
        unlocked={!activeFaction}
        style={{ marginTop: responsivePixels(12) }}
        buttons={[
          {
            text: "Advance to Status Phase",
            onClick: () => {
              if (!gameid) {
                return;
              }
              advanceToStatusPhase(gameid);
            },
          },
        ]}
      />
    </div>
  );
}

export function advanceToStatusPhase(gameid: string) {
  advancePhaseAsync(gameid);
}

export default function ActionPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  if (!factions || !state || !strategyCards) {
    return <FullScreenLoader />;
  }

  const activeFaction =
    state.activeplayer && state.activeplayer !== "None"
      ? factions[state.activeplayer]
      : undefined;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
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

  const numFactions = Object.keys(factions).length;

  return (
    <React.Fragment>
      <div
        className={styles.LeftColumn}
        // className="flexColumn nonMobile"
        style={
          {
            "--gap":
              numFactions > 7 ? responsivePixels(4) : responsivePixels(8),
          } as CSSProperties
        }
      >
        {Object.values(cardsByFaction).map((cards) => {
          return (
            <SmallStrategyCard
              key={cards[0] ? cards[0].id : "Error"}
              cards={cards}
            />
          );
        })}
      </div>
      <div className="flexColumn" style={{ gap: responsivePixels(16) }}>
        <div className="flexColumn" style={{ width: "100%" }}>
          {activeFaction && onDeckFaction ? (
            <ActivePlayerColumn
              activeFaction={activeFaction}
              onDeckFaction={onDeckFaction}
            />
          ) : (
            <div className="flexColumn" style={{ height: "100svh" }}>
              <div
                style={{
                  fontSize: responsivePixels(42),
                }}
              >
                Action Phase Complete
              </div>
              <LockedButtons
                unlocked={true}
                buttons={[
                  {
                    text: "Advance to Status Phase",
                    onClick: () => {
                      if (!gameid) {
                        return;
                      }
                      advanceToStatusPhase(gameid);
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
