import { Storage } from "@google-cloud/storage";
import { buildObjectives } from "../../src/data/gameDataBuilder";
import { getHandler } from "../../src/util/api/gameLog";
import { updateGameData } from "../../src/util/api/handler";
import { getOppositeHandler } from "../../src/util/api/opposite";
import { updateActionLog } from "../../src/util/api/update";
import { computeVPs } from "../../src/util/factions";
import { EndGameHandler } from "../../src/util/model/endGame";
import { Optional } from "../../src/util/types/types";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getFullActionLog, getTimers } from "../../server/util/fetch";
import { Readable } from "stream";
import { getBaseData } from "../../src/data/baseData";
import { createIntlCache, createIntl } from "react-intl";
import { getLocale, getMessages } from "../../src/util/server";

export interface ProcessedGame {
  // Tags
  isObjectiveGame: boolean;
  isPlanetGame: boolean;
  isTechGame: boolean;
  isTimedGame: boolean;

  // Filter data
  victoryPoints: number;
  playerCount: number;
  expansions: Expansion[];

  winner: FactionId;
  rounds: ProcessedRound[];
  factions: Partial<Record<FactionId, GameFactionInfo>>;
  gameTime: number;
  objectives: Partial<Record<ObjectiveId, ObjectiveInfo>>;
}

interface GameFactionInfo {
  points: number;
  startingTechs: TechId[];
  endingTechs: TechId[];
}

interface ObjectiveInfo {
  scorers: FactionId[];
}

interface ProcessedRound {
  cardPicks: StrategyCardPick[];
  objectives: ObjectiveId[];

  factionInfo: Partial<Record<FactionId, FactionInfo>>;
}

interface FactionInfo {
  objectives: ObjectiveId[];
  planetsLost: PlanetCounts;
  planetsTaken: PlanetCounts;
  points: number;
  techs: TechId[];
}

interface StrategyCardPick {
  card: StrategyCardId;
  faction: FactionId;
}

interface PlanetCounts {
  all: number;
  home: number;
  mecatol: number;
}

const BASE_PLANET_COUNTS: PlanetCounts = {
  all: 0,
  home: 0,
  mecatol: 0,
};

const BASE_FACTION_INFO: FactionInfo = {
  objectives: [],
  planetsLost: structuredClone(BASE_PLANET_COUNTS),
  planetsTaken: structuredClone(BASE_PLANET_COUNTS),
  points: 0,
  techs: [],
};

function hasWinningFaction(game: StoredGameData, baseData: BaseData) {
  const objectives = buildObjectives(game, baseData);
  return Object.keys(game.factions).reduce((prev, factionId) => {
    const points = computeVPs(
      game.factions,
      factionId as FactionId,
      objectives
    );
    if (points >= game.options["victory-points"]) {
      return true;
    }
    return prev;
  }, false);
}

export function isCompletedGame(
  game: StoredGameData,
  baseData: BaseData,
  log: ActionLogEntry[]
) {
  if (!hasWinningFaction(game, baseData)) {
    return false;
  }

  let minTime: number = Number.MAX_SAFE_INTEGER;
  let maxTime: number = Number.MIN_SAFE_INTEGER;
  let gameMin: number = Number.MAX_SAFE_INTEGER;
  let gameMax: number = Number.MIN_SAFE_INTEGER;
  for (const entry of log) {
    minTime = Math.min(minTime, entry.timestampMillis);
    maxTime = Math.max(maxTime, entry.timestampMillis);
    gameMin = Math.min(gameMin, entry.gameSeconds ?? 0);
    gameMax = Math.min(gameMax, entry.gameSeconds ?? 0);
  }

  const gameDiff = gameMax - gameMin;
  const timeDiff = maxTime - minTime;
  // If game time was used, the game must be longer than 2 hours.
  if (gameDiff > 120 && gameDiff < 7200) {
    return false;
  }

  // The wall clock time diff must be longer than 2 hours.
  if (timeDiff < 7200000) {
    return false;
  }

  return true;
}

async function getJSONFileFromStorage(
  storage: Storage
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export async function rewriteProcessedGames() {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);
  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const baseData = getBaseData(intl);
  const processedGames = await getJSONFileFromStorage(storage);

  maybeUpdateProcessedGames(storage, processedGames, baseData);
}

const REFRESH_TIME = 86400000;

export async function maybeUpdateProcessedGames(
  storage: Storage,
  processedGames: Record<string, ProcessedGame>,
  baseData: BaseData
) {
  const [metadata] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .getMetadata();

  const creationTime = new Date(metadata.timeCreated ?? "");

  const timeDiff = Date.now() - creationTime.valueOf();
  if (timeDiff < REFRESH_TIME) {
    return;
  }

  const db = getFirestore();

  const gamesRef = db.collection("games");

  const gameData = await gamesRef.get();

  let allGames: Record<string, StoredGameData> = {};
  gameData.forEach((val) => {
    allGames[val.id] = val.data() as StoredGameData;
  });

  // const processedGames: Record<string, ProcessedGame> = {};
  for (const [gameId, game] of Object.entries(allGames)) {
    if (!!processedGames[gameId]) {
      continue;
    }

    const actionLog = await getFullActionLog(gameId);
    if (!isCompletedGame(game, baseData, actionLog)) {
      continue;
    }
    const timers = await getTimers(gameId);
    const processedGame = processGame(game, baseData, actionLog, timers);
    if (!processedGame) {
      continue;
    }
    processedGames[gameId] = processedGame;

    db.collection("games")
      .doc(gameId)
      .update({ deleteAt: FieldValue.delete() });

    try {
      db.collection("processed").doc(gameId).set(processedGame);
    } catch (err) {
      break;
    }
  }

  const file = storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json");

  const stream = new Readable();
  stream.pipe(file.createWriteStream());

  stream.push(JSON.stringify(processedGames));
  stream.push(null);
}

export function processGame(
  game: StoredGameData,
  baseData: BaseData,
  log: ActionLogEntry[],
  timers: Timers
) {
  const fixedGame = rewindGame(game, baseData, log);

  if (!fixedGame) {
    console.log("Couldn't fix game");
    return;
  }

  let winner: FactionId = "Vuil'raith Cabal";
  let maxPoints = 0;
  const factionInfo: Partial<Record<FactionId, GameFactionInfo>> = {};
  const objectives = buildObjectives(fixedGame, baseData);
  for (const [factionId, faction] of Object.entries(fixedGame.factions)) {
    const points = computeVPs(
      fixedGame.factions,
      factionId as FactionId,
      objectives
    );
    if (points > maxPoints) {
      winner = factionId as FactionId;
      maxPoints = points;
    }
    const startingTechs = faction.startswith.techs ?? [];
    const endingTechs = Object.keys(faction.techs) as TechId[];
    factionInfo[factionId as FactionId] = {
      points,
      startingTechs,
      endingTechs,
    };
  }

  const objectiveInfo: Partial<Record<ObjectiveId, ObjectiveInfo>> = {};
  for (const [objectiveId, objective] of Object.entries(
    fixedGame.objectives ?? {}
  )) {
    const baseObjective = baseData.objectives[objectiveId as ObjectiveId];
    if (!baseObjective) {
      continue;
    }
    if (
      (baseObjective.type === "STAGE ONE" ||
        baseObjective.type === "STAGE TWO") &&
      !objective.selected
    ) {
      continue;
    }
    objectiveInfo[objectiveId as ObjectiveId] = {
      scorers: objective.scorers ?? [],
    };
  }

  if (fixedGame.options["victory-points"] + 1 === maxPoints) {
    maxPoints -= 1;
  }
  const output: ProcessedGame = {
    isObjectiveGame: isObjectiveGame(fixedGame, baseData),
    isPlanetGame: isPlanetGame(fixedGame),
    isTechGame: isTechGame(fixedGame),
    isTimedGame: (timers.game ?? 0) !== 0,

    victoryPoints: maxPoints,
    playerCount: Object.keys(fixedGame.factions).length,
    expansions: fixedGame.options.expansions,

    winner,
    rounds: processLog(fixedGame, baseData, fixedGame.actionLog ?? []),
    factions: factionInfo,
    gameTime: timers.game ?? 0,
    objectives: objectiveInfo,
  };
  return output;
}

function isObjectiveGame(game: StoredGameData, baseData: BaseData) {
  const foundTypes = new Set<ObjectiveType>();
  const baseObjectives = baseData.objectives;
  for (const faction of Object.values(game.factions)) {
    if (faction.vps !== 0) {
      return false;
    }
  }
  return Object.entries(game.objectives ?? {}).reduce(
    (isObjGame, [id, curr]) => {
      if ((curr.scorers ?? []).length !== 0) {
        const type = baseObjectives[id as ObjectiveId].type;
        foundTypes.add(type);
        switch (foundTypes.size) {
          // Consider games without stage 2, but not without any other.
          case 3:
            return !foundTypes.has("STAGE TWO");
          case 4:
            return true;
        }
      }
      return isObjGame;
    },
    false
  );
}

function isPlanetGame(game: StoredGameData) {
  return Object.keys(game.planets).length > 30;
}

function isTechGame(game: StoredGameData) {
  return Object.values(game.factions).reduce((isTechGame, faction) => {
    for (const techId of Object.keys(faction.techs) as TechId[]) {
      if (!(faction.startswith.techs ?? []).includes(techId)) {
        return isTechGame;
      }
    }
    return false;
  }, true);
}

function rewindGame(
  game: StoredGameData,
  baseData: BaseData,
  log: ActionLogEntry[]
) {
  let maxPoints = game.options["victory-points"];
  const objectives = buildObjectives(game, baseData);
  for (const factionId of Object.keys(game.factions)) {
    const points = computeVPs(
      game.factions,
      factionId as FactionId,
      objectives
    );
    if (points > maxPoints) {
      maxPoints = points;
    }
  }
  if (game.options["victory-points"] + 1 === maxPoints) {
    maxPoints -= 1;
  }

  const output = structuredClone(game);
  output.actionLog = structuredClone(log);
  output.options["victory-points"] = maxPoints;

  let numSteps = 0;
  let lastEntry: Optional<ActionLogEntry>;
  while (numSteps < 20 && hasWinningFaction(output, baseData)) {
    numSteps++;
    lastEntry = output.actionLog[0];
    if (!lastEntry) {
      break;
    }
    let handler: any;
    try {
      handler = getOppositeHandler(output, lastEntry.data);
    } catch (err) {
      console.log("Error", err);
      return;
    }
    if (!handler) {
      return;
    }
    if (!handler.validate()) {
      return;
    }
    updateGameData(output, handler.getUpdates());
    updateActionLog(output, handler, Date.now());
  }

  if (numSteps === 20) {
    return;
  }

  if (!lastEntry) {
    console.log("Crazy Error");
    return;
  }

  const handler = getHandler(output, lastEntry.data);
  if (!handler) {
    console.log("Crazy Error");
    return;
  }
  if (!handler.validate()) {
    console.log("Crazy Error");
    return;
  }
  updateGameData(output, handler.getUpdates());
  updateActionLog(output, handler, Date.now());

  const endGameHandler = new EndGameHandler(output, {
    action: "END_GAME",
    event: {},
  });
  updateGameData(output, endGameHandler.getUpdates());
  updateActionLog(output, endGameHandler, Date.now());

  return output;
}

function processLog(
  game: StoredGameData,
  baseData: BaseData,
  log: ActionLogEntry[]
) {
  const objectives = buildObjectives(game, baseData);
  const rounds: ProcessedRound[] = [];
  let systems = new Set<SystemId>();
  let processedRound: ProcessedRound = {
    cardPicks: [],
    factionInfo: {},
    objectives: [],
  };
  const reversedLog = structuredClone(log);
  reversedLog.reverse();

  for (const logEntry of reversedLog) {
    switch (logEntry.data.action) {
      case "ASSIGN_STRATEGY_CARD": {
        const card =
          logEntry.data.event.id ?? (logEntry.data.event as any).name;
        if (!card) {
          console.log("Log Entry", logEntry.data);
          throw Error("EROEINOGEIN");
        }
        processedRound.cardPicks.push({
          card: card,
          faction: logEntry.data.event.assignedTo,
        });
        break;
      }
      case "ADD_TECH": {
        const factionInfo =
          processedRound.factionInfo[logEntry.data.event.faction] ??
          structuredClone(BASE_FACTION_INFO);
        factionInfo.techs.push(logEntry.data.event.tech);
        break;
      }
      case "REVEAL_OBJECTIVE": {
        processedRound.objectives.push(logEntry.data.event.objective);
        break;
      }
      case "SCORE_OBJECTIVE": {
        const objective = objectives[logEntry.data.event.objective];
        if (!objective) {
          break;
        }
        const factionInfo =
          processedRound.factionInfo[logEntry.data.event.faction] ??
          structuredClone(BASE_FACTION_INFO);
        factionInfo.objectives.push(logEntry.data.event.objective);
        factionInfo.points += objective.points;
        processedRound.factionInfo[logEntry.data.event.faction] = factionInfo;
        break;
      }
      case "UNSCORE_OBJECTIVE": {
        const objective = objectives[logEntry.data.event.objective];
        if (!objective) {
          break;
        }
        const factionInfo =
          processedRound.factionInfo[logEntry.data.event.faction] ??
          structuredClone(BASE_FACTION_INFO);
        factionInfo.points -= objective.points;
        processedRound.factionInfo[logEntry.data.event.faction] = factionInfo;
        break;
      }
      case "CLAIM_PLANET": {
        if (!logEntry.data.event.prevOwner) {
          break;
        }
        const planet = baseData.planets[logEntry.data.event.planet];
        const system = planet.system;
        // Only count a system 1 time in a turn.
        if (system && systems.has(system)) {
          break;
        }
        if (system) {
          systems.add(system);
        }
        const factionInfo =
          processedRound.factionInfo[logEntry.data.event.faction] ??
          structuredClone(BASE_FACTION_INFO);
        // TODO: Consider making home planets count more.
        const prevInfo =
          processedRound.factionInfo[logEntry.data.event.prevOwner] ??
          structuredClone(BASE_FACTION_INFO);
        factionInfo.planetsTaken.all++;
        prevInfo.planetsLost.all++;
        if (planet.home) {
          factionInfo.planetsTaken.home++;
          prevInfo.planetsLost.home++;
        }
        if (planet.id === "Mecatol Rex") {
          factionInfo.planetsTaken.mecatol++;
          prevInfo.planetsLost.mecatol++;
        }
        processedRound.factionInfo[logEntry.data.event.faction] = factionInfo;
        processedRound.factionInfo[logEntry.data.event.prevOwner] = prevInfo;
        break;
      }
      case "END_TURN": {
        systems = new Set();
        break;
      }
      case "ADVANCE_PHASE": {
        if (logEntry.data.event.state?.phase === "STATUS") {
          rounds.push(processedRound);
          processedRound = { cardPicks: [], factionInfo: {}, objectives: [] };
          systems = new Set();
        }
        break;
      }
    }
  }
  if (processedRound.cardPicks.length > 0) {
    rounds.push(processedRound);
  }
  return rounds;
}
