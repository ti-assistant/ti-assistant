"use client";

import { PropsWithChildren, use } from "react";
import { DatabaseFnsContext } from "./contexts";

export default function GameDataInitializer({
  children,
  gameId,
  gameData,
}: PropsWithChildren<{
  gameId: string;
  gameData: StoredGameData;
}>) {
  const databaseFns = use(DatabaseFnsContext);

  databaseFns.initialize(gameId, gameData);

  return <>{children}</>;
}
