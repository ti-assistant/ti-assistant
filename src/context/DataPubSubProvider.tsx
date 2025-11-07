"use client";

import { PropsWithChildren, useEffect } from "react";
import stableHash from "stable-hash";
import { objectEntries, objectKeys } from "../util/util";
import { DataContext } from "./contexts";
import { DataStore } from "./dataStore";

type CallbackFn<DataType> = (data: DataType) => void;

type MultiCallbackFn = (dataValues: any[]) => void;

interface Subscriber {
  callbackFn: CallbackFn<any>;
}

interface MultiSubscriber {
  callbackFn: MultiCallbackFn;
}

export default function DataPubSubProvider({ children }: PropsWithChildren) {
  const subscribers: Record<string, Record<string, Subscriber>> = {};
  const multiSubscribers: Record<string, Record<string, MultiSubscriber>> = {};
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

  function multiSubscribe(callback: MultiCallbackFn, paths: string[]) {
    if (!multiSubscribers) {
      return () => {};
    }
    let id = makeid(12);
    while (!!subscribers[id]) {
      id = makeid(12);
    }
    const pathString = paths.join("|");
    const subscribersPerPath = multiSubscribers[pathString] ?? {};
    subscribersPerPath[id] = { callbackFn: callback };
    multiSubscribers[pathString] = subscribersPerPath;

    for (const path of paths) {
      if (!hashes[path]) {
        hashes[path] = stableHash(DataStore.getValue(path));
      }
    }

    return () => {
      const subscribersPerPath = multiSubscribers[pathString] ?? {};
      delete subscribersPerPath[id];
      if (Object.values(subscribersPerPath).length === 0) {
        delete subscribers[pathString];
      } else {
        subscribers[pathString] = subscribersPerPath;
      }
    };
  }

  function publish() {
    const startTime = Date.now();
    const updatedHashes = structuredClone(hashes);
    console.log("Number of Subscribers", objectKeys(subscribers).length);
    for (const [path, subscribersPerPath] of objectEntries(subscribers)) {
      const innerStartTime = Date.now();
      const value: any = DataStore.getValue(path);

      const valueHash = stableHash(value);
      const storedHash = hashes[path];

      if (storedHash && storedHash === valueHash) {
        console.log("Inner time %d ms", Date.now() - innerStartTime);
        continue;
      }
      updatedHashes[path] = valueHash;

      console.log(
        "Num subs %d at path %s",
        objectKeys(subscribersPerPath).length,
        path
      );
      for (const subscriber of Object.values(subscribersPerPath)) {
        const finalStartTime = Date.now();
        subscriber.callbackFn(structuredClone(value));
        console.log("Resulting time %d ms", Date.now() - finalStartTime);
      }
      console.log("Inner time %d ms", Date.now() - innerStartTime);
    }

    // for (const [pathString, subscribersPerPath] of objectEntries(
    //   multiSubscribers
    // )) {
    //   const paths = pathString.split("|");

    //   const values = [];
    //   let hasChanges = false;
    //   for (const path of paths) {
    //     const value = DataStore.getValue(path);
    //     values.push(value);

    //     const valueHash = stableHash(value);
    //     const storedHash = hashes[path];
    //     if (storedHash && storedHash === valueHash) {
    //       continue;
    //     }
    //     updatedHashes[path] = valueHash;
    //     hasChanges = true;
    //   }

    //   if (!hasChanges) {
    //     continue;
    //   }

    //   for (const subscriber of Object.values(subscribersPerPath)) {
    //     subscriber.callbackFn(structuredClone(values));
    //   }
    // }
    hashes = updatedHashes;
    console.log("Time taken %d milliseconds", Date.now() - startTime);
  }

  return (
    <DataContext.Provider value={subscribe}>{children}</DataContext.Provider>
  );
}
