import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { IntlShape } from "react-intl/src/types";
import stableHash from "stable-hash";
import { BASE_GAME_DATA } from "../../server/data/data";
import { getBaseData } from "../data/baseData";
import DBConnection from "../data/DBConnection";
import { buildCompleteGameData } from "../data/gameDataBuilder";

export default class DataManager {
  private static gameId: string;
  private static instance: DataManager;

  public static init(gameId: string, data: GameData, intl: IntlShape) {
    const shouldOverride =
      !this.instance ||
      this.gameId !== gameId ||
      this.instance.data.sequenceNum < data.sequenceNum;
    if (shouldOverride) {
      this.gameId = gameId;
      this.instance = new DataManager(data, intl);
    }
    return this.instance;
  }

  public static listen(gameId: string) {
    if (!this.instance) {
      throw new Error("init must be called before listen");
    }
    return this.instance.listen(gameId);
  }

  public static getValue<Type>(path: string): Type | undefined {
    if (!this.instance) {
      return undefined;
    }
    return getValueAtPath(this.instance.data, path) as Type;
  }

  public static subscribe(callback: CallbackFn<any>, path: string) {
    if (!this.instance) {
      return () => {};
    }
    return this.instance.subscribe(callback, path);
  }

  // Resets to the last data received from the server.
  public static reset() {
    if (!this.instance) {
      return;
    }
    this.instance.storedData = structuredClone(this.instance.latestServerData);
    this.instance.data = buildCompleteGameData(
      this.instance.storedData,
      this.instance.baseData
    );

    this.instance.lastLocalSequenceNum = this.instance.storedData.sequenceNum;

    this.instance.publish();
  }

  private data: GameData;
  private baseData: BaseData;
  private storedData: StoredGameData;

  // Used to rollback in case of error.
  private latestServerData: StoredGameData;

  // Used to know if the server is ahead of the client.
  private lastLocalSequenceNum: number;

  private constructor(data: GameData, intl: IntlShape) {
    this.data = data;
    this.baseData = getBaseData(intl);
    this.storedData = BASE_GAME_DATA;
    this.latestServerData = BASE_GAME_DATA;
    this.lastLocalSequenceNum = 0;
  }

  private listen(gameId: string) {
    const db = DBConnection.get();

    const unlistenFns: Unsubscribe[] = [];

    const actionLogQuery = query(
      collection(db, "games", gameId, "actionLog"),
      orderBy("timestampMillis", "desc")
    );
    unlistenFns.push(
      onSnapshot(actionLogQuery, (querySnapshot) => {
        const actionLog: ActionLogEntry[] = [];
        querySnapshot.forEach((doc) => {
          actionLog.push(doc.data() as ActionLogEntry);
        });

        this.latestServerData.actionLog = actionLog;

        // If we are ahead of the server, don't update.
        if (this.lastLocalSequenceNum > this.latestServerData.sequenceNum) {
          return;
        }

        this.storedData.actionLog = actionLog;
        this.data.actionLog = actionLog;

        this.publish();
      })
    );

    unlistenFns.push(
      onSnapshot(doc(db, "timers", gameId), (doc) => {
        const storedTimers = doc.data() as Record<string, number>;

        this.latestServerData.timers = storedTimers;

        this.storedData.timers = storedTimers;
        this.data.timers = storedTimers;

        this.publish();
      })
    );

    unlistenFns.push(
      onSnapshot(doc(db, "games", gameId), (doc) => {
        const storedData = doc.data() as StoredGameData;

        const serverActionLog = this.latestServerData.actionLog ?? [];
        const serverTimers = this.latestServerData.timers ?? {};
        this.latestServerData = storedData;
        this.latestServerData.actionLog = serverActionLog;
        this.latestServerData.timers = serverTimers;

        // If we are ahead of the server, don't update.
        if (this.storedData.sequenceNum > this.latestServerData.sequenceNum) {
          return;
        }

        const actionLog = this.storedData.actionLog ?? [];
        const timers = this.storedData.timers ?? {};
        this.storedData = doc.data() as StoredGameData;
        this.storedData.actionLog = actionLog;
        this.storedData.timers = timers;

        this.data = buildCompleteGameData(this.storedData, this.baseData);

        this.publish();
      })
    );

    return () => {
      for (const unlistenFn of unlistenFns) {
        unlistenFn();
      }
    };
  }

  public static update(
    updateFn: (storedGameData: StoredGameData) => StoredGameData
  ) {
    if (!this.instance) {
      return;
    }
    this.instance.storedData = structuredClone(
      updateFn(this.instance.storedData)
    );
    this.instance.data = buildCompleteGameData(
      this.instance.storedData,
      this.instance.baseData
    );

    this.instance.lastLocalSequenceNum = this.instance.storedData.sequenceNum;

    this.instance.publish();
  }

  // Pub-sub functionality
  private subscribers: Record<string, Subscriber> = {};
  private hashes: Record<string, string> = {};

  private subscribe(callback: CallbackFn<any>, path: string) {
    let id = makeid(12);
    while (!!this.subscribers[id]) {
      id = makeid(12);
    }
    this.subscribers[id] = {
      callbackFn: callback,
      path,
    };

    if (!this.hashes[path]) {
      this.hashes[path] = stableHash(getValueAtPath(this.data, path));
    }

    return () => {
      delete this.subscribers[id];
    };
  }

  private publish() {
    const updatedHashes = structuredClone(this.hashes);
    for (const subscriber of Object.values(this.subscribers)) {
      const value = getValueAtPath(this.data, subscriber.path);

      const valueHash = stableHash(value);
      const storedHash = this.hashes[subscriber.path];

      if (!storedHash || storedHash !== valueHash) {
        subscriber.callbackFn(structuredClone(value));
        updatedHashes[subscriber.path] = valueHash;
      }
    }
    this.hashes = updatedHashes;
  }
}

export function useGameDataValue<Type>(path: string, defaultValue: Type): Type {
  const [value, setValue] = useState<Type>(
    DataManager.getValue(path) ?? defaultValue
  );

  useEffect(() => {
    return DataManager.subscribe(setValue, path);
  }, [path]);

  return value;
}

function makeid(length: number) {
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

type CallbackFn<DataType> = (data: DataType) => void;

interface Subscriber {
  callbackFn: CallbackFn<any>;
  path: string;
}

function getValueAtPath<Type>(currentData: GameData, path: string) {
  const pathSections = path.split(".");
  let dataRef: any = currentData;
  for (const section of pathSections) {
    if (!dataRef[section]) {
      return undefined;
    }
    dataRef = dataRef[section];
  }
  return dataRef as Type;
}
