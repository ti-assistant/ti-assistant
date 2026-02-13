import QRCode from "qrcode";
import { PropsWithChildren, Suspense } from "react";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import { getGameData, getTimers } from "../../../server/util/fetch";
import Footer from "../../../src/components/Footer/Footer";
import DataWrapper from "../../../src/context/DataWrapper";
import { buildBaseData, buildGameData } from "../../../src/data/GameData";
import {
  getLocale,
  getMessages,
  getSessionIdFromCookie,
} from "../../../src/util/server";
import { intlErrorFn } from "../../../src/util/util";
import DynamicSidebars from "../../game/[gameId]/dynamic-sidebars";
import GameLoader from "../../game/[gameId]/game-loader";
import styles from "./main.module.scss";
import QRCodeButton from "../../../src/components/QRCode/QRCodeButton";
import GameCode from "../../game/[gameId]/game-code";
const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

async function fetchGameData(gameId: string, intlPromise: Promise<IntlShape>) {
  const intl = await intlPromise;
  const dataPromise = getGameData(gameId, "archive");
  const timerPromise = getTimers(gameId, "archiveTimers");

  const [data, timers] = await Promise.all([dataPromise, timerPromise]);

  const baseData = buildBaseData(intl);
  const gameData = buildGameData(data, intl);
  gameData.timers = timers;
  gameData.gameId = gameId;
  gameData.viewOnly = true;

  return { data: gameData, baseData: baseData, storedData: data };
}

async function getIntl() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  return createIntl({ locale, messages, onError: intlErrorFn as any }, cache);
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
      },
    );
  });
}

export default async function Layout({
  children,
  phase,
  summary,
  params,
}: PropsWithChildren<{
  params: Promise<{ gameId: string }>;
  phase: React.ReactNode;
  summary: React.ReactNode;
}>) {
  const { gameId } = await params;
  const intlPromise = getIntl();

  const qrCodePromise = getQRCode(gameId, 280);

  const qrCode = await qrCodePromise;

  const sessionId = await getSessionIdFromCookie();

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
          {children}
        </DataWrapper>
      </Suspense>
    </>
  );
}
