import { Suspense } from "react";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import {
  getArchivedGameData,
  getArchivedTimers,
} from "../../../server/util/fetch";
import Footer from "../../../src/components/Footer/Footer";
import DataWrapper from "../../../src/context/DataWrapper";
import { buildGameData } from "../../../src/data/GameData";
import {
  getLocale,
  getMessages,
  getSessionIdFromCookie,
} from "../../../src/util/server";
import DynamicSidebars from "../../game/[gameId]/dynamic-sidebars";
import GameLoader from "../../game/[gameId]/game-loader";
import styles from "./main.module.scss";

async function fetchGameData(gameId: string, intlPromise: Promise<IntlShape>) {
  const intl = await intlPromise;
  const dataPromise = getArchivedGameData(gameId);
  const timerPromise = getArchivedTimers(gameId);

  const [data, timers] = await Promise.all([dataPromise, timerPromise]);

  const gameData = buildGameData(data, intl);
  gameData.timers = timers;
  gameData.gameId = gameId;
  gameData.viewOnly = true;

  return gameData;
}

async function getIntl() {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  return createIntl({ locale, messages }, cache);
}

export default async function Layout({
  phase,
  summary,
  params: { gameId },
}: {
  params: { gameId: string };
  phase: React.ReactNode;
  summary: React.ReactNode;
}) {
  const intlPromise = getIntl();

  const sessionId = getSessionIdFromCookie();

  return (
    <>
      <div className={styles.QRCode}>Game: {gameId}</div>
      <Suspense fallback={<GameLoader />}>
        <DataWrapper
          archive
          gameId={gameId}
          sessionId={sessionId}
          data={fetchGameData(gameId, intlPromise)}
        >
          <DynamicSidebars />
          <div className={styles.Main}>
            {phase}
            {summary}
          </div>
          <Footer />
        </DataWrapper>
      </Suspense>
    </>
  );
}
