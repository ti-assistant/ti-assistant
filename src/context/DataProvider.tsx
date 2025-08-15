"use client";

import { PropsWithChildren, useEffect } from "react";
import { useIntl } from "react-intl";
import DataManager from "./DataManager";
import { Optional } from "../util/types/types";

export default function DataProvider({
  archive = false,
  children,
  gameId,
  sessionId,
  seedData,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  sessionId: Optional<string>;
  seedData: GameData;
}>) {
  const intl = useIntl();

  DataManager.init(gameId, sessionId, seedData, intl, archive);

  useEffect(() => {
    return DataManager.listen(gameId);
  }, [gameId]);

  return <>{children}</>;
}
