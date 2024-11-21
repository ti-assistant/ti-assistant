import { Metadata } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import "../public/site.css";
import LangSelectHoverMenu from "../src/components/LangSelectHoverMenu/LangSelectHoverMenu";
import SiteLogo from "../src/components/SiteLogo/SiteLogo";
import { getLocale, getMessages } from "../src/util/server";
import styles from "./root.module.scss";
import Wrapper from "./wrapper";
import SharedModal from "../src/data/SharedModal";

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  description:
    "Help your Twilight Imperium 4 games run more smoothly with TI Assistant, a fully featured assistant application that can be used by any number of players on their phone and on a shared screen.",
  icons: {
    shortcut: "/images/favicon.ico",
  },
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
          <Link href={"/"} className={styles.HomeLink}>
            <div className={styles.Logo}>
              <SiteLogo />
            </div>
            Twilight Imperium Assistant
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
        <Wrapper locale={locale} messages={messages}>
          <SharedModal />
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
