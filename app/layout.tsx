import { Metadata, Viewport } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import "../public/site.css";
import LangSelectHoverMenu from "../src/components/LangSelectHoverMenu/LangSelectHoverMenu";
import SiteLogo from "../src/components/SiteLogo/SiteLogo";
import { getLocale, getMessages } from "../src/util/server";
import styles from "./root.module.scss";
import Wrapper from "./wrapper";
import SharedModal, { useSharedModal } from "../src/data/SharedModal";
import { rem } from "../src/util/util";
import SettingsSVG from "../src/icons/ui/Settings";
import SettingsButton from "../src/components/SettingsModal/SettingsButton";

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
  const locale = getLocale();
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
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
        <Wrapper locale={locale} messages={messages}>
          <SharedModal />
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
