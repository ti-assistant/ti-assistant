"use client";

import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { use, useEffect } from "react";
import DBConnection from "../../src/data/DBConnection";
import { ActionLog } from "../../src/util/types/types";
import { DatabaseFnsContext } from "./contexts";

export default function DBListener({
  gameId,
  archive,
}: {
  gameId: string;
  archive: boolean;
}) {
  const databaseFns = use(DatabaseFnsContext);

  useEffect(() => {
    const db = DBConnection.get();

    const unlistenFns: Unsubscribe[] = [];

    const gameCollection = archive ? "archive" : "games";
    const timerCollection = archive ? "archiveTimers" : "timers";

    const actionLogQuery = query(
      collection(db, gameCollection, gameId, "actionLog"),
      orderBy("timestampMillis", "desc"),
      limit(10000),
    );
    unlistenFns.push(
      onSnapshot(actionLogQuery, (querySnapshot) => {
        const actionLog: ActionLog = [];
        querySnapshot.forEach((doc) => {
          actionLog.push(doc.data() as ActionLogEntry<GameUpdateData>);
        });

        databaseFns.update((storedData) => {
          storedData.actionLog = actionLog;
          return storedData;
        }, "SERVER");
      }),
    );

    unlistenFns.push(
      onSnapshot(doc(db, timerCollection, gameId), (doc) => {
        const storedTimers = doc.data() as Timers;

        databaseFns.update((storedData) => {
          if ((storedData.timers?.game ?? 0) > (storedTimers.game ?? 0)) {
            return storedData;
          }
          storedData.timers = storedTimers;
          return storedData;
        }, "SERVER");
      }),
    );

    unlistenFns.push(
      onSnapshot(doc(db, gameCollection, gameId), (doc) => {
        const storedData = doc.data() as StoredGameData;

        databaseFns.update((oldData) => {
          const actionLog = oldData.actionLog ?? [];
          const timers = oldData.timers ?? {};
          const newData = structuredClone(storedData);
          newData.actionLog = actionLog;
          newData.timers = timers;
          return newData;
        }, "SERVER");
      }),
    );
    return () => {
      for (const unlistenFn of unlistenFns) {
        unlistenFn();
      }
    };
  }, [archive, gameId]);

  return null;
}
