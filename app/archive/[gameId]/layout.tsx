import { createIntl, createIntlCache } from "react-intl";
import "server-only";
import {
  getArchivedGameData,
  getArchivedTimers,
} from "../../../server/util/fetch";
import Footer from "../../../src/components/Footer/Footer";
import DataProvider from "../../../src/context/DataProvider";
import { buildCompleteGameData } from "../../../src/data/GameData";
import { getLocale, getMessages } from "../../../src/util/server";
import DynamicSidebars from "../../game/[gameId]/dynamic-sidebars";
import styles from "./main.module.scss";

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
