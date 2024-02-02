import { Metadata } from "next";
import React from "react";
import "../public/FactionSummary.css";
import "../public/game.css";
import "../public/loader.css";
import "../public/planet_row.css";
import "../public/resources.css";
import "../public/site.css";
import { getLocale, getMessages } from "../src/util/server";
import Wrapper from "./wrapper";
import Link from "next/link";
import ResponsiveLogo from "../src/components/ResponsiveLogo/ResponsiveLogo";
import styles from "./root.module.scss";
import LanguageSelectRadialMenu from "../src/components/LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import Cookies from "js-cookie";

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  icons: {
    shortcut: "/images/favicon.ico",
  },
};

const SUPPORTED_LOCALES = ["en"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <Link href={"/"} className={styles.HomeLink}>
          <div>
            <ResponsiveLogo size={"100%"} />
          </div>
          Twilight Imperium Assistant
        </Link>
        <div className={styles.LangSelect}>
          <LanguageSelectRadialMenu
            selectedLocale={locale}
            locales={SUPPORTED_LOCALES}
            invalidLocales={[locale]}
            size={28}
          />
        </div>
        <Wrapper locale={locale} messages={messages}>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
