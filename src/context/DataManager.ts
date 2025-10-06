import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { IntlShape } from "react-intl/src/types";
import stableHash from "stable-hash";
import { BASE_GAME_DATA } from "../../server/data/data";
import { getBaseData } from "../data/baseData";
import DBConnection from "../data/DBConnection";
import { buildCompleteGameData } from "../data/gameDataBuilder";
import { ActionLog, Optional } from "../util/types/types";

export default class DataManager {
  private static gameId: string;

  private static data: GameData;
  private static baseData: BaseData;
  private static storedData: StoredGameData;

  // Used to rollback in case of error.
  private static latestServerData: StoredGameData;

  // Used to know if the server is ahead of the client.
  private static lastLocalSequenceNum: number;

  private static archive: boolean;

  // Pub-sub functionality
  private static subscribers: Record<string, Subscriber>;
  private static hashes: Record<string, string>;

  public static init(
    gameId: string,
    data: GameData,
    intl: IntlShape,
    archive: boolean
  ) {
    this.gameId = gameId;
    this.archive = archive;
    this.data = data;
    this.baseData = getBaseData(intl);
    this.storedData = BASE_GAME_DATA;
    this.latestServerData = BASE_GAME_DATA;
    this.lastLocalSequenceNum = 0;
    this.subscribers = {};
    this.hashes = {};
  }

  public static getValue<Type>(path: string): Optional<Type> {
    if (!this.data) {
      return;
    }
    return getValueAtPath(this.data, path) as Type;
  }

  // Resets to the last data received from the server.
  public static reset() {
    if (!this) {
      return;
    }
    const viewOnly = this.data.viewOnly;
    this.storedData = structuredClone(this.latestServerData);
    this.data = buildCompleteGameData(this.storedData, this.baseData);

    this.data.viewOnly = viewOnly;
    this.data.gameId = this.gameId;

    this.lastLocalSequenceNum = this.storedData.sequenceNum;

    this.publish();
  }

  public static listen() {
    const db = DBConnection.get();

    const unlistenFns: Unsubscribe[] = [];

    const gameCollection = this.archive ? "archive" : "games";

    const actionLogQuery = query(
      collection(db, gameCollection, this.gameId, "actionLog"),
      orderBy("timestampMillis", "desc")
    );
    unlistenFns.push(
      onSnapshot(actionLogQuery, (querySnapshot) => {
        const actionLog: ActionLog = [];
        querySnapshot.forEach((doc) => {
          actionLog.push(doc.data() as ActionLogEntry<GameUpdateData>);
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
      onSnapshot(doc(db, gameCollection, this.gameId), (doc) => {
        const storedData = doc.data() as StoredGameData;

        const serverActionLog = this.latestServerData.actionLog ?? [];
        this.latestServerData = storedData;
        this.latestServerData.actionLog = serverActionLog;

        // If we are ahead of the server, don't update.
        if (this.storedData.sequenceNum > this.latestServerData.sequenceNum) {
          return;
        }

        const actionLog = this.storedData.actionLog ?? [];
        this.storedData = doc.data() as StoredGameData;
        this.storedData.actionLog = actionLog;

        const viewOnly = this.data.viewOnly;

        this.data = buildCompleteGameData(this.storedData, this.baseData);
        this.data.gameId = this.gameId;
        this.data.viewOnly = viewOnly;

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
    if (!this) {
      return;
    }
    this.storedData = structuredClone(updateFn(this.storedData));
    const viewOnly = this.data.viewOnly;
    this.data = buildCompleteGameData(this.storedData, this.baseData);
    this.data.gameId = this.gameId;
    this.data.viewOnly = viewOnly;

    this.lastLocalSequenceNum = this.storedData.sequenceNum;

    this.publish();
  }

  public static setViewOnly(viewOnly: boolean) {
    if (!this) {
      return;
    }
    this.data.viewOnly = viewOnly;
    this.publish();
  }

  public static subscribe(callback: CallbackFn<any>, path: string) {
    if (!this.subscribers) {
      return () => {};
    }
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

  private static publish() {
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
  if (path === "") {
    return currentData as Type;
  }
  let dataRef: any = currentData;
  for (const section of pathSections) {
    if (!dataRef[section]) {
      return undefined;
    }
    dataRef = dataRef[section];
  }
  return dataRef as Type;
}
