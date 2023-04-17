import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import React, { CSSProperties, useEffect } from "react";
import { FactionCard, FullFactionSymbol } from "../FactionCard";
import { SmallStrategyCard } from "../StrategyCard";
import { getOnDeckFaction, getStrategyCardsForFaction } from "../util/helpers";
import { hasTech, Tech } from "../util/api/techs";
import {
  markStrategyCardUsed,
  StrategyCard,
  StrategyCardName,
} from "../util/api/cards";
import { Faction, passFaction, readyAllFactions } from "../util/api/factions";
import { fetcher, poster } from "../util/api/util";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import SummaryColumn from "./SummaryColumn";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { PlanetRow } from "../PlanetRow";
import { ObjectiveRow } from "../ObjectiveRow";
import { BLACK_BORDER_GLOW, LabeledDiv, LabeledLine } from "../LabeledDiv";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { TechRow } from "../TechRow";
import { BasicFactionTile } from "../FactionTile";
import { getFactionColor, getFactionName } from "../util/factions";
import { TechSelectHoverMenu } from "./util/TechSelectHoverMenu";
import { SelectableRow } from "../SelectableRow";
import {
  Action,
  addSubStatePlanet,
  addSubStateTech,
  clearAddedSubStateTech,
  clearSubState,
  finalizeSubState,
  markSecondary,
  PlanetEvent,
  removeSubStatePlanet,
  scoreSubStateObjective,
  Secondary,
  setSubStateSelectedAction,
  setSubStateSpeaker,
  SubState,
  undoSubStateSpeaker,
  unscoreSubStateObjective,
} from "../util/api/subState";
import { pluralize, responsivePixels } from "../util/util";
import { applyPlanetAttachments } from "../util/planets";
import { ComponentAction } from "./util/ComponentAction";
import { GameState, nextPlayer, StateUpdateData } from "../util/api/state";
import { Attachment } from "../util/api/attachments";
import { claimPlanet, Planet, unclaimPlanet } from "../util/api/planets";
import {
  hasScoredObjective,
  Objective,
  scoreObjective,
  takeObjective,
  unscoreObjective,
} from "../util/api/objectives";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { FullScreenLoader } from "../Loader";
import { Agenda } from "../util/api/agendas";
import { LockedButtons } from "../LockedButton";
import { FactionSelectHoverMenu } from "../components/FactionSelect";
import { FactionCircle } from "../components/FactionCircle";
import { TacticalAction } from "../components/TacticalAction";

export interface FactionActionButtonsProps {
  factionName: string;
  buttonStyle?: CSSProperties;
}

function SecondaryCheck({
  activeFactionName,
  gameid,
  orderedFactions,
  subState,
}: {
  activeFactionName: string;
  gameid: string;
  orderedFactions: Faction[];
  subState: SubState;
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
          if (faction.name === activeFactionName) {
            return null;
          }
          const secondaryState =
            (subState.turnData?.factions ?? {})[faction.name]?.secondary ??
            "PENDING";
          const color = getFactionColor(faction);
          if (secondaryState === "PENDING") {
            allCompleted = false;
          }
          return (
            <FactionCircle
              key={faction.name}
              blur={true}
              borderColor={color}
              fade={secondaryState !== "PENDING"}
              factionName={faction.name}
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
                markSecondary(gameid, faction.name, nextState);
              }}
              size={52}
              tag={
                secondaryState === "PENDING" ? undefined : (
                  <div
                    className="flexRow largeFont"
                    style={{
                      color: secondaryState === "DONE" ? "green" : "red",
                      // fontWeight: "bold",
                    }}
                  >
                    {secondaryState === "DONE" ? "✓" : "⤬"}
                  </div>
                )
              }
              tagBorderColor={secondaryState === "DONE" ? "green" : "red"}
            >
              {/* {secondaryState === "DONE" ? (
                <div
                  className="flexColumn centered"
                  style={{
                    position: "absolute",
                    color: "#eee",
                    width: "100%",
                    fontSize: responsivePixels(40),
                    zIndex: 0,
                    textAlign: "center",
                    height: responsivePixels(52),
                  }}
                >
                  ✓
                </div>
              ) : null}
              {secondaryState === "SKIPPED" ? (
                <div
                  className="flexColumn centered"
                  style={{
                    position: "absolute",
                    color: "#eee",
                    width: "100%",
                    fontSize: responsivePixels(44),
                    zIndex: 0,
                    textAlign: "center",
                    height: responsivePixels(52),
                  }}
                >
                  ⤬
                </div>
              ) : null} */}
            </FactionCircle>
          );
        })}
      </div>
      {allCompleted ? "Secondaries completed" : null}
    </div>
  );
}

export function FactionActionButtons({
  factionName,
  buttonStyle,
}: FactionActionButtonsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
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
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (!gameid || !subState || !planets) {
      return;
    }
    const ownerOfMecatol = planets["Mecatol Rex"]?.owner;
    const selectedAction = subState.turnData?.selectedAction;
    const hasImperialPoint = (
      (subState.turnData?.factions ?? {})[factionName]?.objectives ?? []
    ).includes("Imperial Point");
    if (
      hasImperialPoint &&
      (selectedAction !== "Imperial" || factionName !== ownerOfMecatol)
    ) {
      unscoreObjective(gameid, factionName, "Imperial Point");
      unscoreSubStateObjective(gameid, factionName, "Imperial Point");
      return;
    }
    if (
      !hasImperialPoint &&
      selectedAction === "Imperial" &&
      factionName === ownerOfMecatol
    ) {
      scoreObjective(gameid, factionName, "Imperial Point");
      scoreSubStateObjective(gameid, factionName, "Imperial Point");
      return;
    }
  }, [factionName, planets, subState, gameid]);

  if (!factions) {
    return null;
  }

  function canFactionPass(factionName: string) {
    for (const card of getStrategyCardsForFaction(strategyCards, factionName)) {
      if (!card.used) {
        return false;
      }
    }
    return true;
  }

  function addObjective(factionName: string, toScore: string) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, toScore);
    scoreSubStateObjective(gameid, factionName, toScore);
  }

  function undoObjective(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, toRemove);
    unscoreSubStateObjective(gameid, factionName, toRemove);
  }

  function toggleAction(action: Action) {
    if (!gameid || !subState) {
      return;
    }
    if (subState.turnData?.selectedAction === action) {
      clearSubState(gameid);
      if (subState.turnData?.selectedAction === "Imperial") {
        const mecatol = (planets ?? {})["Mecatol Rex"];
        if (mecatol && mecatol.owner === factionName) {
          undoObjective(factionName, "Imperial Point");
        }
      }
    } else {
      setSubStateSelectedAction(gameid, action);
      if (subState.turnData?.selectedAction === "Imperial") {
        const mecatol = (planets ?? {})["Mecatol Rex"];
        if (mecatol && mecatol.owner === factionName) {
          undoObjective(factionName, "Imperial Point");
        }
      }
      if (action === "Imperial") {
        const mecatol = (planets ?? {})["Mecatol Rex"];
        if (mecatol && mecatol.owner === factionName) {
          addObjective(factionName, "Imperial Point");
        }
      }
    }
  }

  const activeFaction = factions[factionName];
  if (!activeFaction) {
    return null;
  }

  const orderedStrategyCards = Object.values(strategyCards)
    .filter((card) => card.faction)
    .sort((a, b) => a.order - b.order);

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
      {getStrategyCardsForFaction(strategyCards, activeFaction.name).map(
        (card) => {
          if (card.used) {
            return null;
          }
          return (
            <button
              key={card.name}
              className={
                subState?.turnData?.selectedAction === card.name
                  ? "selected"
                  : ""
              }
              style={buttonStyle}
              onClick={() => toggleAction(card.name)}
            >
              {card.name}
            </button>
          );
        }
      )}
      <button
        className={
          subState?.turnData?.selectedAction === "Tactical" ? "selected" : ""
        }
        style={buttonStyle}
        onClick={() => toggleAction("Tactical")}
      >
        Tactical
      </button>
      <button
        className={
          subState?.turnData?.selectedAction === "Component" ? "selected" : ""
        }
        style={buttonStyle}
        onClick={() => toggleAction("Component")}
      >
        Component
      </button>
      {canFactionPass(activeFaction.name) ? (
        <button
          className={
            subState?.turnData?.selectedAction === "Pass" ? "selected" : ""
          }
          style={buttonStyle}
          disabled={!canFactionPass(activeFaction.name)}
          onClick={() => toggleAction("Pass")}
        >
          Pass
        </button>
      ) : null}
    </div>
  );
}

export function FactionActions({ factionName }: { factionName: string }) {
  return (
    <div className="flexColumn" style={{ gap: responsivePixels(4) }}>
      <div style={{ fontSize: responsivePixels(20) }}>Select Action</div>
      <FactionActionButtons
        factionName={factionName}
        buttonStyle={{ fontSize: responsivePixels(18) }}
      />
    </div>
  );
}

export interface AdditionalActionsProps {
  factionName: string;
  style?: CSSProperties;
  ClientOnlyHoverMenuStyle?: CSSProperties;
  primaryOnly?: boolean;
  secondaryOnly?: boolean;
}

export function AdditionalActions({
  factionName,
  style = {},
  primaryOnly = false,
  secondaryOnly = false,
}: AdditionalActionsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: attachments }: { data?: Record<string, Attachment> } = useSWR(
    gameid ? `/api/${gameid}/attachments` : null,
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
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
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
  const { data: planets = {} }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
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

  if (!factions || !techs) {
    return null;
  }

  const activeFaction = factions[factionName];

  if (!activeFaction) {
    return null;
  }

  function getResearchableTechs(faction: Faction) {
    if (faction.name === "Nekro Virus") {
      const nekroTechs = new Set<string>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((techName) => {
          if (
            !hasTech(faction, techName) &&
            !(
              (subState.turnData?.factions ?? {})["Nekro Virus"]?.techs ?? []
            ).includes(techName)
          ) {
            nekroTechs.add(techName);
          }
        });
      });
      return Array.from(nekroTechs).map(
        (techName) => (techs ?? {})[techName] as Tech
      );
    }
    const replaces: string[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.name)) {
        return false;
      }
      if (
        faction.name !== "Nekro Virus" &&
        tech.faction &&
        faction.name !== tech.faction
      ) {
        return false;
      }
      const researchedTechs =
        ((subState.turnData?.factions ?? {})[faction.name] ?? {}).techs ?? [];
      if (researchedTechs.includes(tech.name)) {
        return false;
      }
      if (tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.name !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.name));
    }
    return availableTechs;
  }

  const researchableTechs = getResearchableTechs(activeFaction);

  function removePlanet(factionName: string, toRemove: PlanetEvent) {
    if (!gameid) {
      return;
    }
    if (toRemove.name === "Mecatol Rex") {
      if (!toRemove.prevOwner) {
        undoObjective(factionName, "Custodians Token");
      }
    }
    if (toRemove.prevOwner) {
      claimPlanet(gameid, toRemove.name, toRemove.prevOwner);
    } else {
      unclaimPlanet(gameid, toRemove.name, factionName);
    }
    removeSubStatePlanet(gameid, factionName, toRemove.name);
  }

  function addPlanet(factionName: string, toAdd: Planet) {
    if (!gameid) {
      return;
    }
    const prevOwner = toAdd.owner;
    if (toAdd.name === "Mecatol Rex") {
      if (!prevOwner) {
        addObjective(factionName, "Custodians Token");
      }
    }
    claimPlanet(gameid, toAdd.name, factionName);
    addSubStatePlanet(gameid, factionName, toAdd.name, prevOwner);
  }

  function addObjective(factionName: string, toScore: string) {
    if (!gameid) {
      return;
    }
    scoreObjective(gameid, factionName, toScore);
    scoreSubStateObjective(gameid, factionName, toScore);
  }

  function undoObjective(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    unscoreObjective(gameid, factionName, toRemove);
    unscoreSubStateObjective(gameid, factionName, toRemove);
  }

  function removeTech(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    clearAddedSubStateTech(gameid, factionName, toRemove);
  }

  function addTech(factionName: string, tech: Tech) {
    if (!gameid) {
      return;
    }
    addSubStateTech(gameid, factionName, tech.name);
  }

  function selectSpeaker(factionName: string) {
    if (!gameid) {
      return;
    }
    setSubStateSpeaker(gameid, factionName);
  }
  function resetSpeaker() {
    if (!gameid) {
      return;
    }
    undoSubStateSpeaker(gameid);
  }

  function lastFaction() {
    const numFactions = Object.keys(factions ?? {}).length;
    const numPassed = Object.values(factions ?? {}).filter(
      (faction) => faction.passed
    ).length;
    return numFactions - 1 === numPassed;
  }
  const claimedPlanets =
    ((subState.turnData?.factions ?? {})[activeFaction.name] ?? {}).planets ??
    [];
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if (!planets) {
      return false;
    }
    if (planet.owner === activeFaction.name) {
      return false;
    }
    if (planet.locked) {
      return false;
    }
    for (const claimedPlanet of claimedPlanets) {
      if (claimedPlanet.name === planet.name) {
        return false;
      }
    }
    if (claimedPlanets.length > 0) {
      const claimedPlanetName = claimedPlanets[0]?.name;
      const claimedPlanet = planets[claimedPlanetName ?? ""];
      if (claimedPlanet?.system) {
        return planet.system === claimedPlanet.system;
      }
      if (claimedPlanet?.faction) {
        return planet.faction === claimedPlanet.faction;
      }
      return false;
    }
    return true;
  });
  const scoredObjectives =
    ((subState.turnData?.factions ?? {})[activeFaction.name] ?? {})
      .objectives ?? [];
  const scorableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      const scorers = objective.scorers ?? [];
      if (scorers.includes(activeFaction.name)) {
        return false;
      }
      if (scoredObjectives.includes(objective.name)) {
        return false;
      }
      if (
        objective.name === "Become a Martyr" ||
        objective.name === "Prove Endurance"
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

  const secretButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    alignItems: "stretch",
    display: "grid",
    gridAutoFlow: "column",
    maxWidth: "85vw",
    justifyContent: "flex-start",
    overflowX: "auto",
    gridTemplateRows: `repeat(8, auto)`,
    gap: responsivePixels(4),
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
  switch (subState.turnData?.selectedAction) {
    case "Technology":
      const researchedTech =
        ((subState.turnData?.factions ?? {})[activeFaction.name] ?? {}).techs ??
        [];
      if (!!primaryOnly || !!secondaryOnly) {
        const isActive = state?.activeplayer === factionName;
        const numTechs =
          isActive || factionName === "Universities of Jol-Nar" ? 2 : 1;
        return activeFaction.name !== "Nekro Virus" ? (
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
                          if (gameid && !isActive) {
                            markSecondary(
                              gameid,
                              activeFaction.name,
                              "PENDING"
                            );
                          }
                          removeTech(activeFaction.name, tech);
                        }}
                      />
                    );
                  })}
                </div>
              ) : null}
              {researchedTech.length < numTechs ? (
                <TechSelectHoverMenu
                  techs={researchableTechs}
                  selectTech={(tech) => {
                    if (
                      gameid &&
                      !isActive &&
                      researchedTech.length + 1 === numTechs
                    ) {
                      markSecondary(gameid, activeFaction.name, "DONE");
                    }
                    addTech(activeFaction.name, tech);
                  }}
                  direction="vertical"
                />
              ) : null}
              {isActive ? (
                <React.Fragment>
                  <LabeledLine leftLabel="Secondary" />
                  <SecondaryCheck
                    activeFactionName={activeFaction.name}
                    gameid={gameid ?? ""}
                    orderedFactions={orderedFactions}
                    subState={subState}
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
          {activeFaction.name !== "Nekro Virus" ? (
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
                              removeTech(activeFaction.name, tech)
                            }
                          />
                        );
                      })}
                    </div>
                  ) : null}
                  {researchedTech.length < 2 ? (
                    <TechSelectHoverMenu
                      techs={researchableTechs}
                      selectTech={(tech) => addTech(activeFaction.name, tech)}
                      direction="horizontal"
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
                  faction.name === activeFaction.name ||
                  faction.name === "Nekro Virus"
                ) {
                  return null;
                }
                let maxTechs = 1;
                if (faction.name === "Universities of Jol-Nar") {
                  maxTechs = 2;
                  // TODO: Add ability for people to copy them.
                }
                const researchedTechs =
                  ((subState.turnData?.factions ?? {})[faction.name] ?? {})
                    .techs ?? [];
                const availableTechs = getResearchableTechs(faction);
                const secondaryState =
                  (subState.turnData?.factions ?? {})[faction.name]
                    ?.secondary ?? "PENDING";
                if (
                  researchedTechs.length === 0 &&
                  secondaryState === "SKIPPED"
                ) {
                  return null;
                }
                return (
                  <LabeledDiv
                    key={faction.name}
                    label={getFactionName(faction)}
                    color={getFactionColor(faction)}
                    style={{ width: "49%" }}
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
                              if (gameid) {
                                markSecondary(gameid, faction.name, "PENDING");
                              }
                              removeTech(faction.name, tech);
                            }}
                            opts={{ hideSymbols: true }}
                          />
                        );
                      })}
                      {researchedTechs.length < maxTechs ? (
                        <TechSelectHoverMenu
                          techs={availableTechs}
                          selectTech={(tech) => {
                            if (
                              gameid &&
                              researchedTechs.length + 1 === maxTechs
                            ) {
                              markSecondary(gameid, faction.name, "DONE");
                            }
                            addTech(faction.name, tech);
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  </LabeledDiv>
                );
              })}
              <SecondaryCheck
                activeFactionName={activeFaction.name}
                gameid={gameid ?? ""}
                orderedFactions={orderedFactions}
                subState={subState}
              />
            </div>
          </div>
        </div>
      );
    case "Politics":
      const selectedSpeaker = factions[subState.turnData.speaker ?? ""];
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
              <FactionSelectHoverMenu
                borderColor={
                  selectedSpeaker ? getFactionColor(selectedSpeaker) : undefined
                }
                onSelect={(factionName, _) => {
                  if (factionName) {
                    selectSpeaker(factionName);
                  } else {
                    resetSpeaker();
                  }
                }}
                options={orderedFactions
                  .filter((faction) => faction.name !== state?.speaker)
                  .map((faction) => faction.name)}
                selectedFaction={selectedSpeaker?.name}
                size={52}
              />
            </div>
          </React.Fragment>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionName={activeFaction.name}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
            subState={subState}
          />
        </div>
      );
    case "Diplomacy":
      if (activeFaction.name === "Xxcha Kingdom") {
        return (
          <div className="flexColumn largeFont" style={{ ...style }}>
            <LabeledLine leftLabel="Primary" />
            <LabeledDiv label="Peace Accords">
              <React.Fragment>
                {claimedPlanets.length > 0 ? (
                  <div className="flexColumn" style={{ alignItems: "stretch" }}>
                    {claimedPlanets.map((planet) => {
                      const planetObj = planets[planet.name];
                      if (!planetObj) {
                        return null;
                      }
                      const adjustedPlanet = applyPlanetAttachments(
                        planetObj,
                        attachments ?? {}
                      );
                      return (
                        <PlanetRow
                          key={planet.name}
                          factionName={activeFaction.name}
                          planet={adjustedPlanet}
                          removePlanet={() =>
                            removePlanet(activeFaction.name, planet)
                          }
                        />
                      );
                    })}
                  </div>
                ) : null}
                {claimablePlanets.length > 0 && claimedPlanets.length === 0 ? (
                  <ClientOnlyHoverMenu label="Claim Empty Planet">
                    <div className="flexRow" style={targetButtonStyle}>
                      {claimablePlanets.map((planet) => {
                        return (
                          <button
                            key={planet.name}
                            style={{
                              writingMode: "horizontal-tb",
                              width: responsivePixels(90),
                            }}
                            onClick={() =>
                              addPlanet(activeFaction.name, planet)
                            }
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
              activeFactionName={activeFaction.name}
              gameid={gameid ?? ""}
              orderedFactions={orderedFactions}
              subState={subState}
            />
          </div>
        );
      } else if (factions["Xxcha Kingdom"]) {
        const xxchaPlanets =
          ((subState.turnData?.factions ?? {})["Xxcha Kingdom"] ?? {})
            .planets ?? [];
        const nonXxchaPlanets = Object.values(planets ?? {}).filter(
          (planet) => {
            if (planet.owner === "Xxcha Kingdom") {
              return false;
            }
            if (planet.locked) {
              return false;
            }
            for (const claimedPlanet of claimedPlanets) {
              if (claimedPlanet.name === planet.name) {
                return false;
              }
            }
            if (claimedPlanets.length > 0) {
              const claimedPlanetName = claimedPlanets[0]?.name;
              const claimedPlanet = planets[claimedPlanetName ?? ""];
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
                      const planetObj = planets[planet.name];
                      if (!planetObj) {
                        return null;
                      }
                      const adjustedPlanet = applyPlanetAttachments(
                        planetObj,
                        attachments ?? {}
                      );
                      return (
                        <PlanetRow
                          key={planet.name}
                          factionName={"Xxcha Kingdom"}
                          planet={adjustedPlanet}
                          removePlanet={() => {
                            if (gameid) {
                              markSecondary(gameid, "Xxcha Kingdom", "PENDING");
                            }
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
                            key={planet.name}
                            style={{
                              writingMode: "horizontal-tb",
                              width: responsivePixels(90),
                            }}
                            onClick={() => {
                              if (gameid) {
                                markSecondary(gameid, "Xxcha Kingdom", "DONE");
                              }
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
              activeFactionName={activeFaction.name}
              gameid={gameid ?? ""}
              orderedFactions={orderedFactions}
              subState={subState}
            />
          </div>
        );
      }
      return (
        <div className="flexColumn" style={{ width: "100%" }}>
          <LabeledLine leftLabel="Secondary" />
          <SecondaryCheck
            activeFactionName={activeFaction.name}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
            subState={subState}
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
            activeFactionName={activeFaction.name}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
            subState={subState}
          />
        </div>
      );
    case "Imperial":
      let hasImperialPoint = false;
      scoredObjectives.forEach((objective) => {
        if (objective === "Imperial Point") {
          hasImperialPoint = true;
        }
      });
      const availablePublicObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          if ((objective.scorers ?? []).includes(activeFaction.name)) {
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
                          undoObjective(activeFaction.name, objective)
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
                            key={objective.name}
                            onClick={() =>
                              addObjective(activeFaction.name, objective.name)
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
            activeFactionName={activeFaction.name}
            gameid={gameid ?? ""}
            orderedFactions={orderedFactions}
            subState={subState}
          />
        </div>
      );
    // TODO: Display buttons for various actions.
    case "Component":
      return <ComponentAction factionName={activeFaction.name} />;
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
        if (scorers.includes(factionName)) {
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
            key={activeFaction.name}
            blur={true}
            borderColor={getFactionColor(activeFaction)}
            factionName={activeFaction.name}
            onClick={() => {
              if (!gameid) {
                return;
              }
              if (hasProveEndurance) {
                undoObjective(activeFaction.name, "Prove Endurance");
              } else {
                addObjective(activeFaction.name, "Prove Endurance");
              }
            }}
            size={52}
            tag={
              <div
                className="flexRow largeFont"
                style={{
                  color: hasProveEndurance ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {hasProveEndurance ? "✓" : "⤬"}
              </div>
            }
            tagBorderColor={hasProveEndurance ? "green" : "red"}
          />
        </div>
      );
      return null;
    case "Tactical":
      const conqueredPlanets =
        ((subState.turnData?.factions ?? {})[activeFaction.name] ?? {})
          .planets ?? [];
      return (
        <TacticalAction
          activeFactionName={activeFaction.name}
          attachments={attachments ?? {}}
          claimablePlanets={claimablePlanets}
          conqueredPlanets={conqueredPlanets}
          factions={factions ?? {}}
          gameid={gameid ?? ""}
          objectives={objectives ?? {}}
          planets={planets ?? {}}
          scorableObjectives={scorableObjectives}
          scoredObjectives={scoredObjectives}
          subState={subState ?? {}}
          style={style}
          techs={techs ?? {}}
        />
      );
  }
  return null;
}

export interface NextPlayerButtonsProps {
  factionName: string;
  buttonStyle?: CSSProperties;
}

export function NextPlayerButtons({
  factionName,
  buttonStyle = {},
}: NextPlayerButtonsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
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
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  async function completeActions() {
    if (!gameid || subState.turnData?.selectedAction === null) {
      return;
    }
    await finalizeAction();
    nextPlayer(gameid, factions ?? {}, strategyCards, subState);
  }

  async function finalizeAction() {
    if (!gameid || !subState.turnData?.selectedAction) {
      return;
    }
    finalizeSubState(gameid, subState);

    if (strategyCards[subState.turnData?.selectedAction]) {
      markStrategyCardUsed(
        gameid,
        subState.turnData?.selectedAction as StrategyCardName
      );
    }
    if (subState.turnData?.selectedAction === "Pass") {
      await passFaction(gameid, factionName);
    }
  }

  function isTurnComplete() {
    switch (subState.turnData?.selectedAction) {
      case "Politics":
        return !!subState.turnData.speaker;
    }
    return !!subState.turnData?.selectedAction;
  }

  if (!isTurnComplete()) {
    return null;
  } else {
    return (
      <div className="flexRow" style={{ gap: "16px" }}>
        <button onClick={completeActions} style={buttonStyle}>
          End Turn
        </button>
        {subState.turnData?.selectedAction !== "Pass" ? (
          <React.Fragment>
            <div style={{ fontSize: "16px" }}>OR</div>
            <button onClick={finalizeAction} style={buttonStyle}>
              Take Another Action
            </button>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export interface ActivePlayerColumnProps {
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
    <div
      className="flexColumn"
      style={{
        boxSizing: "border-box",
        paddingTop: responsivePixels(74),
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: responsivePixels(40),
      }}
    >
      Active Player
      <SwitchTransition>
        <CSSTransition key={activeFaction.name} timeout={500} classNames="fade">
          <FactionCard
            faction={activeFaction}
            rightLabel={
              <FactionTimer
                factionName={activeFaction.name}
                style={{ fontSize: responsivePixels(16), width: "auto" }}
              />
            }
            style={{
              minWidth: responsivePixels(400),
              minHeight: responsivePixels(240),
            }}
            opts={{
              iconSize: responsivePixels(200),
              fontSize: responsivePixels(32),
            }}
          >
            <div
              className="flexColumn"
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              <FactionActions factionName={activeFaction.name} />
              <AdditionalActions
                factionName={activeFaction.name}
                style={{ minWidth: responsivePixels(350) }}
              />
            </div>
          </FactionCard>
        </CSSTransition>
      </SwitchTransition>
      <NextPlayerButtons
        factionName={activeFaction.name}
        buttonStyle={{ fontSize: responsivePixels(24) }}
      />
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "center" }}
      >
        {" "}
        <SwitchTransition>
          <CSSTransition
            key={onDeckFaction.name}
            timeout={500}
            classNames="fade"
          >
            <LabeledDiv
              label="On Deck"
              rightLabel={
                <StaticFactionTimer
                  factionName={onDeckFaction.name}
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
                  <FullFactionSymbol faction={onDeckFaction.name} />
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
                  factionName={onDeckFaction.name}
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
  const data: StateUpdateData = {
    action: "ADVANCE_PHASE",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        return {
          ...state,
          phase: "STATUS",
        };
      },
      revalidate: false,
    }
  );

  readyAllFactions(gameid);
}

export default function ActionPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: strategyCards }: { data?: Record<string, StrategyCard> } =
    useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher, {
      revalidateIfStale: false,
    });
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  if (!factions || !state || !subState || !strategyCards) {
    return <FullScreenLoader />;
  }

  const activeFaction = factions[state.activeplayer ?? ""];
  const onDeckFaction = getOnDeckFaction(
    state,
    factions,
    strategyCards,
    subState
  );
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

  const numFactions = Object.keys(factions).length;

  return (
    <React.Fragment>
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          justifyContent: "flex-start",
          paddingTop: responsivePixels(148),
          boxSizing: "border-box",
          height: "100%",
          gap: numFactions > 7 ? 0 : responsivePixels(8),
        }}
      >
        {Object.values(cardsByFaction).map((cards) => {
          return (
            <SmallStrategyCard
              key={cards[0] ? cards[0].name : "Error"}
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
