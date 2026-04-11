import { Suspense } from "react";
import "server-only";
import {
  getGameData,
  getGamePassword,
  getSession,
  getTimers,
  TIASession,
} from "../../../../server/util/fetch";
import DataInitializer from "../../../../src/context/DataWrapper";
import { getSessionIdFromCookie } from "../../../../src/util/server";
import { Optional } from "../../../../src/util/types/types";
import DynamicSidebars from "./dynamic-sidebars";
import GameLoader from "./game-loader";

async function fetchGameData(gameId: string, sessionId: Optional<string>) {
  const dataPromise = getGameData(gameId, "games");
  const timerPromise = getTimers(gameId, "timers");
  const passwordPromise = getGamePassword(gameId);
  let sessionPromise: Promise<Optional<TIASession>> =
    Promise.resolve(undefined);
  if (sessionId) {
    sessionPromise = getSession(sessionId);
  }

  const [storedData, timers, password, session] = await Promise.all([
    dataPromise,
    timerPromise,
    passwordPromise,
    sessionPromise,
  ]);

  storedData.timers = timers;
  storedData.gameId = gameId;
  if (password) {
    if (!session) {
      storedData.viewOnly = true;
    } else {
      storedData.viewOnly = !(session.games ?? []).includes(gameId);
    }
  }

  return storedData;
}

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/game/[gameId]">) {
  const { gameId } = await params;

  const sessionId = await getSessionIdFromCookie();

  return (
    <Suspense fallback={<GameLoader />}>
      <DataInitializer gameId={gameId} data={fetchGameData(gameId, sessionId)}>
        <DynamicSidebars />
        {children}
      </DataInitializer>
    </Suspense>
  );
}
