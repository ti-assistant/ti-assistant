import {
  DocumentData,
  DocumentReference,
  Transaction,
  getFirestore,
} from "firebase-admin/firestore";

import { Planet } from "../../src/util/api/planets";
import { ActionLogEntry, StoredGameData } from "../../src/util/api/util";
import { StrategyCard } from "../../src/util/api/cards";
import { Objective } from "../../src/util/api/objectives";
import { Attachment } from "../../src/util/api/attachments";
import { Agenda } from "../../src/util/api/agendas";
import { Component } from "../../src/util/api/components";
import { Faction } from "../../src/util/api/factions";
import { Relic } from "../../src/util/api/relics";
import {
  buildAgendas,
  buildAttachments,
  buildComponents,
  buildFactions,
  buildObjectives,
  buildPlanets,
  buildRelics,
  buildStrategyCards,
} from "../../src/data/GameData";
import { BASE_OPTIONS } from "../data/options";

/**
 * Returns the game data for a given game.
 */
export async function getGameData(gameId: string): Promise<StoredGameData> {
  const db = getFirestore();

  const gameRef = db.collection("games").doc(gameId);

  const game = await gameRef.get();

  const actionLog = await gameRef
    .collection("actionLog")
    .orderBy("timestampMillis", "desc")
    .get();

  if (!game.exists) {
    return {
      factions: {},
      options: BASE_OPTIONS,
      planets: {},
      state: {
        phase: "SETUP",
        speaker: "None",
        round: 1,
      },
    };
  }

  const actionLogEntries: ActionLogEntry[] = [];
  actionLog.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as ActionLogEntry;
    actionLogEntries.push(storedLogEntry);
  });

  return {
    ...(game.data() as StoredGameData),
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

  const actionLog = await t.get(
    gameRef.collection("actionLog").orderBy("timestampMillis", "desc")
  );

  const actionLogEntries: ActionLogEntry[] = [];
  actionLog.forEach((logEntry) => {
    const storedLogEntry = logEntry.data() as ActionLogEntry;
    actionLogEntries.push(storedLogEntry);
  });

  return {
    ...gameData,
    actionLog: actionLogEntries,
  };
}

export async function getTimers(gameId: string) {
  const db = getFirestore();

  const timersRef = db.collection("timers").doc(gameId);

  const timersDoc = await timersRef.get();

  if (!timersDoc.exists) {
    return {};
  }

  return timersDoc.data() as Record<string, number>;
}

export async function getTimersInTransaction(
  timersRef: DocumentReference<DocumentData>,
  t: Transaction
) {
  const timerData = await t.get(timersRef);
  if (!timerData.exists) {
    return {};
  }

  const timers = timerData.data() as Record<string, number>;

  return timers;
}

/**
 * Fetches the strategy cards associated with a game.
 */
export async function fetchStrategyCards(
  gameId: string
): Promise<Record<string, StrategyCard>> {
  const gameData = await getGameData(gameId);

  return buildStrategyCards(gameData);
}

/**
 * Fetches the objectives associated with a game.
 */
export async function fetchObjectives(
  gameId: string,
  secret: string
): Promise<Record<string, Objective>> {
  const gameData = await getGameData(gameId);

  return buildObjectives(gameData);
}

/**
 * Fetches the attachments associated with a game.
 */
export async function fetchAttachments(
  gameId: string
): Promise<Record<string, Attachment>> {
  const gameData = await getGameData(gameId);

  return buildAttachments(gameData);
}

/**
 * Fetches the planets associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} planets keyed by name.
 */
export async function fetchPlanets(
  gameId: string
): Promise<Record<string, Planet>> {
  const gameData = await getGameData(gameId);

  return buildPlanets(gameData);
}

/**
 * Fetches the agendas associated with a game.
 */
export async function fetchAgendas(
  gameId: string
): Promise<Record<string, Agenda>> {
  const gameData = await getGameData(gameId);

  return buildAgendas(gameData);
}

/**
 * Fetches the components associated with a game.
 */
export async function fetchComponents(
  gameId: string
): Promise<Record<string, Component>> {
  const db = getFirestore();

  const gameData = await getGameData(gameId);

  return buildComponents(gameData);
}

/**
 * Fetches the factions associated with a game.
 */
export async function fetchFactions(
  gameId: string
): Promise<Record<string, Faction>> {
  const gameData = await getGameData(gameId);

  return buildFactions(gameData);
}

/**
 * Fetches the relics associated with a game.
 */
export async function fetchRelics(
  gameId: string
): Promise<Record<string, Relic>> {
  const gameData = await getGameData(gameId);

  return buildRelics(gameData);
}
