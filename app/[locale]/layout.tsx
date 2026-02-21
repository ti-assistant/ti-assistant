import { Metadata, Viewport } from "next";
import Link from "next/link";
import { CSSProperties, PropsWithChildren, Suspense } from "react";
import "../../public/site.css";
import LangSelectHoverMenu from "../../src/components/LangSelectHoverMenu/LangSelectHoverMenu";
import SettingsButton from "../../src/components/SettingsModal/SettingsButton";
import Sidebars from "../../src/components/Sidebars/Sidebars";
import SiteLogo from "../../src/components/SiteLogo/SiteLogo";
import DataStoreWrapper from "../../src/context/DataStoreWrapper";
import ModalProvider from "../../src/context/ModalProvider";
import TimerProvider from "../../src/context/TimerProvider";
import { getMessages, getSettings } from "../../src/util/server";
import { Settings } from "../../src/util/settings";
import { Optional } from "../../src/util/types/types";
import styles from "./root.module.scss";
import ServiceWorkerWrapper from "./ServiceWorkerWrapper";
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

const SUPPORTED_LOCALES = ["en", "de", "fr", "ru", "pl"];

interface FontStyle extends CSSProperties {
  "--main-font": string;
}

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "de" },
    { locale: "fr" },
    { locale: "ru" },
    { locale: "pl" },
  ];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const messagePromise = getMessages(locale);

  const settingsPromise = getSettings();

  let fontSwitchStyle: Optional<FontStyle>;
  switch (locale) {
    case "ru":
      fontSwitchStyle = {
        "--main-font": "Russo One",
      };
      break;
    case "pl":
      fontSwitchStyle = {
        "--main-font": "Myriad Pro",
      };
      break;
  }

  return (
    <html lang={locale}>
      <ServiceWorkerWrapper />
      <body style={fontSwitchStyle}>
        <Suspense fallback={<LoadingLayout />}>
          <InnerLayout
            locale={locale}
            messagePromise={messagePromise}
            settingsPromise={settingsPromise}
          >
            {children}
          </InnerLayout>
        </Suspense>
      </body>
    </html>
  );
}

async function InnerLayout({
  children,
  locale,
  messagePromise,
  settingsPromise,
}: PropsWithChildren<{
  locale: string;
  messagePromise: Promise<Record<string, string>>;
  settingsPromise: Promise<Settings>;
}>) {
  const [messages, settings] = await Promise.all([
    messagePromise,
    settingsPromise,
  ]);

  return (
    <Wrapper locale={locale} messages={messages}>
      <DataStoreWrapper locale={locale}>
        <SettingsProvider initialSettings={settings}>
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
        </SettingsProvider>
      </DataStoreWrapper>
    </Wrapper>
  );
}

function LoadingLayout() {
  return (
    <>
      <Sidebars left="TI ASSISTANT" right="TI ASSISTANT" />
      <div className={styles.Loader}>
        <div className={styles.LoadingLogo}>
          <SiteLogo />
        </div>
        Twilight Imperium Assistant
      </div>
    </>
  );
}
