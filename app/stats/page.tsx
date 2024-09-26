import fs from "fs";
import StatsPage, { ProcessedLog, ProcessedRound } from "./stats-page";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { createIntlCache, createIntl } from "react-intl";
import { getLocale, getMessages } from "../../src/util/server";
import { buildCompleteGameData } from "../../src/data/GameData";
import { getFullActionLog, getTimers } from "../../server/util/fetch";
import { getBaseData } from "../../src/data/baseData";
import { isCompletedGame, ProcessedGame, processGame } from "./processor";

function processLog(baseData: BaseData, actionLog: ActionLogEntry[]) {
  const processedLog: ProcessedLog = {
    rounds: [],
  };
  let systems = new Set<SystemId>();
  let processedRound: ProcessedRound = {
    cardPicks: [],
    planetsTaken: {},
    planetsLost: {},
  };
  for (const logEntry of actionLog) {
    switch (logEntry.data.action) {
      case "ASSIGN_STRATEGY_CARD":
        processedRound.cardPicks.push({
          card: logEntry.data.event.id,
          faction: logEntry.data.event.assignedTo,
        });
        break;
      case "CLAIM_PLANET":
        if (logEntry.data.event.prevOwner) {
          const planet = baseData.planets[logEntry.data.event.planet];
          const system = planet.system;
          // Only count a system 1 time in a turn.
          if (system && systems.has(system)) {
            break;
          }
          if (system) {
            systems.add(system);
          }
          // TODO: Consider making home planets count more.
          let factionAgg = processedRound.planetsTaken[
            logEntry.data.event.faction
          ] ?? {
            home: 0,
            all: 0,
            mecatol: 0,
          };
          let factionDef = processedRound.planetsLost[
            logEntry.data.event.prevOwner
          ] ?? { home: 0, all: 0, mecatol: 0 };
          factionAgg.all++;
          factionDef.all++;
          if (planet.home) {
            factionAgg.home++;
            factionDef.home++;
          }
          if (planet.id === "Mecatol Rex") {
            factionAgg.mecatol++;
            factionDef.mecatol++;
          }
          processedRound.planetsTaken[logEntry.data.event.faction] = factionAgg;
          processedRound.planetsLost[logEntry.data.event.prevOwner] =
            factionDef;
        }
        break;
      case "END_TURN":
        systems = new Set();
        break;
      case "ADVANCE_PHASE":
        if (logEntry.data.event.state?.phase === "STATUS") {
          processedLog.rounds.push(processedRound);
          processedRound = { cardPicks: [], planetsTaken: {}, planetsLost: {} };
          systems = new Set();
        }
        break;
    }
  }
  if (processedRound.cardPicks.length > 0) {
    processedLog.rounds.push(processedRound);
  }
  return processedLog;
}

export default async function Page({}) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);
  // const db = getFirestore();

  // const gamesRef = db.collection("games");

  // const timersRef = db.collection("timers");

  // const gameData = await gamesRef.get();

  // let allGames: Record<string, StoredGameData> = {};
  // gameData.forEach((val) => {
  //   allGames[val.id] = val.data() as StoredGameData;
  //   //   const gameId = val.id;
  //   //   const game = val.data() as StoredGameData;
  //   //   const log = actionLogs[gameId] ?? [];
  //   //   const isCompleted = isCompletedGame(game, baseData, log);
  //   //   if (!isCompleted) {
  //   //     console.log("Uncompleted game", gameId);
  //   //   }
  //   //   const processedGame = processGame(game, baseData, log, { game: 24 });
  //   // }
  // });

  const baseData = getBaseData(intl);
  const processedGames: Record<string, ProcessedGame> = JSON.parse(
    fs.readFileSync("./server/processed-games.json", "utf8")
  );
  // let count = 0;
  // // const processedGames: Record<string, ProcessedGame> = {};
  // for (const [gameId, game] of Object.entries(allGames)) {
  //   console.log("Processing Game", gameId);
  //   const actionLog = await getFullActionLog(gameId);
  //   if (!isCompletedGame(game, baseData, actionLog)) {
  //     continue;
  //   }
  //   const timers = await getTimers(gameId);
  //   const processedGame = processGame(game, baseData, actionLog, timers);
  //   if (!processedGame) {
  //     console.log("Couldn't process game.", gameId);
  //     continue;
  //   }
  //   processedGames[gameId] = processedGame;

  //   if (game.deleteAt) {
  //     console.log("Clearing delete at", gameId);
  //     db.collection("games")
  //       .doc(gameId)
  //       .update({ deleteAt: FieldValue.delete() });
  //   }

  //   try {
  //     db.collection("processed").doc(gameId).set(processedGame);
  //   } catch (err) {
  //     console.log("Error in game", gameId);
  //     console.log("Data", processedGame);
  //     for (const round of processedGame.rounds) {
  //       console.log("Round", round);
  //     }
  //     break;
  //   }
  // }

  // try {
  //   fs.writeFileSync(
  //     "./server/processed-games.json",
  //     JSON.stringify(processedGames)
  //   );
  //   // file written successfully
  // } catch (err) {
  //   console.error(err);
  // }

  // console.log("Fully processed");
  // return null;

  // const timersById: Record<string, Timers> = {};
  // const allTimers = await timersRef.get();
  // allTimers.forEach((timer) => {
  //   if (!timer.data().game || timer.data().game < 7200) {
  //     return;
  //   }
  //   timersById[timer.id] = timer.data();
  // });

  // console.log(timersById);

  // const yesterday = new Date();
  // yesterday.setDate(yesterday.getDate() - 1);
  // let latestTime: Date;
  // try {
  //   latestTime = fs.statSync("./server/completed-games.json").mtime;
  // } catch (err) {
  //   latestTime = new Date("1970-01-01");
  // }

  // let completedGames: Record<string, StoredGameData> = {};
  // if (latestTime < yesterday) {
  //   console.log("Writing file");
  //   const gamesRef = db.collection("games");

  //   const timersRef = db.collection("timers");

  //   const allGames = await gamesRef.get();

  //   const timersById: Record<string, Timers> = {};
  //   const allTimers = await timersRef.get();
  //   allTimers.forEach((timer) => {
  //     if (!timer.data().game || timer.data().game < 7200) {
  //       return;
  //     }
  //     timersById[timer.id] = timer.data();
  //   });

  //   const reducedGames: Record<string, StoredGameData> = {};
  //   allGames.forEach((game) => {
  //     const data = game.data() as StoredGameData;
  //     if (data.state.phase !== "END") {
  //       return;
  //     }
  //     if (!data.deleteAt && timersById[game.id]) {
  //       data.timers = timersById[game.id];
  //       reducedGames[game.id] = data;
  //     }
  //     if (timersById[game.id]) {
  //       data.timers = timersById[game.id];
  //       reducedGames[game.id] = data;
  //     }
  //   });

  //   completedGames = structuredClone(reducedGames);
  //   try {
  //     fs.writeFileSync(
  //       "./server/completed-games.json",
  //       JSON.stringify(reducedGames)
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  // } else {
  // const completedGames: Record<string, StoredGameData> = {};
  // completedGames = JSON.parse(
  //   fs.readFileSync("./server/completed-games.json", "utf8")
  // );
  // }

  // const actionLogs: Record<string, ActionLogEntry[]> = JSON.parse(
  //   fs.readFileSync("./action-logs.json", "utf8")
  // );

  // for (const [gameId, game] of Object.entries(completedGames)) {
  //   const log = actionLogs[gameId] ?? [];
  //   const isCompleted = isCompletedGame(game, baseData, log);
  //   if (!isCompleted) {
  //     console.log("Uncompleted game", gameId);
  //   }
  //   const processedGame = processGame(game, baseData, log, { game: 24 });
  // }

  // const processedLogs: Record<string, ProcessedLog> = JSON.parse(
  //   fs.readFileSync("./server/processed-logs.json", "utf8")
  // );

  // const processedLogs: Record<string, ProcessedLog> = {};
  // Object.entries(actionLogs).forEach(([gameId, actionLog]) => {
  //   const processedLog = processLog(baseData, actionLog.toReversed());
  //   processedLogs[gameId] = processedLog;
  // });

  // console.log("Log", processLog(actionLogs["n5L5Vz"] as ActionLogEntry[]));

  // const actionLogs: Record<string, ActionLogEntry[]> = {};

  // const myAsyncLoopFunction = async (array: string[]) => {
  //   for (const gameId of array) {
  //     actionLogs[gameId] = await getFullActionLog(gameId);
  //     console.log("Read game", gameId);
  //   }
  // };

  // await myAsyncLoopFunction(Object.keys(completedGames));
  // console.log("Done reading games");

  // let reducedGames: Record<string, any> = {};
  // allGames.forEach((game) => {
  //   const data = game.data() as StoredGameData;
  //   if (data.state.phase !== "END") {
  //     return;
  //   }
  //   if (!data.deleteAt && timersById[game.id]) {
  //     data.timers = timersById[game.id];
  //     completedGames[game.id] = data;
  //   }
  //   if (timersById[game.id]) {
  //     data.timers = timersById[game.id];
  //     completedGames[game.id] = data;
  //   }
  // });

  // const totalGameData: Record<string, GameData> = {};
  // Object.entries(completedGames).forEach(([gameId, data]) => {
  //   totalGameData[gameId] = buildCompleteGameData(data, intl);
  // });

  // TODO: Figure out what to do with action logs.
  // const actionLogs: Record<string, ActionLogEntry[]> = {};
  return <StatsPage processedGames={processedGames} baseData={baseData} />;
}
