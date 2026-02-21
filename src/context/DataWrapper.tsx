import { PropsWithChildren } from "react";
import DBListener from "./DBListener";
import GameDataInitializer from "./GameData";

export default async function DataInitializer({
  archive = false,
  children,
  data,
  gameId,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  data: Promise<StoredGameData>;
}>) {
  const gameData = await data;

  return (
    <>
      <DBListener gameId={gameId} archive={archive} />
      <GameDataInitializer gameId={gameId} gameData={structuredClone(gameData)}>
        {children}
      </GameDataInitializer>
    </>
  );
}
