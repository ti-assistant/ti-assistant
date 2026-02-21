"use client";

import { PropsWithChildren } from "react";
import stableHash from "stable-hash";
import { buildCompleteGameData } from "../data/gameDataBuilder";
import { poster } from "../util/api/util";
import { Optional } from "../util/types/types";
import { objectEntries } from "../util/util";
import {
  DatabaseFns,
  DatabaseFnsContext,
  UpdateFn,
  UpdateSource,
} from "./contexts";

type CallbackFn<DataType> = (data: DataType) => void;

interface Subscriber {
  callbackFn: CallbackFn<any>;
}

interface Database {
  gameId: Optional<string>;
  data: Optional<GameData>;
  baseData: BaseData;
  storedData: Optional<StoredGameData>;
  latestServerData: Optional<StoredGameData>;
  lastLocalSequenceNum: number;
  // Helper values
  listeners: Record<string, () => void>;
  subscribers: Record<string, Record<string, Subscriber>>;
  hashes: Record<string, string>;
}

interface PopulatedDatabase {
  gameId: string;
  data: GameData;
  baseData: BaseData;
  storedData: StoredGameData;
  latestServerData: StoredGameData;
  lastLocalSequenceNum: number;
  // Helper values
  listeners: Record<string, () => void>;
  subscribers: Record<string, Record<string, Subscriber>>;
  hashes: Record<string, string>;
}

function buildDatabaseFns(database: Database): DatabaseFns {
  function publish() {
    const updatedHashes = structuredClone(database.hashes);
    for (const [path, subscribers] of objectEntries(database.subscribers)) {
      const value = getValueAtPath(path, database.data);
      const valueHash = stableHash(value);
      const storedHash = updatedHashes[path];

      if (storedHash && storedHash === valueHash) {
        continue;
      }
      updatedHashes[path] = valueHash;
      for (const subscriber of Object.values(subscribers)) {
        subscriber.callbackFn(structuredClone(value));
      }
    }
    database.hashes = updatedHashes;
  }

  function getBaseDataValueAtPath<Type>(path: string, data: BaseData) {
    const pathSections = path.split(".");
    if (path === "") {
      return data as Type;
    }
    let dataRef: any = data;
    for (const section of pathSections) {
      if (!dataRef[section]) {
        return undefined;
      }
      dataRef = dataRef[section];
    }
    return dataRef as Type;
  }

  function getValueAtPath<Type>(path: string, data: Optional<GameData>) {
    if (!data) {
      return;
    }
    const pathSections = path.split(".");
    if (path === "") {
      return data as Type;
    }
    let dataRef: any = data;
    for (const section of pathSections) {
      if (!dataRef[section]) {
        return undefined;
      }
      dataRef = dataRef[section];
    }
    return dataRef as Type;
  }

  function isInitialized(database: Database): database is PopulatedDatabase {
    return !!database.data;
  }

  const fns: DatabaseFns = {
    initialize: (gameId: string, gameData: StoredGameData) => {
      database.gameId = gameId;

      database.storedData = gameData;
      database.latestServerData = gameData;

      database.data = buildCompleteGameData(
        database.storedData,
        database.baseData,
      );
      database.lastLocalSequenceNum = 0;
    },
    listen: (callback: () => void) => {
      const id = makeUniqueId(database.listeners, 12);
      database.listeners[id] = callback;
      return () => {
        delete database.listeners[id];
      };
    },
    subscribe: (callbackFn: CallbackFn<any>, path: string) => {
      const existingSubscribers = database.subscribers[path] ?? {};
      const id = makeUniqueId(existingSubscribers, 12);
      existingSubscribers[id] = { callbackFn };
      database.subscribers[path] = existingSubscribers;

      if (!database.hashes[path]) {
        const value = getValueAtPath(path, database.data);
        database.hashes[path] = stableHash(value);
      }

      return () => {
        const existingSubscribers = database.subscribers[path] ?? {};
        delete existingSubscribers[id];
        if (Object.values(existingSubscribers).length === 0) {
          delete database.subscribers[path];
        } else {
          database.subscribers[path] = existingSubscribers;
        }
      };
    },
    reset: () => {
      if (!isInitialized(database)) {
        return;
      }
      const viewOnly = database.data.viewOnly;
      database.storedData = structuredClone(database.latestServerData);
      database.data = buildCompleteGameData(
        database.storedData,
        database.baseData,
      );

      database.data.viewOnly = viewOnly;
      database.data.gameId = database.gameId;

      database.lastLocalSequenceNum = database.storedData.sequenceNum;

      publish();
    },
    getValue: (path: string) => {
      return getValueAtPath(path, database.data);
    },
    getBaseValue: (path: string) => {
      return getBaseDataValueAtPath(path, database.baseData);
    },
    update: (updateFn: UpdateFn<StoredGameData>, source: UpdateSource) => {
      if (!isInitialized(database)) {
        return;
      }
      if (source === "SERVER") {
        database.latestServerData = structuredClone(
          updateFn(database.latestServerData),
        );

        if (
          database.lastLocalSequenceNum > database.latestServerData.sequenceNum
        ) {
          return;
        }

        database.storedData = structuredClone(database.storedData);
        const viewOnly = database.data.viewOnly;
        database.data = buildCompleteGameData(
          database.storedData,
          database.baseData,
        );
        database.data.gameId = database.gameId;
        database.data.viewOnly = viewOnly;
      } else {
        database.storedData = structuredClone(updateFn(database.storedData));

        const viewOnly = database.data.viewOnly;
        database.data = buildCompleteGameData(
          database.storedData,
          database.baseData,
        );
        database.data.gameId = database.gameId;
        database.data.viewOnly = viewOnly;

        database.lastLocalSequenceNum = database.storedData.sequenceNum;
      }

      publish();
    },
    setViewOnly: (value: boolean) => {
      if (!isInitialized(database)) {
        return;
      }
      database.data.viewOnly = value;
      publish();
    },
    saveTimers: () => {
      if (!isInitialized(database)) {
        return;
      }
      if (!database.data.timers) {
        return;
      }
      const timerUpdateData: TimerUpdateData = {
        timers: database.data.timers,
      };

      const now = Date.now();
      poster(`/api/${database.gameId}/timerUpdate`, timerUpdateData, now, 0);
    },
  };

  return fns;
}

// TODO: Move to shared location.
function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function makeUniqueId(record: Record<string, any>, length: number) {
  let id = makeId(length);
  while (!!record[id]) {
    id = makeId(length);
  }
  return id;
}

export default function DataStore({
  baseData,
  children,
}: PropsWithChildren<{ baseData: BaseData }>) {
  const database: Database = {
    // Data
    gameId: undefined,
    data: undefined,
    baseData,
    storedData: undefined,
    latestServerData: undefined,
    lastLocalSequenceNum: 0,
    listeners: {},
    subscribers: {},
    hashes: {},
  };
  const fns = buildDatabaseFns(database);

  return (
    <DatabaseFnsContext.Provider value={fns}>
      {children}
    </DatabaseFnsContext.Provider>
  );
}
