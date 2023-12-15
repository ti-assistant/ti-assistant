import { NextApiRequest, NextApiResponse } from "next";
import {
  getFullActionLog,
  getGameData,
  getTimers,
} from "../../../server/util/fetch";
import { BASE_PLANETS } from "../../../server/data/planets";
import { BASE_FACTIONS } from "../../../server/data/factions";

// function buildInitialGameData(setupData: {
//   factions: SetupFaction[];
//   speaker: number;
//   options: Options;
// }) {
//   const gameFactions: GameFaction[] = setupData.factions.map(
//     (faction, index) => {
//       if (!faction.name || !faction.color || !faction.id) {
//         throw new Error("Faction missing name or color.");
//       }
//       // Determine speaker order for each faction.
//       let order: number;
//       if (index >= setupData.speaker) {
//         order = index - setupData.speaker + 1;
//       } else {
//         order = index + setupData.factions.length - setupData.speaker + 1;
//       }

//       // Get home planets for each faction.
//       // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
//       const homeBasePlanets = Object.values(BASE_PLANETS).filter(
//         (planet) => planet.faction === faction.name && planet.home
//       );
//       const homePlanets: Partial<Record<PlanetId, { ready: boolean }>> = {};
//       homeBasePlanets.forEach((planet) => {
//         homePlanets[planet.id] = {
//           ready: true,
//         };
//       });

//       // Get starting techs for each faction.
//       const baseFaction = BASE_FACTIONS[faction.id];
//       if (!baseFaction) {
//         return {
//           // Client specified values
//           name: faction.name,
//           color: faction.color,
//           playerName: faction.playerName,
//           order: order,
//           mapPosition: index,
//           // Faction specific values
//           planets: homePlanets,
//           techs: {},
//           startswith: { units: {} },
//           // State values
//           hero: "locked",
//           commander: "locked",
//         };
//       }
//       const startingTechs: Partial<Record<TechId, { ready: boolean }>> = {};
//       (baseFaction.startswith.techs ?? []).forEach((tech) => {
//         startingTechs[tech] = {
//           ready: true,
//         };
//       });

//       return {
//         // Client specified values
//         name: faction.name,
//         color: faction.color,
//         playerName: faction.playerName,
//         order: order,
//         mapPosition: index,
//         // Faction specific values
//         planets: homePlanets,
//         techs: startingTechs,
//         startswith: baseFaction.startswith,
//         // State values
//         hero: "locked",
//         commander: "locked",
//       };
//     }
//   );

//   let baseFactions: Partial<Record<FactionId, GameFaction>> = {};
//   let basePlanets: Partial<Record<PlanetId, GamePlanet>> = {};
//   let speakerName: FactionId | undefined;
//   gameFactions.forEach((faction, index) => {
//     if (index === setupData.speaker) {
//       speakerName = faction.name as FactionId;
//     }
//     const localFaction = { ...faction };
//     if (
//       faction.name === "Winnu" &&
//       !setupData.options.expansions.includes("POK")
//     ) {
//       localFaction.startswith.choice = {
//         select: 1,
//         options: [
//           "Neural Motivator",
//           "Sarween Tools",
//           "Antimass Deflectors",
//           "Plasma Scoring",
//         ],
//       };
//     }
//     baseFactions[faction.name as FactionId] = localFaction;
//     Object.entries(faction.planets).forEach(([name, planet]) => {
//       basePlanets[name as PlanetId] = {
//         ...planet,
//         owner: faction.name as FactionId,
//       };
//     });
//   });

//   let baseObjectives: Partial<Record<ObjectiveId, GameObjective>> = {
//     "Custodians Token": {
//       selected: true,
//     },
//     "Imperial Point": {
//       selected: true,
//     },
//     "Support for the Throne": {
//       selected: true,
//     },
//   };

//   if (!speakerName) {
//     throw new Error("No speaker selected.");
//   }

//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + 180);

//   const gameState: StoredGameData = {
//     state: {
//       speaker: speakerName,
//       phase: "SETUP",
//       round: 1,
//     },
//     factions: baseFactions,
//     planets: basePlanets,
//     options: setupData.options,
//     objectives: baseObjectives,
//   };

//   return gameState;
// }

function buildSetupGameData(gameData: StoredGameData): {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }

  const fullActionLog = await getFullActionLog(gameId);

  const storedGameData = await getGameData(gameId);

  storedGameData.actionLog = fullActionLog;

  const setupData = buildSetupGameData(storedGameData);

  const storedTimers = await getTimers(gameId);

  res.setHeader("Content-Type", "application/json");
  // res.setHeader('Content-Disposition', 'attachment; filename=dummy.pdf');

  res.status(200).json({
    data: setupData,
    timers: storedTimers,
    actionLog: fullActionLog,
  });
}
