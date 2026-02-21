import QRCode from "qrcode";
import { Suspense } from "react";
import { IntlShape } from "react-intl";
import "server-only";
import { getGameData, getTimers } from "../../../../server/util/fetch";
import QRCodeButton from "../../../../src/components/QRCode/QRCodeButton";
import DataInitializer from "../../../../src/context/DataWrapper";
import { buildBaseData, buildGameData } from "../../../../src/data/GameData";
import { getIntl } from "../../../../src/util/server";
import DynamicSidebars from "../../game/[gameId]/dynamic-sidebars";
import GameCode from "../../game/[gameId]/game-code";
import GameLoader from "../../game/[gameId]/game-loader";
import styles from "./main.module.scss";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

async function fetchGameData(gameId: string) {
  const dataPromise = getGameData(gameId, "archive");
  const timerPromise = getTimers(gameId, "archiveTimers");

  const [storedData, timers] = await Promise.all([dataPromise, timerPromise]);

  storedData.timers = timers;
  storedData.gameId = gameId;
  storedData.viewOnly = true;

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
  phase,
  summary,
  params,
}: LayoutProps<"/[locale]/archive/[gameId]">) {
  const { gameId, locale } = await params;
  const intlPromise = getIntl(locale);

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
        <DataInitializer archive gameId={gameId} data={fetchGameData(gameId)}>
          <DynamicSidebars />
          <div className={styles.Main}>
            {phase}
            {summary}
          </div>
          {children}
        </DataInitializer>
      </Suspense>
    </>
  );
}
