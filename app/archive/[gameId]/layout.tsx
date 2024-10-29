import Link from "next/link";
import QRCode from "qrcode";
import { createIntl, createIntlCache } from "react-intl";
import "server-only";
import {
  getArchivedGameData,
  getArchivedTimers,
} from "../../../server/util/fetch";
import Footer from "../../../src/components/Footer/Footer";
import DataProvider from "../../../src/context/DataProvider";
import { buildCompleteGameData } from "../../../src/data/GameData";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";
import { getLocale, getMessages } from "../../../src/util/server";
import DynamicSidebars from "./dynamic-sidebars";
import styles from "./main.module.scss";
import ArchiveFooter from "./ArchiveFooter";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default async function Layout({
  phase,
  summary,
  params: { gameId },
}: {
  params: { gameId: string };
  phase: React.ReactNode;
  summary: React.ReactNode;
}) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);

  const storedGameData = await getArchivedGameData(gameId);
  const gameData = buildCompleteGameData(storedGameData, intl);

  const storedTimers = await getArchivedTimers(gameId);

  const qrCode = await new Promise<string>((resolve) => {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: 172,
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

  return (
    <DataProvider
      archive
      gameId={gameId}
      seedData={gameData}
      seedTimers={storedTimers}
    >
      <DynamicSidebars />
      <div className={styles.QRCode}>
        {intl.formatMessage({
          id: "+XKsgE",
          description: "Text used to identify the current game.",
          defaultMessage: "Game",
        })}
        : {gameId}
      </div>
      <div className={styles.Main}>
        {phase}
        {summary}
      </div>
      <Footer viewOnly />
    </DataProvider>
  );
}
