import { PropsWithChildren, Suspense } from "react";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import { getGameData, getTimers } from "../../../server/util/fetch";
import QRCodeButton from "../../../src/components/QRCode/QRCodeButton";
import DataWrapper from "../../../src/context/DataWrapper";
import { buildGameData } from "../../../src/data/GameData";
import { getLocale, getMessages } from "../../../src/util/server";
import DynamicSidebars from "./dynamic-sidebars";
import GameCode from "./game-code";
import GameLoader from "./game-loader";
import styles from "./game.module.scss";
import QRCode from "qrcode";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

async function fetchGameData(gameId: string, intlPromise: Promise<IntlShape>) {
  const intl = await intlPromise;
  const dataPromise = getGameData(gameId);
  const timerPromise = getTimers(gameId);

  const [data, timers] = await Promise.all([dataPromise, timerPromise]);

  const gameData = buildGameData(data, intl);
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

  return (
    <>
      <div className={styles.QRCode}>
        <GameCode gameId={gameId} intlPromise={intlPromise} qrCode={qrCode} />
      </div>
      <div className={styles.MobileQRCode}>
        <QRCodeButton gameId={gameId} qrCode={qrCode} />
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
