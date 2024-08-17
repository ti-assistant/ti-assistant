"use client";

import { PropsWithChildren, useEffect } from "react";
import { useIntl } from "react-intl";
import { GameIdContext } from "./Context";
import DataManager from "./DataManager";

export default function DataProvider({
  children,
  gameId,
  seedData,
  seedTimers,
}: PropsWithChildren<{
  gameId: string;
  seedData: GameData;
  seedTimers: Record<string, number>;
}>) {
  const intl = useIntl();
  seedData.timers = seedTimers;

  DataManager.init(seedData, intl);

  useEffect(() => {
    DataManager.listen(gameId);
  }, [gameId]);

  // DataManager.init(seedData, intl, gameId);

  return (
    <GameIdContext.Provider value={gameId}>{children}</GameIdContext.Provider>
  );
}
