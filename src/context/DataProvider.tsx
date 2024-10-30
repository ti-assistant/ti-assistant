"use client";

import { PropsWithChildren, useEffect } from "react";
import { useIntl } from "react-intl";
import { GameIdContext } from "./Context";
import DataManager from "./DataManager";

export default function DataProvider({
  archive = false,
  children,
  gameId,
  seedData,
  seedTimers,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  seedData: GameData;
  seedTimers: Record<string, number>;
}>) {
  const intl = useIntl();
  seedData.timers = seedTimers;

  DataManager.init(gameId, seedData, intl, archive);

  useEffect(() => {
    return DataManager.listen(gameId);
  }, [gameId]);

  return (
    <GameIdContext.Provider value={gameId}>{children}</GameIdContext.Provider>
  );
}
