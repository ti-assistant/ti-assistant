import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  generateSessionId,
  getGamePassword,
} from "../../../../server/util/fetch";
import {
  getSessionIdFromCookie,
  hashPassword,
  setSessionIdCookie,
} from "../../../../src/util/server";

interface EnterPasswordData {
  password: string;
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const data = (await req.json()) as EnterPasswordData;
  const password = data.password;

  const gamePass = await getGamePassword(gameId);

  if (!gamePass) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 404,
    });
  }

  const hashedPassword = hashPassword(password);

  if (hashedPassword !== gamePass) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 403,
    });
  }

  const db = getFirestore();

  let sessionId = getSessionIdFromCookie();
  const sessionDeleteDate = new Date();
  sessionDeleteDate.setDate(sessionDeleteDate.getDate() + 14);
  if (!sessionId) {
    sessionId = generateSessionId();
    setSessionIdCookie(sessionId);
    await db.collection("sessions").doc(sessionId).set({
      deleteAt: sessionDeleteDate,
    });
  }
  await db
    .collection("sessions")
    .doc(sessionId)
    .update({
      games: FieldValue.arrayUnion(gameId),
      deleteAt: sessionDeleteDate,
    });

  return NextResponse.json({ viewOnly: false });
}
