"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { useEffect } from "react";
import { DataStore } from "../../src/context/dataStore";
import DBConnection from "../../src/data/DBConnection";
import { ActionLog } from "../../src/util/types/types";
import { objectEntries, objectKeys } from "../util/util";

export default function DBListener({
  gameId,
  archive,
}: {
  gameId: string;
  archive: boolean;
}) {
  useEffect(() => {
    const db = DBConnection.get();

    const unlistenFns: Unsubscribe[] = [];

    const gameCollection = archive ? "archive" : "games";
    const timerCollection = archive ? "archiveTimers" : "timers";

    const actionLogQuery = query(
      collection(db, gameCollection, gameId, "actionLog"),
      orderBy("timestampMillis", "desc")
    );
    unlistenFns.push(
      onSnapshot(actionLogQuery, (querySnapshot) => {
        const actionLog: ActionLog = [];
        querySnapshot.forEach((doc) => {
          actionLog.push(doc.data() as ActionLogEntry<GameUpdateData>);
        });

        DataStore.update((storedData) => {
          storedData.actionLog = actionLog;
          return storedData;
        }, "SERVER");
      })
    );

    unlistenFns.push(
      onSnapshot(doc(db, timerCollection, gameId), (doc) => {
        const storedTimers = doc.data() as Timers;

        DataStore.update((storedData) => {
          if ((storedData.timers?.game ?? 0) > (storedTimers.game ?? 0)) {
            return storedData;
          }
          storedData.timers = storedTimers;
          return storedData;
        }, "SERVER");
      })
    );

    unlistenFns.push(
      onSnapshot(doc(db, gameCollection, gameId), (doc) => {
        const storedData = doc.data() as StoredGameData;

        DataStore.update((oldData) => {
          const actionLog = oldData.actionLog ?? [];
          const timers = oldData.timers ?? {};
          const newData = structuredClone(storedData);
          newData.actionLog = actionLog;
          newData.timers = timers;
          return newData;
        }, "SERVER");
      })
    );
    return () => {
      for (const unlistenFn of unlistenFns) {
        unlistenFn();
      }
    };
  }, [archive, gameId]);

  return null;
}
