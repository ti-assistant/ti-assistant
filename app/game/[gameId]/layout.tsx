import QRCode from "qrcode";
import { PropsWithChildren, Suspense } from "react";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import {
  getGameData,
  getGamePassword,
  getSession,
  getTimers,
  TIASession,
} from "../../../server/util/fetch";
import QRCodeButton from "../../../src/components/QRCode/QRCodeButton";
import DataWrapper from "../../../src/context/DataWrapper";
import { buildBaseData, buildGameData } from "../../../src/data/GameData";
import {
  getLocale,
  getMessages,
  getSessionIdFromCookie,
} from "../../../src/util/server";
import { Optional } from "../../../src/util/types/types";
import DynamicSidebars from "./dynamic-sidebars";
import GameCode from "./game-code";
import GameLoader from "./game-loader";
import styles from "./game.module.scss";
const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

async function fetchGameData(
  gameId: string,
  sessionId: Optional<string>,
  intlPromise: Promise<IntlShape>
) {
  const intl = await intlPromise;
  const dataPromise = getGameData(gameId);
  const timerPromise = getTimers(gameId);
  const passwordPromise = getGamePassword(gameId);
  let sessionPromise: Promise<Optional<TIASession>> =
    Promise.resolve(undefined);
  if (sessionId) {
    sessionPromise = getSession(sessionId);
  }

  const [data, timers, password, session] = await Promise.all([
    dataPromise,
    timerPromise,
    passwordPromise,
    sessionPromise,
  ]);

  const baseData = buildBaseData(intl);
  const gameData = buildGameData(data, intl);
  gameData.timers = timers;
  gameData.gameId = gameId;
  if (password) {
    if (!session) {
      gameData.viewOnly = true;
    } else {
      gameData.viewOnly = !(session.games ?? []).includes(gameId);
    }
  }

  return { data: gameData, baseData: baseData, storedData: data };
}

async function getIntl() {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  return createIntl({ locale, messages }, cache);
}

function getQRCode(gameId: string, size: number): Promise<string> {
  return new Promise<string>((resolve) => {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: size,
        margin: 2,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        resolve(url);
      }
    );
  });
}

export default async function Layout({
  children,
  params: { gameId },
}: PropsWithChildren<{ params: { gameId: string } }>) {
  const intlPromise = getIntl();

  const qrCodePromise = getQRCode(gameId, 280);

  const qrCode = await qrCodePromise;

  const sessionId = getSessionIdFromCookie();

  return (
    <>
      <div className={styles.QRCode}>
        <GameCode gameId={gameId} intlPromise={intlPromise} qrCode={qrCode} />
      </div>
      <div className={styles.MobileQRCode}>
        <QRCodeButton gameId={gameId} qrCode={qrCode} />
      </div>
      <Suspense fallback={<GameLoader />}>
        <DataWrapper
          gameId={gameId}
          sessionId={sessionId}
          data={fetchGameData(gameId, sessionId, intlPromise)}
        >
          <DynamicSidebars />
          {children}
        </DataWrapper>
      </Suspense>
    </>
  );
}
