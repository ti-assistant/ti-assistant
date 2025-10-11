import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  canEditGame,
  getTimersInTransaction,
} from "../../../../server/util/fetch";

interface SetPauseData {
  paused: boolean;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const canEdit = await canEditGame(gameId);
  if (!canEdit) {
    return new Response("Not authorized", {
      status: 403,
    });
  }

  const db = getFirestore();

  const timerRef = db.collection("timers").doc(gameId);

  try {
    await db.runTransaction(async (t) => {
      // Ensure that game exists.
      await getTimersInTransaction(timerRef, t);

      const data = (await req.json()) as SetPauseData;

      t.update(timerRef, {
        paused: data.paused ?? FieldValue.delete(),
      });
    });
  } catch (e) {
    console.log("Transaction failed");
  }

  return NextResponse.json({});
}
