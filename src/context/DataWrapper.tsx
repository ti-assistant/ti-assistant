import { PropsWithChildren } from "react";
import DataProvider from "./DataProvider";

export default async function DataWrapper({
  archive = false,
  children,
  data,
  gameId,
}: PropsWithChildren<{
  archive?: boolean;
  gameId: string;
  data: Promise<GameData>;
}>) {
  const seedData = await data;

  return (
    <DataProvider gameId={gameId} seedData={seedData} archive={archive}>
      {children}
    </DataProvider>
  );
}
