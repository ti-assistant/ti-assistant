import QRCode from "qrcode";
import { Suspense } from "react";
import "server-only";
import {
  getGameData,
  getGamePassword,
  getSession,
  getTimers,
  TIASession,
} from "../../../../server/util/fetch";
import QRCodeButton from "../../../../src/components/QRCode/QRCodeButton";
import DataInitializer from "../../../../src/context/DataWrapper";
import { getIntl, getSessionIdFromCookie } from "../../../../src/util/server";
import { Optional } from "../../../../src/util/types/types";
import DynamicSidebars from "./dynamic-sidebars";
import GameCode from "./game-code";
import GameLoader from "./game-loader";
import styles from "./game.module.scss";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

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
  params,
}: LayoutProps<"/[locale]/game/[gameId]">) {
  const { gameId, locale } = await params;
  const intlPromise = getIntl(locale);

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
        <DataInitializer
          gameId={gameId}
          data={fetchGameData(gameId, sessionId)}
        >
          <DynamicSidebars />
          {children}
        </DataInitializer>
      </Suspense>
    </>
  );
}
