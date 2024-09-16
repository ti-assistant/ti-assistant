import fs from "fs";
import StatsPage from "./stats-page";
import { getFirestore } from "firebase-admin/firestore";
import { createIntlCache, createIntl } from "react-intl";
import { getLocale, getMessages } from "../../src/util/server";
import { buildCompleteGameData } from "../../src/data/GameData";
import { getFullActionLog } from "../../server/util/fetch";

export default async function Page({}) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);

  // const gamesRef = db.collection("games");

  // const timersRef = db.collection("timers");

  // const allGames = await gamesRef.get();

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

  let completedGames: Record<string, StoredGameData> = {};
  // if (latestTime < yesterday) {
  //   console.log("Writing file");
  //   const db = getFirestore();
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
  completedGames = JSON.parse(
    fs.readFileSync("./server/completed-games.json", "utf8")
  );
  // }

  // const actionLogs: Record<string, ActionLogEntry[]> = JSON.parse(
  //   fs.readFileSync("./action-logs.json", "utf8")
  // );

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

  // try {
  //   fs.writeFileSync("./action-logs.json", JSON.stringify(actionLogs));
  //   // file written successfully
  // } catch (err) {
  //   console.error(err);
  // }

  // const totalGameData: Record<string, GameData> = {};
  // Object.entries(completedGames).forEach(([gameId, data]) => {
  //   totalGameData[gameId] = buildCompleteGameData(data, intl);
  // });

  // TODO: Figure out what to do with action logs.
  const actionLogs: Record<string, ActionLogEntry[]> = {};
  return <StatsPage completedGames={completedGames} actionLogs={actionLogs} />;
}
