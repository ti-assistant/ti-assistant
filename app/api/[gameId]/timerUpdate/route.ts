import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  getTimers,
  getTimersInTransaction,
} from "../../../../server/util/fetch";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const data = (await req.json()) as TimerUpdateData;

  const db = getFirestore();

  const timersRef = db.collection("timers").doc(gameId);

  try {
    await db.runTransaction(async (t) => {
      const timers = await getTimersInTransaction(timersRef, t);

      if (!data.timestamp) {
        return new Response("Missing info", {
          status: 422,
        });
      }

      switch (data.action) {
        case "SET_GAME_TIMER": {
          if (data.timer == undefined) {
            return new Response("Missing info", {
              status: 422,
            });
          }
          const timer = timers.game ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              game: data.timer,
              lastUpdate: data.timestamp,
            });
          }
          break;
        }
        case "SAVE_FACTION_TIMER": {
          if (data.timer == undefined || !data.faction) {
            return new Response("Missing info", {
              status: 422,
            });
          }
          const timer = timers[data.faction] ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              [data.faction]: data.timer,
              lastUpdate: data.timestamp,
            });
          }
          break;
        }
        case "SAVE_AGENDA_TIMER": {
          if (data.timer == undefined) {
            return new Response("Missing info", {
              status: 422,
            });
          }
          const timerName =
            (data.agendaNum ?? 1) === 1 ? "firstAgenda" : "secondAgenda";
          const timer = timers[timerName] ?? 0;
          if (data.timer > timer) {
            t.update(timersRef, {
              [timerName]: data.timer,
              lastUpdate: data.timestamp,
            });
          }
          break;
        }
        case "RESET_AGENDA_TIMERS": {
          t.update(timersRef, {
            firstAgenda: FieldValue.delete(),
            secondAgenda: FieldValue.delete(),
            lastUpdate: data.timestamp,
          });
          break;
        }
      }
    });
  } catch (e) {
    console.log("Transaction failed", e);
  }

  const storedTimers = await getTimers(gameId);

  return NextResponse.json(storedTimers);
}
