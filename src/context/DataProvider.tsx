"use client";

import { PropsWithChildren } from "react";
import { Optional } from "../util/types/types";
import { DataStore } from "./dataStore";
import TimerProvider from "./TimerProvider";

export interface SeedData {
  data: GameData;
  baseData: BaseData;
  storedData: StoredGameData;
}

export default function DataProvider({
  children,
  gameId,
  seedData,
}: PropsWithChildren<{
  gameId: string;
  sessionId: Optional<string>;
  seedData: SeedData;
}>) {
  DataStore.init(gameId, seedData.data, seedData.baseData, seedData.storedData);

  return <>{children}</>;
}
