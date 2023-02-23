import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { TimerUpdateData } from "../../../src/util/api/timers";
import { GameData } from "../../../src/util/api/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }
  const data = req.body as TimerUpdateData;

  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  if (!data.timestamp) {
    res.status(422);
    return;
  }

  const timestampString = `updates.timers.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "SET_GAME_TIMER": {
      if (data.timer == undefined) {
        res.status(422);
        return;
      }
      const timer = (gameData.timers ?? {}).game ?? 0;
      if (data.timer > timer) {
        await db
          .collection("games")
          .doc(gameId)
          .update({
            "timers.game": data.timer,
            [timestampString]: timestamp,
          });
      }
      break;
    }
    case "SAVE_FACTION_TIMER": {
      if (data.timer == undefined || !data.faction) {
        res.status(422);
        return;
      }
      const timer = (gameData.timers ?? {})[data.faction] ?? 0;
      if (data.timer > timer) {
        const factionString = `timers.${data.faction}`;
        await db
          .collection("games")
          .doc(gameId)
          .update({
            [factionString]: data.timer,
            [timestampString]: timestamp,
          });
      }
      break;
    }
    case "SAVE_AGENDA_TIMER": {
      if (data.timer == undefined) {
        res.status(422);
        return;
      }
      const timerName =
        (gameData.state.agendaNum ?? 1) === 1 ? "firstAgenda" : "secondAgenda";
      const timer = (gameData.timers ?? {})[timerName] ?? 0;
      if (data.timer > timer) {
        const timerString = `timers.${timerName}`;
        await db
          .collection("games")
          .doc(gameId)
          .update({
            [timerString]: data.timer,
            [timestampString]: timestamp,
          });
      }
      break;
    }
    case "RESET_AGENDA_TIMERS": {
      const timerOneString = `timers.firstAgenda`;
      const timerTwoString = `timers.secondAgenda`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [timerOneString]: 0,
          [timerTwoString]: 0,
          [timestampString]: timestamp,
        });
      break;
    }
  }

  const responseRef = await db.collection("games").doc(gameId).get();

  const responseData = responseRef.data() as GameData;

  return res.status(200).json(responseData.timers ?? {});
}
