import Link from "next/link";
import { PropsWithChildren } from "react";
import LangSelectHoverMenu from "../../src/components/LangSelectHoverMenu/LangSelectHoverMenu";
import Sidebars from "../../src/components/Sidebars/Sidebars";
import SiteLogo from "../../src/components/SiteLogo/SiteLogo";
import DataStoreWrapper from "../../src/context/DataStoreWrapper";
import ModalProvider from "../../src/context/ModalProvider";
import TimerProvider from "../../src/context/TimerProvider";
import NavBarButtons from "./NavBarButtons";
import styles from "./root.module.scss";
import Wrapper, { SettingsProvider } from "./wrapper";

const SUPPORTED_LOCALES = ["en", "de", "fr", "ru", "pl", "pt-BR"];

export async function InnerLayout({
  children,
  locale,
  messagePromise,
}: PropsWithChildren<{
  locale: string;
  messagePromise: Promise<Record<string, string>>;
}>) {
  const [messages] = await Promise.all([messagePromise]);

  return (
    <Wrapper locale={locale} messages={messages}>
      <DataStoreWrapper locale={locale}>
        <SettingsProvider>
          <TimerProvider>
            <ModalProvider>
              <div className={styles.NavBar}>
                <div className="flexRow" style={{ marginInlineEnd: "auto" }}>
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
                      size={24}
                    />
                  </div>
                </div>
                <NavBarButtons />
              </div>
              {children}
            </ModalProvider>
          </TimerProvider>
        </SettingsProvider>
      </DataStoreWrapper>
    </Wrapper>
  );
}

export function LoadingLayout() {
  return (
    <>
      <Sidebars left="TI ASSISTANT" right="TI ASSISTANT" />
      <div className={styles.Loader}>
        <div className={styles.LoadingLogo}>
          <SiteLogo />
        </div>
        TI Assistant
      </div>
    </>
  );
}
