import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { capitalizeFirstLetter } from "../pages/setup";
import { AgendaRow } from "./AgendaRow";
import { BLACK_TEXT_GLOW, LabeledDiv, LabeledLine } from "./LabeledDiv";
import { ObjectiveRow } from "./ObjectiveRow";
import { TimerDisplay } from "./Timer";
import { buildCompleteGameData, useGameData } from "./data/GameData";
import { Faction, GameFaction } from "./util/api/factions";
import { LogEntry } from "./util/api/gameLog";
import { PlanetEvent } from "./util/api/subState";
import { getFactionColor, getFactionName } from "./util/factions";
import { responsivePixels } from "./util/util";
import { LogEntryElement } from "./components/LogEntry";
import { GameData } from "./util/api/state";
import { PHASE_BOUNDARIES, TURN_BOUNDARIES } from "./util/api/actionLog";
import { SetupFaction } from "./util/api/setup";
import { Options } from "./util/api/options";
import { BASE_PLANETS } from "../server/data/planets";
import { BASE_FACTIONS, FactionId } from "../server/data/factions";
import { GamePlanet } from "./util/api/planets";
import { GameObjective } from "./util/api/objectives";
import { StoredGameData } from "./util/api/util";
import { getHandler, updateGameData } from "./util/api/data";

function createRepeatedString(array: string[]) {
  const arrayCopy = structuredClone(array);
  switch (arrayCopy.length) {
    case 0:
      return "";
    case 1:
      return arrayCopy[0] as string;
    case 2:
      return arrayCopy.join(" and ");
    default:
      let lastElement = arrayCopy.pop();
      return arrayCopy.join(", ") + ", and " + lastElement;
  }
}

function conqueredPlanetsString(
  planetEvents: PlanetEvent[],
  factions: Record<string, Faction>
) {
  const eventArray = planetEvents.map((planetEvent) => {
    if (planetEvent.prevOwner) {
      const prevFaction = factions[planetEvent.prevOwner];
      return planetEvent.planet + " from " + getFactionName(prevFaction);
    }
    return planetEvent.planet;
  });
  return "Took control of " + createRepeatedString(eventArray);
}

// export function LogEntryElement({
//   logEntry,
//   prevEntry,
// }: {
//   logEntry: LogEntry;
//   prevEntry?: LogEntry;
// }) {
//   const router = useRouter();
//   const { game: gameid }: { game?: string } = router.query;
//   const gameData = useGameData(gameid, ["agendas", "factions", "objectives"]);
//   const agendas = gameData.agendas;
//   const factions = gameData.factions;
//   const objectives = gameData.objectives;

//   switch (logEntry.phase) {
//     case "SETUP":
//       return (
//         <div
//           className="flexColumn"
//           style={{ alignItems: "stretch", width: "calc(100% - 8px)" }}
//         >
//           <LabeledDiv label="Starting objectives">
//             {logEntry.objectives.map((objectiveName: string) => {
//               const objective = (objectives ?? {})[objectiveName];
//               if (!objective) {
//                 return null;
//               }
//               return (
//                 <ObjectiveRow
//                   key={objectiveName}
//                   hideScorers={true}
//                   objective={objective}
//                 />
//               );
//             })}
//           </LabeledDiv>
//         </div>
//       );
//     case "STRATEGY":
//       return (
//         <div className="flexColumn" style={{ alignItems: "stretch" }}>
//           {/* <LabeledDiv label="Selected strategy cards"> */}
//           {(logEntry.strategyCards ?? []).map((card) => {
//             const color = getFactionColor((factions ?? {})[card.assignedTo]);
//             return (
//               <div key={card.name}>
//                 <span
//                   style={{
//                     color: color,
//                     textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
//                   }}
//                 >
//                   {getFactionName((factions ?? {})[card.assignedTo])}
//                 </span>{" "}
//                 : {card.name}
//               </div>
//             );
//           })}
//           {/* </LabeledDiv> */}
//         </div>
//       );
//     case "ACTION":
//       if (!logEntry.turnData?.selectedAction || !logEntry.activeFaction) {
//         return null;
//       }
//       let turnSummary = null;

//       let componentSection,
//         planetSection,
//         objectiveSection,
//         techSection,
//         otherFactionsSection = null;

//       if (logEntry.turnData?.component?.name) {
//         let componentText = `Used ${logEntry.turnData.component.name}`;
//         switch (logEntry.turnData.component.name) {
//           case "Gain Relic":
//             componentText = `Purged 3 relic fragments and gained ${
//               (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
//                 ?.name
//             }`;
//             break;
//           case "Fabrication":
//             if (
//               (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
//                 ?.name
//             ) {
//               componentText = `Purged 2 relic fragments and gained ${
//                 (logEntry.turnData.factions ?? {})[logEntry.activeFaction]
//                   ?.relic?.name
//               }`;
//             } else {
//               componentText = `Purged 1 relic fragment and gained 1 command token`;
//             }
//             break;
//           case "Black Market Forgery":
//             componentText = `Purged 2 relic fragments and gained ${
//               (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
//                 ?.name
//             }`;
//           case "Hesh and Prit":
//             componentText = `Used Hesh and Prit and gained ${
//               (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
//                 ?.name
//             }`;
//           case "Nano-Forge":
//             componentText = `Attached Nano-Forge to ${
//               (logEntry.turnData.attachments ?? {})["Nano-Forge"]
//             }`;
//         }
//         componentSection = (
//           <div
//             className="flexColumn myriadPro"
//             style={{ alignItems: "stretch", width: "100%" }}
//           >
//             {componentText}
//           </div>
//         );
//       }

//       const turnFactions = logEntry.turnData.factions ?? {};

//       const conqueredPlanets =
//         turnFactions[logEntry.activeFaction]?.planets ?? [];
//       if (conqueredPlanets.length > 0) {
//         planetSection = (
//           <div
//             className="flexColumn myriadPro"
//             style={{ alignItems: "stretch", width: "100%" }}
//           >
//             {conqueredPlanetsString(conqueredPlanets, factions ?? {})}
//           </div>
//         );
//       }

//       const scoredObjectives =
//         turnFactions[logEntry.activeFaction]?.objectives ?? [];
//       if (scoredObjectives.length > 0) {
//         objectiveSection = (
//           <div
//             className="flexColumn myriadPro"
//             style={{ alignItems: "stretch", width: "100%" }}
//           >
//             Scored {createRepeatedString(scoredObjectives)}
//           </div>
//         );
//       }
//       const researchedTechs = turnFactions[logEntry.activeFaction]?.techs ?? [];
//       if (researchedTechs.length > 0) {
//         techSection = (
//           <div
//             className="flexColumn myriadPro"
//             style={{ alignItems: "stretch", width: "100%" }}
//           >
//             Researched {createRepeatedString(researchedTechs)}
//           </div>
//         );
//       }

//       let hasOtherFactionContent = false;
//       otherFactionsSection = (
//         <div
//           className="flexColumn myriadPro"
//           style={{
//             alignItems: "stretch",
//             width: "100%",
//           }}
//         >
//           {Object.entries(logEntry.turnData.factions ?? {}).map(
//             ([factionName, faction]) => {
//               if (factionName === logEntry.activeFaction) {
//                 return null;
//               }
//               let localPlanetSummary,
//                 localObjectiveSummary,
//                 localTechSummary = null;
//               const conqueredPlanets = faction.planets ?? [];
//               if (conqueredPlanets.length > 0) {
//                 localPlanetSummary = (
//                   <div
//                     className="flexColumn myriadPro"
//                     style={{ alignItems: "stretch", width: "100%" }}
//                   >
//                     {conqueredPlanetsString(conqueredPlanets, factions ?? {})}
//                   </div>
//                 );
//               }

//               const scoredObjectives = faction.objectives ?? [];
//               if (scoredObjectives.length > 0) {
//                 localObjectiveSummary = (
//                   <div
//                     className="flexColumn myriadPro"
//                     style={{ alignItems: "stretch", width: "100%" }}
//                   >
//                     Scored {createRepeatedString(scoredObjectives)}
//                   </div>
//                 );
//               }
//               const researchedTechs = faction.techs ?? [];
//               if (researchedTechs.length > 0) {
//                 localTechSummary = (
//                   <div
//                     className="flexColumn myriadPro"
//                     style={{ alignItems: "stretch", width: "100%" }}
//                   >
//                     Researched {createRepeatedString(researchedTechs)}
//                   </div>
//                 );
//               }

//               const color = getFactionColor((factions ?? {})[factionName]);

//               if (
//                 !localObjectiveSummary &&
//                 !localPlanetSummary &&
//                 !localTechSummary
//               ) {
//                 return null;
//               }
//               hasOtherFactionContent = true;
//               return (
//                 <div
//                   key={factionName}
//                   className="flexColumn"
//                   style={{
//                     alignItems: "flex-start",
//                     paddingLeft: responsivePixels(8),
//                     gap: responsivePixels(4),
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontFamily: "Slider",
//                       color: color,
//                       textShadow:
//                         color === "Black" ? BLACK_TEXT_GLOW : undefined,
//                     }}
//                   >
//                     {getFactionName((factions ?? {})[factionName])}
//                   </span>
//                   <div
//                     className="flexColumn"
//                     style={{
//                       alignItems: "flex-start",
//                       paddingLeft: responsivePixels(8),
//                     }}
//                   >
//                     {localTechSummary}
//                     {localObjectiveSummary}
//                     {localPlanetSummary}
//                   </div>
//                 </div>
//               );
//             }
//           )}
//         </div>
//       );
//       let totalSeconds = 0;
//       let totalMinutes = 0;
//       if (prevEntry?.gameSeconds && logEntry.gameSeconds) {
//         totalSeconds = logEntry.gameSeconds - prevEntry.gameSeconds;
//         totalMinutes = Math.floor(totalSeconds / 60);
//         totalSeconds = totalSeconds % 60;
//       }
//       turnSummary = (
//         <div
//           className="flexColumn"
//           style={{
//             width: "100%",
//             padding: `0 ${responsivePixels(16)}`,
//           }}
//         >
//           {componentSection}
//           {planetSection}
//           {objectiveSection}
//           {techSection}
//           {hasOtherFactionContent ? otherFactionsSection : null}
//         </div>
//       );
//       return (
//         <>
//           <LabeledLine
//             label={getFactionName((factions ?? {})[logEntry.activeFaction])}
//             rightLabel={logEntry.turnData.selectedAction}
//             leftLabel={
//               (totalMinutes > 0 ? totalMinutes + " mins " : "") +
//               totalSeconds +
//               " secs"
//             }
//             // leftLabel={
//             //   <TimerDisplay
//             //     time={totalSeconds ?? 0}
//             //     style={{
//             //       fontSize: responsivePixels(16),
//             //     }}
//             //     width={84}
//             //   />
//             // }
//             // rightLabel={logEntry.turnData?.selectedAction}
//             style={{ width: "calc(100% - 8px)" }}
//             color={getFactionColor((factions ?? {})[logEntry.activeFaction])}
//           />
//           {turnSummary}
//         </>
//       );
//     case "STATUS": {
//       let factionScoringSection;
//       factionScoringSection = (
//         <div
//           className="flexColumn myriadPro"
//           style={{
//             alignItems: "stretch",
//             width: "100%",
//           }}
//         >
//           {Object.entries(logEntry.turnData?.factions ?? {}).map(
//             ([factionName, faction]) => {
//               if (factionName === logEntry.activeFaction) {
//                 return null;
//               }
//               let localObjectiveSummary = null;

//               const scoredObjectives = faction.objectives ?? [];
//               if (scoredObjectives.length > 0) {
//                 localObjectiveSummary = (
//                   <div
//                     className="flexColumn myriadPro"
//                     style={{ alignItems: "stretch", width: "100%" }}
//                   >
//                     Scored {createRepeatedString(scoredObjectives)}
//                   </div>
//                 );
//               }

//               const color = getFactionColor((factions ?? {})[factionName]);

//               if (!localObjectiveSummary) {
//                 return null;
//               }
//               hasOtherFactionContent = true;
//               return (
//                 <div
//                   key={factionName}
//                   className="flexColumn"
//                   style={{
//                     alignItems: "flex-start",
//                     paddingLeft: responsivePixels(8),
//                     gap: responsivePixels(4),
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontFamily: "Slider",
//                       color: color,
//                       textShadow:
//                         color === "Black" ? BLACK_TEXT_GLOW : undefined,
//                     }}
//                   >
//                     {getFactionName((factions ?? {})[factionName])}
//                   </span>
//                   <div
//                     className="flexColumn"
//                     style={{
//                       alignItems: "flex-start",
//                       paddingLeft: responsivePixels(8),
//                     }}
//                   >
//                     {localObjectiveSummary}
//                   </div>
//                 </div>
//               );
//             }
//           )}
//         </div>
//       );
//       return (
//         <>
//           {factionScoringSection}
//           <LabeledDiv
//             label="Revealed objective"
//             style={{ width: "fit-content", marginLeft: responsivePixels(8) }}
//           >
//             {(logEntry.objectives ?? []).map((objectiveName: string) => {
//               const objective = (objectives ?? {})[objectiveName];
//               if (!objective) {
//                 return null;
//               }
//               return (
//                 <ObjectiveRow
//                   key={objectiveName}
//                   hideScorers={true}
//                   objective={objective}
//                 />
//               );
//             })}
//           </LabeledDiv>
//         </>
//       );
//     }
//     case "AGENDA": {
//       if (!logEntry.agenda) {
//         return null;
//       }
//       const agenda = (agendas ?? {})[logEntry.agenda];
//       if (!agenda) {
//         return null;
//       }
//       return (
//         <div className="flexColumn">
//           <AgendaRow key={logEntry.agenda} agenda={agenda} />
//         </div>
//       );
//     }
//   }
//   if (logEntry.selectedAction) {
//     return (
//       <React.Fragment>
//         {/* <LabeledDiv
//         label={
//           <TimerDisplay
//             time={logEntry.gameSeconds ?? 0}
//             style={{
//               fontSize: responsivePixels(16),
//               width: responsivePixels(84),
//             }}
//           />
//         }
//       > */}
//         {logEntry.activeFaction} used {logEntry.selectedAction}
//         <LabeledLine
//           leftLabel={
//             <TimerDisplay
//               time={logEntry.gameSeconds ?? 0}
//               style={{
//                 fontSize: responsivePixels(16),
//                 width: responsivePixels(84),
//               }}
//             />
//           }
//           rightLabel={new Date(logEntry.time).toLocaleString()}
//         />
//       </React.Fragment>
//     );
//   }
//   return <div>{logEntry.activeFaction}</div>;
// }

export function buildInitialGameData(setupData: {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
}) {
  const gameFactions: GameFaction[] = setupData.factions.map(
    (faction, index) => {
      if (!faction.name || !faction.color) {
        throw new Error("Faction missing name or color.");
      }
      // Determine speaker order for each faction.
      let order: number;
      if (index >= setupData.speaker) {
        order = index - setupData.speaker + 1;
      } else {
        order = index + setupData.factions.length - setupData.speaker + 1;
      }

      // Get home planets for each faction.
      // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
      const homeBasePlanets = Object.entries(BASE_PLANETS).filter(
        ([_, planet]) => planet.faction === faction.name && planet.home
      );
      const homePlanets: Record<string, { ready: boolean }> = {};
      homeBasePlanets.forEach(([planetId, _]) => {
        homePlanets[planetId] = {
          ready: true,
        };
      });

      // Get starting techs for each faction.
      const baseFaction = BASE_FACTIONS[faction.name as FactionId];
      const startingTechs: Record<string, { ready: boolean }> = {};
      (baseFaction.startswith.techs ?? []).forEach((tech) => {
        startingTechs[tech] = {
          ready: true,
        };
      });

      return {
        // Client specified values
        name: faction.name,
        color: faction.color,
        playerName: faction.playerName,
        order: order,
        mapPosition: index,
        // Faction specific values
        planets: homePlanets,
        techs: startingTechs,
        startswith: baseFaction.startswith,
        // State values
        hero: "locked",
        commander: "locked",
      };
    }
  );

  let baseFactions: Record<string, GameFaction> = {};
  let basePlanets: Record<string, GamePlanet> = {};
  let speakerName: string | undefined;
  gameFactions.forEach((faction, index) => {
    if (index === setupData.speaker) {
      speakerName = faction.name;
    }
    const localFaction = { ...faction };
    if (
      faction.name === "Winnu" &&
      !setupData.options.expansions.includes("POK")
    ) {
      localFaction.startswith.choice = {
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
    }
    baseFactions[faction.name] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name] = {
        ...planet,
        owner: faction.name,
      };
    });
  });

  let baseObjectives: Record<string, GameObjective> = {
    "Custodians Token": {
      selected: true,
    },
    "Imperial Point": {
      selected: true,
    },
    "Support for the Throne": {
      selected: true,
    },
  };

  if (!speakerName) {
    throw new Error("No speaker selected.");
  }

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 180);

  const gameState: StoredGameData = {
    state: {
      speaker: speakerName,
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: setupData.options,
    objectives: baseObjectives,
  };

  return gameState;
}

export function buildSetupGameData(gameData: GameData): {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
} {
  const actionLog = gameData.actionLog ?? [];
  let speaker = 0;
  for (let i = actionLog.length - 1; i >= 0; i--) {
    const entry = actionLog[i];
    if (entry?.data.action === "ASSIGN_STRATEGY_CARD") {
      const initialSpeaker = gameData.factions[entry.data.event.pickedBy];
      if (initialSpeaker) {
        speaker = initialSpeaker.mapPosition;
        break;
      }
    }
  }

  const factions: SetupFaction[] = [];
  for (const faction of Object.values(gameData.factions)) {
    factions[faction.mapPosition] = {
      color: faction.color,
      name: faction.name,
      playerName: faction.playerName,
    };
  }

  return {
    factions: factions,
    speaker: speaker,
    options: gameData.options,
  };
}

export function GameLog({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid);
  const actionLog = gameData.actionLog ?? [];

  const reversedActionLog = useMemo(() => {
    return [...actionLog].reverse();
  }, [actionLog]);

  const setupGameData = useMemo(() => {
    return buildSetupGameData(gameData);
  }, [gameData]);

  const initialGameData = useMemo(() => {
    return buildInitialGameData(setupGameData);
  }, [setupGameData]);

  const dynamicGameData = useMemo(() => {
    return buildCompleteGameData(initialGameData);
  }, [initialGameData]);

  let prevPhase = "None";
  let prevEntry: LogEntry | undefined;
  // let currRound = 1;

  let endTimeSeconds = 0;

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        height: responsivePixels(440),
        overflow: "auto",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {reversedActionLog.map((logEntry, index) => {
        const handler = getHandler(dynamicGameData, logEntry.data);
        if (!handler) {
          return null;
        }
        updateGameData(dynamicGameData, handler.getUpdates());
        switch (logEntry.data.action) {
          case "ADVANCE_PHASE": {
            for (let i = index + 1; i < reversedActionLog.length; i++) {
              const nextEntry = reversedActionLog[i];
              if (!nextEntry) {
                break;
              }
              if (PHASE_BOUNDARIES.includes(nextEntry.data.action)) {
                endTimeSeconds = nextEntry.gameSeconds ?? 0;
                break;
              }
            }
            break;
          }
          case "SELECT_ACTION": {
            // Set to end of previous turn.
            for (let i = index - 1; i > 0; i--) {
              const prevEntry = reversedActionLog[i];
              if (!prevEntry) {
                break;
              }
              if (TURN_BOUNDARIES.includes(prevEntry.data.action)) {
                logEntry.gameSeconds = prevEntry.gameSeconds ?? 0;
                break;
              }
            }
          }
          case "REVEAL_AGENDA":
          case "ASSIGN_STRATEGY_CARD": {
            for (let i = index + 1; i < reversedActionLog.length; i++) {
              const nextEntry = reversedActionLog[i];
              if (!nextEntry) {
                break;
              }
              if (TURN_BOUNDARIES.includes(nextEntry.data.action)) {
                endTimeSeconds = nextEntry.gameSeconds ?? 0;
                break;
              }
            }
            break;
          }
        }
        return (
          <LogEntryElement
            key={logEntry.timestampMillis}
            logEntry={logEntry}
            currRound={dynamicGameData.state.round}
            activePlayer={dynamicGameData.state.activeplayer}
            endTimeSeconds={endTimeSeconds}
          />
        ); // if (logEntry.phase && logEntry.phase !== prevPhase) {
        //   prevPhase = logEntry.phase;
        //   if (logEntry.phase === "STRATEGY") {
        //     currRound++;
        //   }
        //   const output = (
        //     <React.Fragment key={index}>
        //       <LabeledLine
        //         label={
        //           currRound !== 0
        //             ? `Round ${currRound} ${capitalizeFirstLetter(
        //                 logEntry.phase.toLowerCase()
        //               )} Phase`
        //             : `${capitalizeFirstLetter(
        //                 logEntry.phase.toLowerCase()
        //               )} Phase`
        //         }
        //         style={{ width: "calc(100% - 8px)" }}
        //       />
        //       <LogEntryElement logEntry={logEntry} prevEntry={prevEntry} />
        //     </React.Fragment>
        //   );
        //   prevEntry = logEntry;
        //   return output;
        // }
        // const output = (
        //   <LogEntryElement
        //     key={index}
        //     logEntry={logEntry}
        //     prevEntry={prevEntry}
        //   />
        // );
        // prevEntry = logEntry;
        // return output;
      })}
    </div>
  );
}
