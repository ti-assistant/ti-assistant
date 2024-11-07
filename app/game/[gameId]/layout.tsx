import { PropsWithChildren, Suspense } from "react";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import { getGameData, getTimers } from "../../../server/util/fetch";
import DataWrapper from "../../../src/context/DataWrapper";
import { buildCompleteGameData } from "../../../src/data/GameData";
import { getLocale, getMessages } from "../../../src/util/server";
import DynamicSidebars from "./dynamic-sidebars";
import GameCode from "./game-code";
import GameLoader from "./game-loader";
import styles from "./game.module.scss";

async function fetchGameData(gameId: string, intlPromise: Promise<IntlShape>) {
  const intl = await intlPromise;
  const dataPromise = getGameData(gameId);
  const timerPromise = getTimers(gameId);

  const [data, timers] = await Promise.all([dataPromise, timerPromise]);

  const gameData = buildCompleteGameData(data, intl);
  gameData.timers = timers;
  gameData.gameId = gameId;

  return gameData;
}

async function getIntl() {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  return createIntl({ locale, messages }, cache);
}

export default async function Layout({
  children,
  params: { gameId },
}: PropsWithChildren<{ params: { gameId: string } }>) {
  const intlPromise = getIntl();

  return (
    <>
      <div className={styles.QRCode}>
        <GameCode gameId={gameId} intlPromise={intlPromise} />
      </div>
      <Suspense fallback={<GameLoader />}>
        <DataWrapper gameId={gameId} data={fetchGameData(gameId, intlPromise)}>
          <DynamicSidebars />
          {children}
        </DataWrapper>
      </Suspense>
    </>
  );
}
