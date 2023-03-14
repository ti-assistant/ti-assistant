import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import React, { CSSProperties } from "react";
import { FactionCard, FullFactionSymbol } from "../FactionCard";
import { SmallStrategyCard } from "../StrategyCard";
import { getOnDeckFaction, getStrategyCardsForFaction } from "../util/helpers";
import { hasTech, Tech } from "../util/api/techs";
import { markStrategyCardUsed, StrategyCard } from "../util/api/cards";
import { Faction, passFaction, readyAllFactions } from "../util/api/factions";
import { fetcher, poster } from "../util/api/util";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import SummaryColumn from "./SummaryColumn";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { PlanetRow } from "../PlanetRow";
import { ObjectiveRow } from "../ObjectiveRow";
import { LabeledDiv, LabeledLine } from "../LabeledDiv";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { TechRow } from "../TechRow";
import { BasicFactionTile } from "../FactionTile";
import { getFactionColor, getFactionName } from "../util/factions";
import { TechSelectHoverMenu } from "./util/TechSelectHoverMenu";
import { SelectableRow } from "../SelectableRow";
import {
  addSubStatePlanet,
  addSubStateTech,
  clearAddedSubStateTech,
  clearSubState,
  finalizeSubState,
  markSecondary,
  removeSubStatePlanet,
  scoreSubStateObjective,
  Secondary,
  setSubStateSelectedAction,
  setSubStateSpeaker,
  SubState,
  undoSubStateSpeaker,
  unscoreSubStateObjective,
} from "../util/api/subState";
import { responsivePixels } from "../util/util";
import { applyPlanetAttachments } from "../util/planets";
import { ComponentAction } from "./util/ComponentAction";
import { GameState, nextPlayer, StateUpdateData } from "../util/api/state";
import { Attachment } from "../util/api/attachments";
import { Planet } from "../util/api/planets";
import {
  Objective,
  scoreObjective,
  unscoreObjective,
} from "../util/api/objectives";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { FullScreenLoader } from "../Loader";
import { Agenda } from "../util/api/agendas";
import { LockedButtons } from "../LockedButton";

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
      <div className="flexRow">
        {orderedFactions.map((faction) => {
          if (faction.name === activeFactionName) {
            return null;
          }
          const secondaryState =
            (subState.factions ?? {})[faction.name]?.secondary ?? "PENDING";
          const color = getFactionColor(faction);
          if (secondaryState === "PENDING") {
            allCompleted = false;
          }
          return (
            <div
              className="flexRow"
              key={faction.name}
              style={{
                position: "relative",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: `3px solid ${color}`,
                cursor: "pointer",
                backdropFilter: "blur(4px)",
                boxShadow:
                  color === "Black"
                    ? "0 0 3px #999, 0 0 3px #999 inset"
                    : undefined,
              }}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                let nextState: Secondary = "DONE";
                switch (secondaryState) {
                  case "DONE":
                    nextState = "SKIPPED";
                    break;
                  case "SKIPPED":
                    nextState = "PENDING";
                    break;
                }

                markSecondary(gameid, faction.name, nextState);
              }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "28px",
                    height: "28px",
                  }}
                >
                  {secondaryState === "DONE" ? (
                    <div
                      style={{
                        position: "absolute",
                        color: "#eee",
                        width: "100%",
                        fontSize: responsivePixels(32),
                        lineHeight: responsivePixels(30),
                        zIndex: 0,
                        textAlign: "center",
                      }}
                    >
                      ✓
                    </div>
                  ) : null}
                  {secondaryState === "SKIPPED" ? (
                    <div
                      style={{
                        position: "absolute",
                        color: "#eee",
                        width: "100%",
                        fontSize: responsivePixels(34),
                        lineHeight: responsivePixels(26),
                        zIndex: 0,
                        textAlign: "center",
                      }}
                    >
                      ⤬
                    </div>
                  ) : null}
                  <div
                    style={{
                      position: "relative",
                      width: "28px",
                      height: "28px",
                      zIndex: -1,
                    }}
                  >
                    <FullFactionSymbol faction={faction.name} />
                  </div>
                </div>
              </div>
            </div>
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

  function toggleAction(action: string) {
    if (!gameid || !subState) {
      return;
    }
    if (subState.selectedAction === action) {
      clearSubState(gameid);
    } else {
      setSubStateSelectedAction(gameid, action);
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
                subState?.selectedAction === card.name ? "selected" : ""
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
        className={subState?.selectedAction === "Tactical" ? "selected" : ""}
        style={buttonStyle}
        onClick={() => toggleAction("Tactical")}
      >
        Tactical
      </button>
      <button
        className={subState?.selectedAction === "Component" ? "selected" : ""}
        style={buttonStyle}
        onClick={() => toggleAction("Component")}
      >
        Component
      </button>
      {canFactionPass(activeFaction.name) ? (
        <button
          className={subState?.selectedAction === "Pass" ? "selected" : ""}
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
  ClientOnlyHoverMenuStyle = {},
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
        ((subState.factions ?? {})[faction.name] ?? {}).techs ?? [];
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

  function removePlanet(factionName: string, toRemove: string) {
    if (!gameid) {
      return;
    }
    removeSubStatePlanet(gameid, factionName, toRemove);
  }

  function addPlanet(factionName: string, toAdd: Planet) {
    if (!gameid) {
      return;
    }
    addSubStatePlanet(gameid, factionName, toAdd.name);
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
    ((subState.factions ?? {})[activeFaction.name] ?? {}).planets ?? [];
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
    if (claimedPlanets.includes(planet.name)) {
      return false;
    }
    if (claimedPlanets.length > 0) {
      const claimedPlanetName = claimedPlanets[0];
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
    ((subState.factions ?? {})[activeFaction.name] ?? {}).objectives ?? [];
  const scorableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      if ((objective.scorers ?? []).includes(activeFaction.name)) {
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
      return objective.type === "SECRET" && objective.phase === "ACTION";
    }
  );

  const numColumns = Math.ceil(claimablePlanets.length / 13);
  const width = numColumns * 102 + (numColumns - 1) * 4 + 16;

  const targetButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(14, claimablePlanets.length)}, auto)`,
    gap: responsivePixels(4),
    justifyContent: "flex-start",
    ...ClientOnlyHoverMenuStyle,
  };

  const secretButtonStyle = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    alignItems: "stretch",
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
  switch (subState.selectedAction) {
    case "Technology":
      const researchedTech =
        ((subState.factions ?? {})[activeFaction.name] ?? {}).techs ?? [];
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
                  ((subState.factions ?? {})[faction.name] ?? {}).techs ?? [];
                const availableTechs = getResearchableTechs(faction);
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
      const selectedSpeaker = factions[subState.speaker ?? ""];
      return (
        <div
          className="flexColumn"
          style={{ gap: "4px", width: "100%", ...style }}
        >
          <React.Fragment>
            <LabeledLine leftLabel="Primary" />
            {selectedSpeaker ? (
              <LabeledDiv label="NEW SPEAKER" style={{ width: "90%" }}>
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  <SelectableRow
                    itemName={subState.speaker ?? ""}
                    removeItem={resetSpeaker}
                  >
                    <BasicFactionTile faction={selectedSpeaker} />
                  </SelectableRow>
                </div>
              </LabeledDiv>
            ) : (
              <ClientOnlyHoverMenu label="Select Speaker">
                <div className="flexColumn" style={{ ...secretButtonStyle }}>
                  {orderedFactions.map((faction) => {
                    if (state?.speaker === faction.name) {
                      return null;
                    }
                    return (
                      <button
                        key={faction.name}
                        style={{ writingMode: "horizontal-tb" }}
                        onClick={() => selectSpeaker(faction.name)}
                      >
                        {getFactionName(faction)}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            )}
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
          ((subState.factions ?? {})["Xxcha Kingdom"] ?? {}).planets ?? [];
        const nonXxchaPlanets = Object.values(planets ?? {}).filter(
          (planet) => {
            if (planet.owner === "Xxcha Kingdom") {
              return false;
            }
            if (planet.locked) {
              return false;
            }
            if (claimedPlanets.includes(planet.name)) {
              return false;
            }
            if (claimedPlanets.length > 0) {
              const claimedPlanetName = claimedPlanets[0];
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
            <SecondaryCheck
              activeFactionName={activeFaction.name}
              gameid={gameid ?? ""}
              orderedFactions={orderedFactions}
              subState={subState}
            />
            <LabeledDiv
              label={`${getFactionName(
                factions["Xxcha Kingdom"]
              )} - Peace Accords`}
              color={getFactionColor(factions["Xxcha Kingdom"])}
            >
              <React.Fragment>
                {xxchaPlanets.length > 0 ? (
                  <div className="flexColumn" style={{ alignItems: "stretch" }}>
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
                          factionName={"Xxcha Kingdom"}
                          planet={adjustedPlanet}
                          removePlanet={() =>
                            removePlanet("Xxcha Kingdom", planet)
                          }
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
                            onClick={() => addPlanet("Xxcha Kingdom", planet)}
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
          <LabeledDiv label="Imperial Point ?">
            <div
              className="flexRow"
              style={{ width: "100%", justifyContent: "space-evenly" }}
            >
              <button
                className={hasImperialPoint ? "selected" : ""}
                style={{ fontSize: responsivePixels(20) }}
                onClick={() =>
                  addObjective(activeFaction.name, "Imperial Point")
                }
              >
                Yes
              </button>
              <button
                className={!hasImperialPoint ? "selected" : ""}
                style={{ fontSize: responsivePixels(20) }}
                onClick={() =>
                  undoObjective(activeFaction.name, "Imperial Point")
                }
              >
                No
              </button>
            </div>
          </LabeledDiv>
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
      if (!lastFaction()) {
        return null;
      }
      let hasProveEndurance = false;
      scoredObjectives.forEach((objective) => {
        if (objective === "Prove Endurance") {
          hasProveEndurance = true;
        }
      });
      return (
        <LabeledDiv label="PROVE ENDURANCE?" style={{ gap: "4px", ...style }}>
          <div
            className="flexRow"
            style={{
              paddingTop: "8px",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <button
              className={hasProveEndurance ? "selected" : ""}
              style={{ fontSize: "20px" }}
              onClick={() =>
                addObjective(activeFaction.name, "Prove Endurance")
              }
            >
              Yes
            </button>
            <button
              className={!hasProveEndurance ? "selected" : ""}
              style={{ fontSize: "20px" }}
              onClick={() =>
                undoObjective(activeFaction.name, "Prove Endurance")
              }
            >
              No
            </button>
          </div>
        </LabeledDiv>
      );
      // TODO: Display option for Prove Endurance.
      return null;
    case "Tactical":
      const conqueredPlanets =
        ((subState.factions ?? {})[activeFaction.name] ?? {}).planets ?? [];
      return (
        <div className="flexColumn largeFont" style={{ ...style }}>
          {conqueredPlanets.length > 0 ? (
            <LabeledDiv label="NEWLY CONTROLLED PLANETS">
              <React.Fragment>
                <div
                  className="flexColumn"
                  style={{ alignItems: "stretch", width: "100%" }}
                >
                  {conqueredPlanets.map((planet) => {
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
                        factionName={activeFaction.name}
                        planet={adjustedPlanet}
                        removePlanet={() =>
                          removePlanet(activeFaction.name, planet)
                        }
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            </LabeledDiv>
          ) : null}
          {claimablePlanets.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Take Control of Planet"
              renderProps={(closeFn) => (
                <div className="flexRow" style={targetButtonStyle}>
                  {claimablePlanets.map((planet) => {
                    return (
                      <button
                        key={planet.name}
                        style={{
                          writingMode: "horizontal-tb",
                          width: responsivePixels(90),
                        }}
                        onClick={() => {
                          closeFn();
                          addPlanet(activeFaction.name, planet);
                        }}
                      >
                        {planet.name}
                      </button>
                    );
                  })}
                </div>
              )}
            ></ClientOnlyHoverMenu>
          ) : null}
          {scoredObjectives.length > 0 ? (
            <LabeledDiv label="SCORED SECRETS">
              <React.Fragment>
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {scoredObjectives.map((objective) => {
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
                        hideScorers={true}
                        objective={objectiveObj}
                        removeObjective={() =>
                          undoObjective(activeFaction.name, objective)
                        }
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            </LabeledDiv>
          ) : null}
          {scorableObjectives.length > 0 && scoredObjectives.length < 4 ? (
            <ClientOnlyHoverMenu
              label="Score Secret Objective"
              renderProps={(closeFn) => (
                <div className="flexColumn" style={{ ...secretButtonStyle }}>
                  {scorableObjectives.map((objective) => {
                    return (
                      <button
                        key={objective.name}
                        onClick={() => {
                          closeFn();
                          addObjective(activeFaction.name, objective.name);
                        }}
                      >
                        {objective.name}
                      </button>
                    );
                  })}
                </div>
              )}
            ></ClientOnlyHoverMenu>
          ) : null}
        </div>
      );
    // TODO: Display tech section for Nekro
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
    if (!gameid || subState.selectedAction === null) {
      return;
    }
    await finalizeAction();
    nextPlayer(gameid, factions ?? {}, strategyCards, subState);
  }

  async function finalizeAction() {
    if (!gameid || subState.selectedAction === null) {
      return;
    }
    finalizeSubState(gameid, subState);

    if (strategyCards[subState.selectedAction]) {
      markStrategyCardUsed(gameid, subState.selectedAction);
    }
    if (subState.selectedAction === "Pass") {
      await passFaction(gameid, factionName);
    }
  }

  function isTurnComplete() {
    switch (subState.selectedAction) {
      case "Politics":
        return !!subState.speaker;
    }
    return !!subState.selectedAction;
  }

  if (!isTurnComplete()) {
    return null;
  } else {
    return (
      <div className="flexRow" style={{ gap: "16px" }}>
        <button onClick={completeActions} style={buttonStyle}>
          End Turn
        </button>
        {subState.selectedAction !== "Pass" ? (
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
        marginLeft: responsivePixels(64),
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
      On Deck
      <SwitchTransition>
        <CSSTransition key={onDeckFaction.name} timeout={500} classNames="fade">
          <FactionCard
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
          </FactionCard>
        </CSSTransition>
      </SwitchTransition>
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
          paddingTop: responsivePixels(140),
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
