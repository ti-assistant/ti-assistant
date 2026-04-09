import QRCode from "qrcode";
import { Suspense } from "react";
import "server-only";
import { getGameData, getTimers } from "../../../../server/util/fetch";
import DataInitializer from "../../../../src/context/DataWrapper";
import DynamicSidebars from "../../game/[gameId]/dynamic-sidebars";
import GameLoader from "../../game/[gameId]/game-loader";
import SummaryColumn from "../../game/[gameId]/main/summary-column/SummaryColumn";
import styles from "./main.module.scss";
import Phase from "./phase";

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
  params,
}: LayoutProps<"/[locale]/archive/[gameId]">) {
  const { gameId } = await params;

  return (
    <Suspense fallback={<GameLoader />}>
      <DataInitializer archive gameId={gameId} data={fetchGameData(gameId)}>
        <DynamicSidebars />
        <div className={styles.Main}>
          <Phase />
          <SummaryColumn />
        </div>
        {children}
      </DataInitializer>
    </Suspense>
  );
}
