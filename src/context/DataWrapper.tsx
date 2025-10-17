import { PropsWithChildren } from "react";
import { Optional } from "../util/types/types";
import DataProvider from "./DataProvider";
import DBListener from "./DBListener";

export default async function DataWrapper({
  archive = false,
  children,
  data,
  gameId,
  sessionId,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  sessionId: Optional<string>;
  data: Promise<{
    data: GameData;
    baseData: BaseData;
    storedData: StoredGameData;
  }>;
}>) {
  const seedData = await data;

  return (
    <>
      <DBListener gameId={gameId} archive={archive} />
      <DataProvider
        gameId={gameId}
        sessionId={sessionId}
        seedData={structuredClone(seedData)}
      >
        {children}
      </DataProvider>
    </>
  );
}
