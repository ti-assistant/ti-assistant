import { Storage } from "@google-cloud/storage";
import { getFirestore, Timestamp, WriteResult } from "firebase-admin/firestore";
import { Readable } from "stream";
import { getFullActionLog, getTimers } from "../../../server/util/fetch";
import { getBaseData } from "../../../src/data/baseData";
import { buildCompleteObjectives } from "../../../src/data/gameDataBuilder";
import { getHandler } from "../../../src/util/api/gameLog";
import { updateGameData } from "../../../src/util/api/handler";
import { getOppositeHandler } from "../../../src/util/api/opposite";
import { updateActionLog } from "../../../src/util/api/update";
import { computeVPs } from "../../../src/util/factions";
import { EndGameHandler } from "../../../src/util/model/endGame";
import { getIntl } from "../../../src/util/server";
import { ActionLog, Optional } from "../../../src/util/types/types";
import { objectEntries, objectKeys } from "../../../src/util/util";

export interface ProcessedGame {
  // Tags
  isMapGame: boolean;
  isObjectiveGame: boolean;
  isPlanetGame: boolean;
  isTechGame: boolean;
  isTimedGame: boolean;

  // Filter data
  victoryPoints: number;
  playerCount: number;
  expansions: Expansion[];
  events?: EventId[];

  winner: FactionId;
  rounds: ProcessedRound[];
  factions: Partial<Record<FactionId, GameFactionInfo>>;
  gameTime: number;
  objectives: Partial<Record<ObjectiveId, ObjectiveInfo>>;

  timestampMillis: number;
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
  const objectives = buildCompleteObjectives(baseData, game);
  return objectKeys(game.factions).reduce((prev, factionId) => {
    const points = computeVPs(game.factions, factionId, objectives);
    if (points >= game.options["victory-points"]) {
      return true;
    }
    return prev;
  }, false);
}

export function isCompletedGame(
  game: StoredGameData,
  baseData: BaseData,
  log: ActionLog,
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
  storage: Storage,
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export async function rewriteProcessedGames() {
  const locale = "en";

  const intlPromise = getIntl(locale);
  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const processedGamesPromise = getJSONFileFromStorage(storage);

  const [intl, processedGames] = await Promise.all([
    intlPromise,
    processedGamesPromise,
  ]);

  const baseData = getBaseData(intl);
  return maybeUpdateProcessedGames(storage, processedGames, baseData);
}

const REFRESH_TIME = 86400000;

export async function maybeUpdateProcessedGames(
  storage: Storage,
  processedGames: Record<string, ProcessedGame>,
  baseData: BaseData,
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

  const deleteDate = new Date();
  deleteDate.setDate(deleteDate.getDate() + 30);

  const db = getFirestore();

  const gamesRef = db.collection("games");

  const gameData = await gamesRef.get();

  let allGames: Record<string, StoredGameData> = {};
  gameData.forEach((val) => {
    allGames[val.id] = val.data() as StoredGameData;
  });

  for (const [gameId, game] of Object.entries(allGames)) {
    if (!!processedGames[gameId]) {
      continue;
    }
    const actionLog = await getFullActionLog(gameId, "games");
    if (!isCompletedGame(game, baseData, actionLog)) {
      continue;
    }
    const fixedGame = fixGame(game, baseData, actionLog);
    if (!fixedGame) {
      continue;
    }
    const timers = await getTimers(gameId, "timers");
    const processedGame = processGame(
      structuredClone(fixedGame),
      baseData,
      timers,
    );
    if (!processedGame) {
      continue;
    }
    processedGames[gameId] = processedGame;
    await archiveGame(structuredClone(fixedGame), gameId, timers);

    db.collection("games")
      .doc(gameId)
      .update({ deleteAt: Timestamp.fromDate(deleteDate) });

    db.collection("timers")
      .doc(gameId)
      .update({ deleteAt: Timestamp.fromDate(deleteDate) });
  }

  const file = storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json");

  const stream = new Readable();
  stream.pipe(file.createWriteStream());

  stream.push(JSON.stringify(processedGames));
  stream.push(null);
}

export async function reprocessGames() {
  const locale = "en";
  const intlPromise = getIntl(locale);

  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const processedGamesPromise = getJSONFileFromStorage(storage);

  const db = getFirestore();

  const gamesRef = db.collection("archive");

  const gameDataPromise = gamesRef.get();

  const [intl, processedGames, gameData] = await Promise.all([
    intlPromise,
    processedGamesPromise,
    gameDataPromise,
  ]);

  const baseData = getBaseData(intl);

  let allGames: Record<string, StoredGameData> = {};
  gameData.forEach((val) => {
    allGames[val.id] = val.data() as StoredGameData;
  });

  for (const [gameId, game] of Object.entries(allGames)) {
    const actionLog = await getFullActionLog(gameId, "archive");
    if (!isCompletedGame(game, baseData, actionLog)) {
      continue;
    }
    const fixedGame = fixGame(game, baseData, actionLog);
    if (!fixedGame) {
      continue;
    }
    const timers = await getTimers(gameId, "archiveTimers");
    const processedGame = processGame(
      structuredClone(fixedGame),
      baseData,
      timers,
    );
    if (!processedGame) {
      continue;
    }
    processedGames[gameId] = processedGame;
  }

  const file = storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json");

  const stream = new Readable();
  stream.pipe(file.createWriteStream());

  stream.push(JSON.stringify(processedGames));
  stream.push(null);
}

export async function processOneGame(gameId: string) {
  const db = getFirestore();

  const gamesRef = db.collection("games").doc(gameId);

  const gameData = await gamesRef.get();
  const actionLog = await getFullActionLog(gameId, "games");
  const locale = "en";

  const intl = await getIntl(locale);
  const baseData = getBaseData(intl);
  const game = gameData.data() as StoredGameData;
  if (!isCompletedGame(game, baseData, actionLog)) {
    console.log("Not completed");
    return;
  }
  const fixedGame = fixGame(game, baseData, actionLog);
  if (!fixedGame) {
    console.log("Couldn't fix game");
    return;
  }
  console.log("Fixed log", fixedGame.actionLog[fixedGame.actionLog.length - 1]);
  const timers = await getTimers(gameId, "timers");
  const processedGame = processGame(
    structuredClone(fixedGame),
    baseData,
    timers,
  );
  console.log("Processed", processedGame);
  return;
}

function processGame(
  fixedGame: StoredGameData,
  baseData: BaseData,
  timers: Timers,
): Optional<ProcessedGame> {
  let winner: FactionId = "Vuil'raith Cabal";
  let maxPoints = 0;
  const factionInfo: Partial<Record<FactionId, GameFactionInfo>> = {};
  const objectives = buildCompleteObjectives(baseData, fixedGame);
  for (const [factionId, faction] of objectEntries(fixedGame.factions)) {
    const points = computeVPs(fixedGame.factions, factionId, objectives);
    if (points > maxPoints) {
      winner = factionId;
      maxPoints = points;
    }
    const startingTechs = faction.startswith?.techs ?? [];
    const endingTechs = objectKeys(faction.techs);
    factionInfo[factionId] = {
      points,
      startingTechs,
      endingTechs,
    };
  }

  const objectiveInfo: Partial<Record<ObjectiveId, ObjectiveInfo>> = {};
  for (const [objectiveId, objective] of objectEntries(
    fixedGame.objectives ?? {},
  )) {
    const baseObjective = baseData.objectives[objectiveId];
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
    objectiveInfo[objectiveId] = {
      scorers: objective.scorers ?? [],
    };
  }

  const fixedActionLog = fixedGame.actionLog ?? [];
  const firstTimestamp =
    fixedActionLog[fixedActionLog.length - 1]?.timestampMillis ?? 0;

  const output: ProcessedGame = {
    isMapGame: fixedGame.options["map-string"] !== "",
    isObjectiveGame: isObjectiveGame(fixedGame, baseData),
    isPlanetGame: isPlanetGame(fixedGame),
    isTechGame: isTechGame(fixedGame),
    isTimedGame: (timers.game ?? 0) !== 0,

    victoryPoints: fixedGame.options["victory-points"],
    playerCount: Object.keys(fixedGame.factions).length,
    expansions: fixedGame.options.expansions,
    events: fixedGame.options.events ?? [],

    winner,
    rounds: processLog(fixedGame, baseData, fixedActionLog),
    factions: factionInfo,
    gameTime: timers.game ?? 0,
    objectives: objectiveInfo,

    timestampMillis: firstTimestamp,
  };
  return output;
}

function isObjectiveGame(game: StoredGameData, baseData: BaseData) {
  const foundTypes = new Set<ObjectiveType>();
  const baseObjectives = baseData.objectives;
  for (const faction of Object.values(game.factions)) {
    if ((faction.vps ?? 0) > 3) {
      return false;
    }
  }
  return objectEntries(game.objectives ?? {}).reduce(
    (isObjGame, [id, curr]) => {
      if ((curr.scorers ?? []).length !== 0) {
        const type = baseObjectives[id].type;
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
    false,
  );
}

function isPlanetGame(game: StoredGameData) {
  return Object.keys(game.planets).length > 30;
}

function isTechGame(game: StoredGameData) {
  return Object.values(game.factions).reduce((isTechGame, faction) => {
    for (const techId of objectKeys(faction.techs)) {
      if (!(faction.startswith?.techs ?? []).includes(techId)) {
        return isTechGame;
      }
    }
    return false;
  }, true);
}

// Rewinds game in place so that the last action is the correct last action
// of the game. If more than 20 steps are rewound, considers the game unfinished.
function rewindGame(game: StoredGameData, baseData: BaseData, log: ActionLog) {
  let maxPoints = game.options["victory-points"];
  const objectives = buildCompleteObjectives(baseData, game);
  for (const factionId of objectKeys(game.factions)) {
    const points = computeVPs(game.factions, factionId, objectives);
    if (points > maxPoints) {
      maxPoints = points;
    }
  }

  const output = structuredClone(game);
  output.actionLog = structuredClone(log);
  const originalVPs = output.options["victory-points"];
  output.options["victory-points"] = maxPoints;

  let finalEntry;
  let numSteps = 0;
  let lastEntry: Optional<ActionLogEntry<GameUpdateData>>;
  while (numSteps < 20 && hasWinningFaction(output, baseData)) {
    numSteps++;
    lastEntry = output.actionLog[0];
    if (!lastEntry) {
      break;
    }
    if (!finalEntry) {
      finalEntry = lastEntry;
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
    updateActionLog(output, handler, Date.now(), lastEntry.gameSeconds ?? 0);
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
  updateActionLog(
    output,
    handler,
    lastEntry.timestampMillis,
    lastEntry.gameSeconds ?? 0,
  );

  (output.actionLog[0] as ActionLogEntry<GameUpdateData>).gameSeconds =
    lastEntry.gameSeconds;

  const endGameHandler = new EndGameHandler(output, {
    action: "END_GAME",
    event: {},
  });
  updateGameData(output, endGameHandler.getUpdates());
  updateActionLog(
    output,
    endGameHandler,
    finalEntry?.timestampMillis ?? Date.now(),
    finalEntry?.gameSeconds ?? 0,
  );

  output.options["victory-points"] = originalVPs;
  (output.actionLog[0] as ActionLogEntry<GameUpdateData>).gameSeconds =
    finalEntry?.gameSeconds;

  return output;
}

function processLog(game: StoredGameData, baseData: BaseData, log: ActionLog) {
  const objectives = buildCompleteObjectives(baseData, game);
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

function fixGame(game: StoredGameData, baseData: BaseData, log: ActionLog) {
  const fixedGame = rewindGame(game, baseData, log);
  if (!fixedGame) {
    return;
  }

  const objectives = buildCompleteObjectives(baseData, fixedGame);
  let maxPoints = 0;
  for (const factionId of objectKeys(fixedGame.factions)) {
    delete fixedGame.factions[factionId]?.playerName;
    const points = computeVPs(fixedGame.factions, factionId, objectives);
    if (points > maxPoints) {
      maxPoints = points;
    }
  }

  // Adjust victory-points if needed.
  const lastAction: Optional<ActionLogEntry<GameUpdateData>> =
    (fixedGame.actionLog ?? [])[1];
  switch (lastAction?.data.action) {
    case "SELECT_ACTION":
      if (
        lastAction.data.event.action === "Imperial" ||
        lastAction.data.event.action === "Aeterna"
      ) {
        fixedGame.options["victory-points"] = maxPoints;
        break;
      }
      return;
    case "SCORE_OBJECTIVE":
      const points =
        baseData.objectives[lastAction.data.event.objective].points;
      if (
        points === 2 &&
        maxPoints === fixedGame.options["victory-points"] + 1
      ) {
        fixedGame.options["victory-points"] = maxPoints - 1;
      } else {
        fixedGame.options["victory-points"] = maxPoints;
      }
      break;
    case "MANUAL_VP_UPDATE":
      fixedGame.options["victory-points"] = maxPoints;
      break;
    case "GAIN_RELIC":
      if (lastAction.data.event.relic === "Shard of the Throne") {
        fixedGame.options["victory-points"] = maxPoints;
        break;
      }
      return;
  }

  return fixedGame;
}

async function archiveGame(
  fixedGame: StoredGameData,
  gameId: string,
  timers: Timers,
) {
  const actionLog = fixedGame.actionLog ?? [];
  delete fixedGame.actionLog;

  const db = getFirestore();
  try {
    db.collection("archive").doc(gameId).set(fixedGame);
  } catch (err) {
    console.log("Error", err);
    return;
  }

  try {
    // Clear all old action log entries.
    // Uncomment when needing to re-write the action logs.
    // const oldActionLog = await db
    //   .collection("archive")
    //   .doc(gameId)
    //   .collection("actionLog")
    //   .get();
    // const promises: Promise<WriteResult>[] = [];
    // oldActionLog.forEach(async (entry) => {
    //   promises.push(
    //     db
    //       .collection("archive")
    //       .doc(gameId)
    //       .collection("actionLog")
    //       .doc(entry.id)
    //       .delete()
    //   );
    // });
    // await Promise.all(promises);
    const count = await db
      .collection("archive")
      .doc(gameId)
      .collection("actionLog")
      .count()
      .get();
    if (count.data().count === 0) {
      for (const logEntry of actionLog) {
        delete logEntry.deleteAt;
        db.collection("archive")
          .doc(gameId)
          .collection("actionLog")
          .add(logEntry);
      }
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }

  try {
    db.collection("archiveTimers").doc(gameId).set(timers);
  } catch (err) {
    console.log("Error", err);
    return;
  }
}
