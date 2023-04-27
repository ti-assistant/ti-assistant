import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { StoredLogEntry } from "../../../server/util/write";
import { LogEntry } from "../../../src/util/api/gameLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422).send({ message: "Missing gameid" });
    return;
  }
  const db = getFirestore();

  const gameLogRef = await db
    .collection("games")
    .doc(gameId)
    .collection("gameLog")
    .orderBy("timestamp")
    .get();

  const logEntries: LogEntry[] = [];
  gameLogRef.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as StoredLogEntry;

    logEntries.push({
      ...storedLogEntry,
      time: storedLogEntry.timestamp.toMillis(),
    });
  });

  res.status(200).json(logEntries);
}
