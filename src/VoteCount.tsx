import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { LabeledDiv } from "./LabeledDiv";
import { Selector } from "./Selector";
import { Agenda } from "./util/api/agendas";
import { Attachment } from "./util/api/attachments";
import { StrategyCard } from "./util/api/cards";
import { getDefaultStrategyCards } from "./util/api/defaults";
import { Faction } from "./util/api/factions";
import { Objective } from "./util/api/objectives";
import { Options } from "./util/api/options";
import { Planet } from "./util/api/planets";
import { GameState } from "./util/api/state";
import { hasTech } from "./util/api/techs";
import { getFactionColor, getFactionName } from "./util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { responsivePixels } from "./util/util";
import { useGameData } from "./data/GameData";
import { setSpeaker } from "./util/api/setSpeaker";
import { castVotes } from "./util/api/castVotes";
import {
  getActionCardTargets,
  getAllVotes,
  getFactionVotes,
  getPlayedRiders,
  getPromissoryTargets,
} from "./util/actionLog";
import {
  getCurrentPhaseLogEntries,
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "./util/api/actionLog";
import { ActionLogEntry } from "./util/api/util";
import { PlayPromissoryNoteData } from "./util/model/playPromissoryNote";
// import { setSpeaker } from "./util/api/data";

export function getTargets(
  agenda: Agenda | undefined,
  factions: Record<string, Faction>,
  strategycards: Record<string, StrategyCard>,
  planets: Record<string, Planet>,
  agendas: Record<string, Agenda>,
  objectives: Record<string, Objective>
) {
  if (!agenda) {
    return [];
  }
  switch (agenda.elect) {
    case "For/Against":
      return ["For", "Against", "Abstain"];
    case "Player":
      return [
        ...Object.values(factions).map((faction) => {
          return faction.name;
        }),
        "Abstain",
      ];
    case "Strategy Card":
      return [...Object.keys(strategycards), "Abstain"];
    case "Planet":
      const ownedPlanetNames = Object.values(planets)
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...ownedPlanetNames, "Abstain"];
    case "Cultural Planet":
      const culturalPlanets = Object.values(planets)
        .filter((planet) => planet.type === "CULTURAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...culturalPlanets, "Abstain"];
    case "Hazardous Planet":
      const hazardousPlanets = Object.values(planets)
        .filter((planet) => planet.type === "HAZARDOUS")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...hazardousPlanets, "Abstain"];
    case "Industrial Planet":
      const industrialPlanets = Object.values(planets)
        .filter((planet) => planet.type === "INDUSTRIAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...industrialPlanets, "Abstain"];
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets)
        .filter((planet) => !planet.home && planet.name !== "Mecatol Rex")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...electablePlanets, "Abstain"];
    case "Law":
      const passedLaws = Object.values(agendas)
        .filter((agenda) => agenda.type === "LAW" && agenda.passed)
        .map((law) => law.name);
      return [...passedLaws, "Abstain"];
    case "Scored Secret Objective":
      const secrets = Object.values(objectives).filter((objective) => {
        return objective.type === "SECRET";
      });
      const scoredSecrets = secrets.filter((objective) => {
        return (objective.scorers ?? []).length > 0;
      });
      if (scoredSecrets.length === 0) {
        return [...secrets.map((secret) => secret.name), "Abstain"];
      }
      return [...scoredSecrets.map((secret) => secret.name), "Abstain"];
  }
  return [];
}

export function canFactionVote(
  factionName: string,
  agendas: Record<string, Agenda>,
  state: GameState,
  factions: Record<string, Faction>,
  currentTurn: ActionLogEntry[]
) {
  const faction = factions[factionName];
  if (factionName === "Nekro Virus") {
    return false;
  }
  if (
    factionName === "Xxcha Kingdom" &&
    faction &&
    faction.commander === "unlocked"
  ) {
    return true;
  }
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  if (politicalSecrets.includes(factionName)) {
    return false;
  }
  const assassinatedRep = getActionCardTargets(
    currentTurn,
    "Assassinate Representative"
  )[0];
  if (assassinatedRep === factionName) {
    return false;
  }
  const riders = getPlayedRiders(currentTurn);
  for (const rider of riders) {
    if (rider.faction === factionName) {
      return false;
    }
  }
  const publicExecution = agendas["Public Execution"];
  if (
    publicExecution &&
    publicExecution.resolved &&
    publicExecution.target === factionName &&
    publicExecution.activeRound === state.round
  ) {
    return false;
  }
  return true;
}

export function computeRemainingVotes(
  factionName: string,
  factions: Record<string, Faction>,
  planets: Record<string, Planet>,
  attachments: Record<string, Attachment>,
  agendas: Record<string, Agenda>,
  options: Options,
  state: GameState,
  currentPhasePrevious: ActionLogEntry[]
) {
  const representativeGovernment = agendas["Representative Government"];

  if (representativeGovernment && representativeGovernment.passed) {
    return {
      influence: 0,
      extraVotes: 1,
    };
  }
  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const filteredPlanets = updatedPlanets.filter((planet) => {
    if (factionName !== state?.ancientBurialSites) {
      return true;
    }
    return (
      planet.type !== "CULTURAL" && !planet.attributes.includes("all-types")
    );
  });

  const orderedPlanets = filteredPlanets.sort((a, b) => {
    const aRatio =
      a.resources > 0 ? a.influence / a.resources : Number.MAX_SAFE_INTEGER;
    const bRatio =
      b.resources > 0 ? b.influence / b.resources : Number.MAX_SAFE_INTEGER;
    if (aRatio !== bRatio) {
      return bRatio - aRatio;
    }
    if (a.influence !== b.influence) {
      return b.influence - a.influence;
    }
    if ((a.attributes ?? []).length !== (b.attributes ?? []).length) {
      return (a.attributes ?? []).length - (b.attributes ?? []).length;
    }
    return 0;
  });

  const faction = factions[factionName];
  if (!faction) {
    return {
      influence: 0,
      extraVotes: 0,
    };
  }

  const votesCast = getAllVotes(currentPhasePrevious)
    .filter((voteEvent) => {
      return voteEvent.faction === factionName;
    })
    .reduce((votes, voteEvent) => {
      return votes + voteEvent.votes;
    }, 0);

  let influenceNeeded = votesCast;
  if (factionName === "Argent Flight") {
    influenceNeeded = Math.max(
      influenceNeeded - Object.keys(factions).length,
      0
    );
  }
  let planetCount = 0;
  let remainingVotes = 0;
  for (const planet of orderedPlanets) {
    let planetInfluence = planet.influence;
    if (factionName === "Xxcha Kingdom") {
      if (
        options.expansions.includes("CODEX THREE") &&
        faction.hero === "unlocked"
      ) {
        planetInfluence += planet.resources;
      }
      if (faction.commander === "unlocked") {
        planetInfluence += 1;
      }
    }
    if (influenceNeeded > 0 && planetInfluence <= influenceNeeded) {
      influenceNeeded -= planetInfluence;
      continue;
    }
    if (factionName === "Xxcha Kingdom" && faction.commander === "unlocked") {
      planetInfluence -= 1;
    }
    planetCount++;

    remainingVotes += planetInfluence;
  }

  // Player cast an invalid number of votes. Forcibly adjust.
  if (influenceNeeded > 0) {
    remainingVotes = Math.max(remainingVotes - influenceNeeded, 0);
  }

  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (factionName === "Xxcha Kingdom" && faction.commander === "unlocked") {
    extraVotes += planetCount;
  }
  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  if (hasPredictiveIntelligence) {
    extraVotes += 3;
  }

  return {
    influence: remainingVotes,
    extraVotes: extraVotes,
  };
}

export interface VoteCountProps {
  factionName: string;
  agenda: Agenda | undefined;
}

export function VoteCount({ factionName, agenda }: VoteCountProps) {
  const voteRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "attachments",
    "factions",
    "objectives",
    "options",
    "planets",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas;
  const attachments = gameData.attachments;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const options = gameData.options;
  const planets = gameData.planets;
  const state = gameData.state;
  const strategycards = gameData.strategycards ?? getDefaultStrategyCards();

  const [usingPredictiveIntelligence, setUsingPredictiveIntelligence] =
    useState(true);

  function castVotesLocal(target: string | undefined, votes: number) {
    if (!gameid) {
      return;
    }

    if (target === "Abstain") {
      castVotes(gameid, factionName, 0, "Abstain");
    } else {
      castVotes(gameid, factionName, votes, target);
    }

    // if (target === "Abstain") {
    //   castSubStateVotes(gameid, factionName, "Abstain", 0);
    // } else {
    //   castSubStateVotes(gameid, factionName, target, votes);
    // }
  }

  if (!factions || !options || !state) {
    return null;
  }

  const faction = factions[factionName];

  if (!faction) {
    return null;
  }

  const { influence, extraVotes } = computeRemainingVotes(
    factionName,
    factions,
    planets ?? {},
    attachments ?? {},
    agendas ?? {},
    options,
    state,
    getCurrentPhasePreviousLogEntries(gameData.actionLog ?? [])
  );

  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  const menuButtons = [];
  if (factionName !== state?.speaker) {
    menuButtons.push({
      text: "Set Speaker",
      action: () => {
        if (!gameid) {
          return;
        }
        setSpeaker(gameid, factionName);
      },
    });
  }
  if (hasPredictiveIntelligence) {
    menuButtons.push({
      text: usingPredictiveIntelligence
        ? "Cancel Predictive Intelligence"
        : "Use Predictive Intelligence",
      action: () =>
        setUsingPredictiveIntelligence(!usingPredictiveIntelligence),
    });
  }

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const targets = getTargets(
    agenda,
    factions,
    strategycards,
    planets ?? {},
    agendas ?? {},
    objectives ?? {}
  );
  const factionVotes = getFactionVotes(currentTurn, factionName);

  function saveCastVotes(element: HTMLDivElement) {
    if (element.innerText !== "") {
      const numerical = parseInt(element.innerText);
      if (!isNaN(numerical)) {
        castVotesLocal(factionVotes?.target, numerical);
        element.innerText = numerical.toString();
      }
    }
    element.innerText = factionVotes?.votes?.toString() ?? "0";
  }

  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
    >
      <div
        className="flexRow"
        style={{
          gap: responsivePixels(16),
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!canFactionVote(
          factionName,
          agendas ?? {},
          state,
          factions,
          currentTurn
        ) ? (
          <div
            className="flexRow"
            style={{ boxSizing: "border-box", width: "100%" }}
          >
            Cannot Vote
          </div>
        ) : (
          <React.Fragment>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                whiteSpace: "nowrap",
                flexShrink: 0,
                height: "100%",
              }}
            >
              <div
                style={{
                  color: "#72d4f7",
                  lineHeight: responsivePixels(35),
                  fontSize: responsivePixels(35),
                  textShadow: `0 0 ${responsivePixels(4)} #72d4f7`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: responsivePixels(28),
                  height: responsivePixels(35),
                }}
              >
                &#x2B21;
              </div>
              <div
                style={{
                  lineHeight: responsivePixels(35),
                  fontSize: responsivePixels(12),
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: responsivePixels(28),
                  height: responsivePixels(35),
                }}
              >
                {influence}
              </div>
              <div style={{ fontSize: responsivePixels(16) }}>
                + {extraVotes}
              </div>
            </div>
            <div
              className="flexRow hoverParent"
              style={{
                flexShrink: 0,
                gap: responsivePixels(4),
                fontSize: responsivePixels(20),
              }}
            >
              {factionVotes?.votes ?? 0 > 0 ? (
                <div
                  className="arrowDown"
                  onClick={() =>
                    castVotesLocal(
                      factionVotes?.target,
                      (factionVotes?.votes ?? 0) - 1
                    )
                  }
                ></div>
              ) : (
                <div style={{ width: responsivePixels(12) }}></div>
              )}
              <div
                className="flexRow"
                ref={voteRef}
                contentEditable={hasVotableTarget}
                suppressContentEditableWarning={true}
                onClick={(e) => {
                  if (!hasVotableTarget) {
                    return;
                  }
                  e.currentTarget.innerText = "";
                }}
                onBlur={(e) => saveCastVotes(e.currentTarget)}
                style={{ width: responsivePixels(24) }}
              >
                {factionVotes?.votes ?? 0}
              </div>
              {factionVotes?.target && factionVotes?.target !== "Abstain" ? (
                <div
                  className="arrowUp"
                  onClick={() =>
                    castVotesLocal(
                      factionVotes.target,
                      (factionVotes?.votes ?? 0) + 1
                    )
                  }
                ></div>
              ) : (
                <div style={{ width: responsivePixels(12) }}></div>
              )}
            </div>
            <Selector
              hoverMenuLabel="Select"
              options={targets}
              selectedItem={factionVotes?.target}
              toggleItem={(itemName, add) => {
                if (add) {
                  castVotesLocal(itemName, 0);
                } else {
                  castVotesLocal(undefined, 0);
                }
              }}
            />
          </React.Fragment>
        )}
        {/* <ClientOnlyHoverMenu
            label={
              factionSubState?.target
                ? factions[factionSubState.target]
                  ? getFactionName(factions[factionSubState.target])
                  : factionSubState.target
                : "Select"
            }
            buttonStyle={{ fontSize: responsivePixels(14) }}
            style={{ minWidth: "100%" }}
            renderProps={(closeFn) => (
              <div
                className="flexRow"
                style={{
                  padding: responsivePixels(8),
                  gap: responsivePixels(4),
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  display: "grid",
                  gridAutoFlow: "column",
                  gridTemplateRows: `repeat(${Math.min(
                    targets.length,
                    11
                  )}, auto)`,
                }}
              >
                {targets.map((target) => {
                  return (
                    <button
                      key={target}
                      style={{
                        writingMode: "horizontal-tb",
                        fontSize: responsivePixels(14),
                      }}
                      onClick={() => {
                        closeFn();
                        castVotes(target, 0);
                      }}
                    >
                      {target}
                    </button>
                  );
                })}
              </div>
            )}
          ></ClientOnlyHoverMenu> */}
        {/* </div> */}
      </div>
    </LabeledDiv>
  );
}
