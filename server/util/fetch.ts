import {
  DocumentData,
  DocumentReference,
  Transaction,
  getFirestore,
} from "firebase-admin/firestore";

import crypto from "crypto";
import {
  PHASE_BOUNDARIES,
  TURN_BOUNDARIES,
} from "../../src/util/api/actionLog";
import { getSessionIdFromCookie } from "../../src/util/server";
import { ActionLog, Optional } from "../../src/util/types/types";
import { BASE_OPTIONS } from "../data/options";

/**
 * Returns the game data for a given game.
 */
export async function getGameData(gameId: string): Promise<StoredGameData> {
  const db = getFirestore();

  const gameRef = db.collection("games").doc(gameId);

  const game = await gameRef.get();

  if (!game.exists) {
    return {
      factions: {},
      options: BASE_OPTIONS,
      planets: {},
      state: {
        phase: "SETUP",
        speaker: "Vuil'raith Cabal",
        round: 1,
      },
      sequenceNum: 1,
    };
  }

  const gameData = game.data() as StoredGameData;

  const phaseOrTurnBoundaries =
    gameData.state.phase === "AGENDA" || gameData.state.phase === "STRATEGY"
      ? PHASE_BOUNDARIES
      : TURN_BOUNDARIES;

  const phaseBoundary = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .where("data.action", "in", phaseOrTurnBoundaries)
    .limit(1)
    .get();

  let firstTimestamp = 0;
  phaseBoundary.forEach((logEntry) => {
    firstTimestamp = (logEntry.data() as ActionLogEntry<GameUpdateData>)
      .timestampMillis;
  });

  const actionLog = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .where("timestampMillis", ">=", firstTimestamp)
    .get();

  const actionLogEntries: ActionLog = [];
  actionLog.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as ActionLogEntry<GameUpdateData>;
    actionLogEntries.push(storedLogEntry);
  });

  return {
    ...gameData,
    actionLog: actionLogEntries,
  };
}

export async function getArchivedGameData(
  gameId: string
): Promise<StoredGameData> {
  const db = getFirestore();

  const gameRef = db.collection("archive").doc(gameId);

  const game = await gameRef.get();

  if (!game.exists) {
    return {
      factions: {},
      options: BASE_OPTIONS,
      planets: {},
      state: {
        phase: "SETUP",
        speaker: "Vuil'raith Cabal",
        round: 1,
      },
      sequenceNum: 1,
    };
  }

  const gameData = game.data() as StoredGameData;

  const phaseOrTurnBoundaries =
    gameData.state.phase === "AGENDA" || gameData.state.phase === "STRATEGY"
      ? PHASE_BOUNDARIES
      : TURN_BOUNDARIES;

  const phaseBoundary = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .where("data.action", "in", phaseOrTurnBoundaries)
    .limit(1)
    .get();

  let firstTimestamp = 0;
  phaseBoundary.forEach((logEntry) => {
    firstTimestamp = (logEntry.data() as ActionLogEntry<GameUpdateData>)
      .timestampMillis;
  });

  const actionLog = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .where("timestampMillis", ">=", firstTimestamp)
    .get();

  const actionLogEntries: ActionLog = [];
  actionLog.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as ActionLogEntry<GameUpdateData>;
    actionLogEntries.push(storedLogEntry);
  });

  return {
    ...gameData,
    actionLog: actionLogEntries,
  };
}

export async function getGameDataInTransaction(
  gameRef: DocumentReference<DocumentData>,
  t: Transaction
) {
  const game = await t.get(gameRef);
  if (!game.exists) {
    throw new Error("Missing game");
  }

  const gameData = game.data() as StoredGameData;

  return gameData;
}

export async function getCurrentTurnLogEntriesInTransaction(
  gameRef: DocumentReference<DocumentData>,
  t: Transaction
) {
  const turnBoundary = await t.get(
    gameRef
      .collection("actionLog")
      .orderBy("timestampMillis", "desc")
      .where("data.action", "in", TURN_BOUNDARIES)
      .limit(1)
  );

  let timestamp = 0;
  turnBoundary.forEach((logEntry) => {
    timestamp = (logEntry.data() as ActionLogEntry<GameUpdateData>)
      .timestampMillis;
  });

  const currentTurn = await t.get(
    gameRef
      .collection("actionLog")
      .orderBy("timestampMillis", "desc")
      .where("timestampMillis", ">=", timestamp)
  );

  const currentTurnEntries: ActionLog = [];
  currentTurn.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as ActionLogEntry<GameUpdateData>;
    currentTurnEntries.push(storedLogEntry);
  });

  return currentTurnEntries;
}

export async function getLatestActionLogEntryInTransaction(
  gameRef: DocumentReference<DocumentData>,
  t: Transaction
) {
  const logEntry = await t.get(
    gameRef.collection("actionLog").orderBy("timestampMillis", "desc").limit(1)
  );
  if (logEntry.empty) {
    return undefined;
  }

  let latestEntry: Optional<ActionLogEntry<GameUpdateData>>;
  logEntry.forEach((entry) => {
    latestEntry = entry.data() as ActionLogEntry<GameUpdateData>;
  });

  return latestEntry;
}

export async function getFullActionLog(gameId: string) {
  const db = getFirestore();

  const gameRef = db.collection("games").doc(gameId);
  const logEntry = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .get();

  if (logEntry.empty) {
    return [];
  }

  let actionLog: ActionLog = [];
  logEntry.forEach((entry) => {
    actionLog.push(entry.data() as ActionLogEntry<GameUpdateData>);
  });

  return actionLog;
}

export async function getFullArchivedActionLog(gameId: string) {
  const db = getFirestore();

  const gameRef = db.collection("archive").doc(gameId);
  const logEntry = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .get();

  if (logEntry.empty) {
    return [];
  }

  let actionLog: ActionLog = [];
  logEntry.forEach((entry) => {
    actionLog.push(entry.data() as ActionLogEntry<GameUpdateData>);
  });

  return actionLog;
}

export async function getTimers(gameId: string) {
  const db = getFirestore();

  const timersRef = db.collection("timers").doc(gameId);

  const timersDoc = await timersRef.get();

  if (!timersDoc.exists) {
    return {};
  }

  const timers = timersDoc.data() as Timers;

  delete timers.deleteAt;

  return timers;
}

export async function getTimersInTransaction(
  timersRef: DocumentReference<DocumentData>,
  t: Transaction
) {
  const timerData = await t.get(timersRef);
  if (!timerData.exists) {
    return {};
  }

  const timers = timerData.data() as Timers;

  delete timers.deleteAt;

  return timers;
}

export async function getArchivedTimers(gameId: string) {
  const db = getFirestore();

  const timersRef = db.collection("archiveTimers").doc(gameId);

  const timersDoc = await timersRef.get();

  if (!timersDoc.exists) {
    return {};
  }

  const timers = timersDoc.data() as Timers;

  delete timers.deleteAt;

  return timers;
}

export interface TIASession {
  games?: string[];
}

export async function getSession(
  sessionId: string
): Promise<Optional<TIASession>> {
  const db = getFirestore();

  const sessionRef = db.collection("sessions").doc(sessionId);

  const sessionDoc = await sessionRef.get();

  if (!sessionDoc.exists) {
    return undefined;
  }

  const session = sessionDoc.data() as TIASession & { deleteAt: any };

  delete session.deleteAt;

  return session;
}

export async function getGamePassword(gameId: string) {
  const db = getFirestore();

  const passwordRef = db.collection("passwords").doc(gameId);
  const passwordDoc = await passwordRef.get();
  if (!passwordDoc.exists) {
    return undefined;
  }

  const password = passwordDoc.data() as { password: string; deleteAt: any };

  delete password.deleteAt;

  return password.password;
}

export function generateSessionId() {
  return crypto.randomBytes(16).toString("base64");
}

export async function canEditGame(gameId: string) {
  const password = await getGamePassword(gameId);

  if (!password) {
    return true;
  }

  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) {
    return false;
  }

  const session = await getSession(sessionId);
  if (!session) {
    return false;
  }
  return (session.games ?? []).includes(gameId);
}
