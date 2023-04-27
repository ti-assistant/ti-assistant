import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { Phase } from "../../src/util/api/state";
import { GameData } from "../../src/util/api/util";
import { getGameData } from "./fetch";

export interface StoredLogEntry {
  activeFaction?: string;
  timestamp: Timestamp;
  gameSeconds?: number;
  phase?: Phase;
  [key: string]: any;
}

function buildLogEntry(dataToWrite: Object, gameData: Partial<GameData>) {
  const logEntry: StoredLogEntry = {
    ...dataToWrite,
    timestamp: Timestamp.now(),
  };

  if (!gameData.state) {
    return logEntry;
  }

  logEntry.phase = gameData.state.phase;
  if (gameData.state.phase === "ACTION") {
    if (gameData.state.activeplayer) {
      logEntry.activeFaction = gameData.state.activeplayer;
    }
  }

  if (gameData.timers && gameData.timers.game) {
    logEntry.gameSeconds = gameData.timers.game;
  }

  return logEntry;
}

/**
 * Writes an object to the gameLog.
 */
export async function writeLogEntry(gameId: string, dataToWrite: any) {
  const db = getFirestore();

  const gameData = await getGameData(gameId);

  const logEntry = buildLogEntry(dataToWrite, gameData);

  await db.collection("games").doc(gameId).collection("gameLog").add(logEntry);
}
