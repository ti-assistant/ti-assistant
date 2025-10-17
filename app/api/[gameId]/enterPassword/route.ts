import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  getGamePassword,
  getSession,
  TIASession,
} from "../../../../server/util/fetch";
import {
  getSessionIdFromCookie,
  hashPassword,
  setSessionIdCookie,
} from "../../../../src/util/server";
import { Optional } from "../../../../src/util/types/types";

interface EnterPasswordData {
  password: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

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

  let sessionId = await getSessionIdFromCookie();
  let session: Optional<TIASession>;
  if (sessionId) {
    session = await getSession(sessionId);
  }
  const sessionDeleteDate = new Date();
  sessionDeleteDate.setDate(sessionDeleteDate.getDate() + 14);
  if (!sessionId || !session) {
    const result = await db.collection("sessions").add({
      deleteAt: sessionDeleteDate,
    });
    sessionId = result.id;
    setSessionIdCookie(sessionId);
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
