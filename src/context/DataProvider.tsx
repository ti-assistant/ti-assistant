"use client";

import { PropsWithChildren, useEffect } from "react";
import { useIntl } from "react-intl";
import DataManager from "./DataManager";

export default function DataProvider({
  archive = false,
  children,
  gameId,
  seedData,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  seedData: GameData;
}>) {
  const intl = useIntl();

  DataManager.init(gameId, seedData, intl, archive);

  useEffect(() => {
    return DataManager.listen(gameId);
  }, [gameId]);

  return <>{children}</>;
}
