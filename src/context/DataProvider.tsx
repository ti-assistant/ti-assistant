"use client";

import { PropsWithChildren, useEffect } from "react";
import { useIntl } from "react-intl";
import DataManager from "./DataManager";
import { Optional } from "../util/types/types";
import TimerManager from "./TimerManager";

export default function DataProvider({
  archive = false,
  children,
  gameId,
  seedData,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  sessionId: Optional<string>;
  seedData: GameData;
}>) {
  const intl = useIntl();

  DataManager.init(gameId, seedData, intl, archive);
  TimerManager.init(gameId, seedData.timers ?? {}, archive);

  useEffect(() => {
    return DataManager.listen();
  }, []);

  useEffect(() => {
    return TimerManager.listen();
  }, []);

  return <>{children}</>;
}
