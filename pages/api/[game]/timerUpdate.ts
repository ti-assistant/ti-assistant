import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { TimerUpdateData } from "../../../src/util/api/timers";
import { getTimers, getTimersInTransaction } from "../../../server/util/fetch";

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

  const timersRef = db.collection("timers").doc(gameId);

  try {
    await db.runTransaction(async (t) => {
      const timers = await getTimersInTransaction(timersRef, t);

      if (!data.timestamp) {
        res.status(422).send({ message: "Missing info" });
        return;
      }

      switch (data.action) {
        case "SET_GAME_TIMER": {
          if (data.timer == undefined) {
            res.status(422).send({ message: "Missing info" });
            return;
          }
          const timer = timers.game ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              game: data.timer,
            });
          }
          break;
        }
        case "SAVE_FACTION_TIMER": {
          if (data.timer == undefined || !data.faction) {
            res.status(422).send({ message: "Missing info" });
            return;
          }
          const timer = timers[data.faction] ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              [data.faction]: data.timer,
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
            (data.agendaNum ?? 1) === 1 ? "firstAgenda" : "secondAgenda";
          const timer = timers[timerName] ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              [timerName]: data.timer,
            });
          }
          break;
        }
        case "RESET_AGENDA_TIMERS": {
          t.update(timersRef, {
            firstAgenda: FieldValue.delete(),
            secondAgenda: FieldValue.delete(),
          });
          break;
        }
      }
    });
  } catch (e) {
    console.log("Transaction failed", e);
  }

  const storedTimers = await getTimers(gameId);

  return res.status(200).json(storedTimers);
}
