import { PropsWithChildren } from "react";
import DataProvider from "./DataProvider";
import { Optional } from "../util/types/types";

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
  data: Promise<GameData>;
}>) {
  const seedData = await data;

  return (
    <DataProvider
      gameId={gameId}
      sessionId={sessionId}
      seedData={seedData}
      archive={archive}
    >
      {children}
    </DataProvider>
  );
}
