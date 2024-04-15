import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import "../public/site.css";
import LanguageSelectRadialMenu from "../src/components/LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import ResponsiveLogo from "../src/components/ResponsiveLogo/ResponsiveLogo";
import { getLocale, getMessages } from "../src/util/server";
import styles from "./root.module.scss";
import Wrapper from "./wrapper";

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  description:
    "Help your Twilight Imperium 4 games run more smoothly with TI Assistant, a fully featured assistant application that can be used by any number of players on their phone and on a shared screen.",
  icons: {
    shortcut: "/images/favicon.ico",
  },
};

const SUPPORTED_LOCALES = ["en", "de"];

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
