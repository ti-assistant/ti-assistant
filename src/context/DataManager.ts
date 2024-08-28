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

// interface HandlerType<Data> {
//   new (gameData: StoredGameData, data: Data): Handler;
// }

function hasMatchingTimestamp(timestamp: number, log: ActionLogEntry[]) {
  for (const entry of log) {
    if (entry.timestampMillis === timestamp) {
      return true;
    }
  }
  return false;
}

// function logsEqual(serverLog: ActionLogEntry[], clientLog: ActionLogEntry[]) {
//   let localServerLog = structuredClone(serverLog);
//   let localClientLog = structuredClone(clientLog);
//   while (localServerLog.length > localClientLog.length) {
//     localServerLog.pop();
//   }
//   while (localClientLog.length > localServerLog.length) {
//     localClientLog.pop();
//   }
//   return stableHash(localClientLog) === stableHash(localServerLog);
// }

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

  public static get() {
    return this.instance;
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

  // public static update<Data>(handlerType: HandlerType<Data>, data: Data) {
  //   if (!this.instance) {
  //     return;
  //   }
  //   this.instance.updateData(handlerType, data);
  // }

  // private updateData<Data>(handlerType: HandlerType<Data>, data: Data) {
  //   const handler = new handlerType(this.storedData, data);

  //   updateGameData(this.storedData, handler.getUpdates());
  //   updateActionLog(this.storedData, handler);
  // }

  private data: GameData;
  private baseData: BaseData;
  private storedData: StoredGameData;

  private latestServerData: StoredGameData;
  private lastLocalSequenceNum: number;
  private lastServerSequenceNum: number;

  public value() {
    return structuredClone(this.data);
  }

  private constructor(data: GameData, intl: IntlShape) {
    this.data = data;
    this.baseData = getBaseData(intl);
    this.storedData = BASE_GAME_DATA;
    this.latestServerData = BASE_GAME_DATA;
    this.lastLocalSequenceNum = 0;
    this.lastServerSequenceNum = 0;
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
        // Check for updates to entries that we currently have.
        // let forceUpdate = false;
        // for (const change of querySnapshot.docChanges()) {
        //   if (change.type === "modified" || change.type === "removed") {
        //     if (
        //       hasMatchingTimestamp(
        //         change.doc.data().timestampMillis as number,
        //         this.storedData.actionLog ?? []
        //       )
        //     ) {
        //       forceUpdate = true;
        //       break;
        //     }
        //   }
        // }

        const actionLog: ActionLogEntry[] = [];
        querySnapshot.forEach((doc) => {
          actionLog.push(doc.data() as ActionLogEntry);
        });

        this.latestServerData.actionLog = actionLog;

        // If we are ahead of the server, don't update.
        if (this.lastLocalSequenceNum > this.latestServerData.sequenceNum) {
          return;
        }

        // const latestTimestamp = actionLog[0]?.timestampMillis ?? 0;
        // if (
        //   !forceUpdate &&
        //   latestTimestamp < (this.storedData.lastUpdate ?? 0)
        // ) {
        //   return;
        // }

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

  // private update(updateData: StoredGameData, timestamp: number) {
  //   this.storedData.lastUpdate = timestamp;
  //   this.storedData = updateData;
  //   this.data = buildCompleteGameData(this.storedData, this.baseData);

  //   this.publish();
  // }

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

  protected publish() {
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

// interface Subscriber {
//   callbackFn: CallbackFn<any>;
//   factionId: FactionId;
// }

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
