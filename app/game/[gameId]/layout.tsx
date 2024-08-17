import Link from "next/link";
import QRCode from "qrcode";
import { PropsWithChildren } from "react";
import { createIntl, createIntlCache } from "react-intl";
import "server-only";
import { getGameData, getTimers } from "../../../server/util/fetch";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";
import DataProvider from "../../../src/context/DataProvider";
import { buildCompleteGameData } from "../../../src/data/GameData";
import { getLocale, getMessages } from "../../../src/util/server";
import DynamicSidebars from "./dynamic-sidebars";
import styles from "./game.module.scss";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default async function Layout({
  children,
  params: { gameId },
}: PropsWithChildren<{ params: { gameId: string } }>) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);

  const storedGameData = await getGameData(gameId);
  const gameData = buildCompleteGameData(storedGameData, intl);

  const storedTimers = await getTimers(gameId);

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
    <DataProvider gameId={gameId} seedData={gameData} seedTimers={storedTimers}>
      <DynamicSidebars />
      <div className={styles.QRCode}>
        <ClientOnlyHoverMenu
          label={`${intl.formatMessage({
            id: "+XKsgE",
            description: "Text used to identify the current game.",
            defaultMessage: "Game",
          })}: ${gameId}`}
        >
          <div className="flexColumn">
            <Link href={`/game/${gameId}`}>
              <img src={qrCode} alt="QR Code for joining game" />
            </Link>
          </div>
        </ClientOnlyHoverMenu>
      </div>
      {children}
    </DataProvider>
  );
}
