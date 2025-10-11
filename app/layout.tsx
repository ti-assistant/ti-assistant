import { Metadata, Viewport } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import "../public/site.css";
import LangSelectHoverMenu from "../src/components/LangSelectHoverMenu/LangSelectHoverMenu";
import SettingsButton from "../src/components/SettingsModal/SettingsButton";
import SiteLogo from "../src/components/SiteLogo/SiteLogo";
import DataPubSubProvider from "../src/context/DataPubSubProvider";
import ModalProvider from "../src/context/ModalProvider";
import TimerProvider from "../src/context/TimerProvider";
import { getLocale, getMessages, getSettings } from "../src/util/server";
import styles from "./root.module.scss";
import Wrapper, { SettingsProvider } from "./wrapper";

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  description:
    "Help your Twilight Imperium 4 games run more smoothly with TI Assistant, a fully featured assistant application that can be used by any number of players on their phone and on a shared screen.",
  icons: {
    shortcut: "/images/favicon.ico",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

const SUPPORTED_LOCALES = ["en", "de"];

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages(locale);

  const settings = await getSettings();

  return (
    <html lang={locale}>
      <body>
        <Wrapper locale={locale} messages={messages}>
          <SettingsProvider initialSettings={settings}>
            <DataPubSubProvider>
              <TimerProvider>
                <ModalProvider>
                  <div className={styles.NavBar}>
                    <div className="flexRow">
                      <Link href={"/"} className={styles.HomeLink}>
                        <div className={styles.Logo}>
                          <SiteLogo />
                        </div>
                        <span className={styles.FullName}>
                          Twilight Imperium Assistant
                        </span>
                        <span className={styles.ShortName}>TI Assistant</span>
                      </Link>
                      <div className={styles.LangSelect}>
                        <LangSelectHoverMenu
                          selectedLocale={locale}
                          locales={SUPPORTED_LOCALES}
                          invalidLocales={[locale]}
                          size={28}
                        />
                      </div>
                    </div>
                    <div className={styles.Settings}>
                      <SettingsButton />
                    </div>
                  </div>
                  {children}
                </ModalProvider>
              </TimerProvider>
            </DataPubSubProvider>
          </SettingsProvider>
        </Wrapper>
      </body>
    </html>
  );
}
