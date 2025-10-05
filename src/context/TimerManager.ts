import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import stableHash from "stable-hash";
import DBConnection from "../data/DBConnection";
import { poster } from "../util/api/util";
import { Optional } from "../util/types/types";

export default class TimerManager {
  private static gameId: string;

  private static timers: Timers;
  private static activeTimers: Set<string>;
  private static lastIncrease: number;

  // Used to rollback in case of error.
  private static latestServerData: Timers;

  private static archive: boolean;

  public static init(gameId: string, timers: Timers, archive: boolean) {
    this.gameId = gameId;
    this.archive = archive;
    this.timers = timers;
    this.latestServerData = timers;
    this.activeTimers = new Set();
    this.lastIncrease = Date.now();
    this.subscribers = {};
    this.hashes = {};
  }

  public static getValue<Type>(path: string): Optional<Type> {
    return getValueAtPath(this.timers, path) as Type;
  }

  // Resets to the last data received from the server.
  public static reset() {
    this.timers = this.latestServerData;

    this.publish();
  }

  private static tick() {
    if (this.timers.paused) {
      return;
    }

    const updatedTimers = structuredClone(this.timers);

    const currentTimestamp = Date.now();
    let timeDiffSeconds = currentTimestamp - this.lastIncrease;

    if (timeDiffSeconds / 1000 > 1) {
      this.lastIncrease = currentTimestamp;
      for (const timer of this.activeTimers) {
        const prevTimer = updatedTimers[timer] ?? 0;
        updatedTimers[timer] = prevTimer + 1;
      }
    }

    this.timers = updatedTimers;
    this.publish();
  }

  private static saveToServer() {
    const data: TimerUpdateData = {
      timers: this.timers,
    };

    const now = Date.now();
    const timerPromise = poster(
      `/api/${TimerManager.gameId}/timerUpdate`,
      data,
      now
    );

    return timerPromise;
  }

  public static activateTimer(timer: string) {
    this.activeTimers.add(timer);
  }
  public static deactivateTimer(timer: string) {
    this.activeTimers.delete(timer);
  }

  public static listen() {
    console.log("Listen called");
    const db = DBConnection.get();

    const timeoutIds: NodeJS.Timeout[] = [];
    const unlistenFns: Unsubscribe[] = [];

    timeoutIds.push(setInterval(this.tick.bind(this), 100));
    timeoutIds.push(setInterval(this.saveToServer.bind(this), 5000));

    const timerCollection = this.archive ? "archiveTimers" : "timers";

    unlistenFns.push(
      onSnapshot(doc(db, timerCollection, this.gameId), (doc) => {
        const storedTimers = doc.data() as Timers;
        // console.log("TimerManager - Server listen", storedTimers);

        this.latestServerData = storedTimers;

        let localTimers = structuredClone(this.timers);
        if ((localTimers.game ?? 0) < (storedTimers.game ?? 0)) {
          localTimers = structuredClone(storedTimers);
        }
        localTimers.paused = storedTimers.paused;

        this.timers = localTimers;

        this.publish();
      })
    );

    return () => {
      console.log("Listen cleaned up");
      for (const unlistenFn of unlistenFns) {
        unlistenFn();
      }
      for (const clearId of timeoutIds) {
        clearInterval(clearId);
      }
    };
  }

  public static update(updateFn: (timers: Timers) => Timers) {
    this.timers = structuredClone(updateFn(this.timers));

    this.publish();
  }

  // Pub-sub functionality
  private static subscribers: Record<string, Subscriber>;
  private static hashes: Record<string, string>;

  public static subscribe(callback: CallbackFn<any>, path: string) {
    let id = makeid(12);
    while (!!this.subscribers[id]) {
      id = makeid(12);
    }
    this.subscribers[id] = {
      callbackFn: callback,
      path,
    };

    if (!this.hashes[path]) {
      this.hashes[path] = stableHash(getValueAtPath(this.timers, path));
    }

    return () => {
      delete this.subscribers[id];
    };
  }

  private static publish() {
    const updatedHashes = structuredClone(this.hashes);
    for (const subscriber of Object.values(this.subscribers)) {
      const value = getValueAtPath(this.timers, subscriber.path);

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

function getValueAtPath<Type>(currentData: Timers, path: string) {
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
