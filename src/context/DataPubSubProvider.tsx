"use client";

import { PropsWithChildren, useEffect } from "react";
import stableHash from "stable-hash";
import { objectEntries } from "../util/util";
import { DataContext } from "./contexts";
import { DataStore } from "./dataStore";

type CallbackFn<DataType> = (data: DataType) => void;

interface Subscriber {
  callbackFn: CallbackFn<any>;
}

export default function DataPubSubProvider({ children }: PropsWithChildren) {
  const subscribers: Record<string, Record<string, Subscriber>> = {};
  let hashes: Record<string, string> = {};

  useEffect(() => {
    return DataStore.listen(() => {
      publish();
    });
  }, []);

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

  function subscribe(callback: CallbackFn<any>, path: string) {
    if (!subscribers) {
      return () => {};
    }
    let id = makeid(12);
    while (!!subscribers[id]) {
      id = makeid(12);
    }
    const subscribersPerPath = subscribers[path] ?? {};
    subscribersPerPath[id] = { callbackFn: callback };
    subscribers[path] = subscribersPerPath;

    if (!hashes[path]) {
      const value: any = DataStore.getValue(path);
      hashes[path] = stableHash(value);
    }

    return () => {
      const subscribersPerPath = subscribers[path] ?? {};
      delete subscribersPerPath[id];
      if (Object.values(subscribersPerPath).length === 0) {
        delete subscribers[path];
      } else {
        subscribers[path] = subscribersPerPath;
      }
    };
  }

  function publish() {
    const updatedHashes = structuredClone(hashes);
    for (const [path, subscribersPerPath] of objectEntries(subscribers)) {
      const value: any = DataStore.getValue(path);

      const valueHash = stableHash(value);
      const storedHash = hashes[path];

      if (storedHash && storedHash === valueHash) {
        continue;
      }
      updatedHashes[path] = valueHash;
      for (const subscriber of Object.values(subscribersPerPath)) {
        subscriber.callbackFn(structuredClone(value));
      }
    }
    hashes = updatedHashes;
  }

  return (
    <DataContext.Provider value={subscribe}>{children}</DataContext.Provider>
  );
}
